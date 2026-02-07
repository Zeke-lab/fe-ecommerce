import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import CreateProductModal from '@/components/products/CreateProductModal';
import { useGetAllCategories } from '@/services/network/libs/categories';
import { useGetAllProducts } from '@/services/network/libs/products';
import { Spinner } from '@/components/ui/spinner';

const ITEMS_PER_PAGE = 5;

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openCreateProductModal, setOpenCreateProductModal] = useState(false);

  const { data: categories } = useGetAllCategories();
  const { data: products, refetch, isLoading, isError } = useGetAllProducts();

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.code?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (product.category?.name.toLowerCase() || '').includes(searchTerm.toLowerCase()),
    );
  }, [products, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleView = (id: number) => {
    // TODO: Implement product view modal/page
    console.log('View product:', id);
  };
  
  const handleEdit = (id: number) => {
    // TODO: Implement product edit modal
    console.log('Edit product:', id);
  };
  
  const handleDelete = (id: number) => {
    // TODO: Implement product delete with confirmation
    console.log('Delete product:', id);
  };
  const handleCreateProduct = () => setOpenCreateProductModal(true);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-[50vh]'>
        <Spinner className='w-8 h-8' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex items-center justify-center h-[50vh]'>
        <p className='text-destructive'>Error loading products. Please try again.</p>
      </div>
    );
  }

  return (
    <div className='space-y-4 fade-in'>
      <CreateProductModal
        isOpen={openCreateProductModal}
        setOpenCreateModal={setOpenCreateProductModal}
        refetch={refetch}
        categories={categories ?? []}
      />
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Products</h1>
        <Button onClick={handleCreateProduct} className='gap-2'>
          <Plus className='w-4 h-4' />
          Create Product
        </Button>
      </div>

      <div className='flex items-center gap-2'>
        <Input
          placeholder='Search by name, code, or category...'
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className='max-w-sm'
        />
      </div>

      <div className='border rounded-lg overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className='text-center text-muted-foreground'>
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className='font-medium'>{product.code || 'N/A'}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                  <TableCell>{product.qty ?? 0}</TableCell>
                  <TableCell>{product.category?.name || 'Uncategorized'}</TableCell>
                  <TableCell className='text-right'>
                  <div className='flex items-center justify-end gap-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleView(product.id)}
                      title='View'
                    >
                      <Eye className='w-4 h-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleEdit(product.id)}
                      title='Edit'
                    >
                      <Edit className='w-4 h-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleDelete(product.id)}
                      title='Delete'
                    >
                      <Trash2 className='w-4 h-4 text-destructive' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>
          Showing {paginatedProducts.length > 0 ? startIndex + 1 : 0} to{' '}
          {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} of{' '}
          {filteredProducts.length} products
        </p>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className='text-sm font-medium'>
            Page {currentPage} of {totalPages || 1}
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
