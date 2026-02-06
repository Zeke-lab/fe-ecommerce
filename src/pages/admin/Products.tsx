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
import { Edit, Trash2, Plus } from 'lucide-react';
import CreateProductModal from '@/components/products/CreateProductModal';
import EditProductModal from '@/components/products/EditProductModal';
import { useGetAllCategories } from '@/services/network/libs/categories';
import {
  deleteProduct,
  useGetAllProducts,
} from '@/services/network/libs/products';
import { Spinner } from '@/components/ui/spinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const ITEMS_PER_PAGE = 5;

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openCreateProductModal, setOpenCreateProductModal] = useState(false);
  const [openEditProductModal, setOpenEditProductModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);

  const { data: categories } = useGetAllCategories();
  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useGetAllProducts();

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      const term = searchTerm.toLowerCase();
      const categoryName = product.category?.name ?? '';
      return (
        product.name.toLowerCase().includes(term) ||
        product.id.toString().includes(term) ||
        categoryName.toLowerCase().includes(term)
      );
    });
  }, [products, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleEdit = (id: number) => {
    setSelectedProductId(id);
    setOpenEditProductModal(true);
  };

  const handleDelete = (id: number) => {
    setDeleteProductId(id);
    setOpenDeleteModal(true);
  };

  const onConfirmDelete = async () => {
    if (!deleteProductId) return;

    await deleteProduct(deleteProductId).catch((error) =>
      console.log('Delete product error:', error),
    );

    setOpenDeleteModal(false);
    setDeleteProductId(null);
    refetch();
  };

  const handleEditModalToggle: React.Dispatch<React.SetStateAction<boolean>> = (
    value,
  ) => {
    setOpenEditProductModal((prev) => {
      const nextValue = typeof value === 'function' ? value(prev) : value;
      if (!nextValue) {
        setSelectedProductId(null);
      }
      return nextValue;
    });
  };

  const handleDeleteModalToggle = (open: boolean) => {
    setOpenDeleteModal(open);
    if (!open) {
      setDeleteProductId(null);
    }
  };

  const formatPrice = (price: string) => {
    const value = Number(price);
    if (Number.isNaN(value)) return price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className='flex w-full items-center justify-center py-5 h-[calc(100vh-250px)]'>
        <Spinner className='w-10 h-10' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='h-screen w-full flex items-center justify-center'>
        <div className='flex items-center flex-col gap-y-5'>
          <h2 className='text-2xl font-semibold'>Failed to load products</h2>
          <p className='text-center text-muted-foreground'>
            There was an error while fetching products. Please try again later.
          </p>
          <Button onClick={() => refetch()} className='w-fit mx-auto'>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <CreateProductModal
        isOpen={openCreateProductModal}
        setOpenCreateModal={setOpenCreateProductModal}
        categories={categories ?? []}
        refetch={refetch}
      />

      {selectedProductId && (
        <EditProductModal
          isOpen={openEditProductModal}
          productId={selectedProductId}
          setOpenEditModal={handleEditModalToggle}
          categories={categories ?? []}
          refetch={refetch}
        />
      )}

      <AlertDialog open={openDeleteModal} onOpenChange={handleDeleteModalToggle}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone and will permanently remove the
              product from your catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className='bg-red-500 hover:bg-red-500/90'
              onClick={onConfirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className='space-y-4 fade-in'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Products</h1>
          <Button
            onClick={() => setOpenCreateProductModal(true)}
            className='gap-2'
          >
            <Plus className='w-4 h-4' />
            Create Product
          </Button>
        </div>

        <div className='flex items-center gap-2'>
          <Input
            placeholder='Search by name, id, or category...'
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
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className='text-center py-10'>
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className='font-medium'>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>{product.category?.name ?? '-'}</TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end gap-2'>
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
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages || 1, p + 1))
              }
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
