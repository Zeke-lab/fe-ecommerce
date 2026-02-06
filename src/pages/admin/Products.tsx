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

// Mock product data
const mockProducts = [
  {
    id: 1,
    code: 'PROD001',
    name: 'Laptop',
    price: 999.99,
    qty: 5,
    category: 'Electronics',
  },
  {
    id: 2,
    code: 'PROD002',
    name: 'Mouse',
    price: 29.99,
    qty: 50,
    category: 'Electronics',
  },
  {
    id: 3,
    code: 'PROD003',
    name: 'Keyboard',
    price: 79.99,
    qty: 30,
    category: 'Electronics',
  },
  {
    id: 4,
    code: 'PROD004',
    name: 'Monitor',
    price: 299.99,
    qty: 10,
    category: 'Electronics',
  },
  {
    id: 5,
    code: 'PROD005',
    name: 'Desk Chair',
    price: 199.99,
    qty: 15,
    category: 'Furniture',
  },
  {
    id: 6,
    code: 'PROD006',
    name: 'Standing Desk',
    price: 449.99,
    qty: 8,
    category: 'Furniture',
  },
  {
    id: 7,
    code: 'PROD007',
    name: 'USB Cable',
    price: 9.99,
    qty: 200,
    category: 'Accessories',
  },
  {
    id: 8,
    code: 'PROD008',
    name: 'Headphones',
    price: 149.99,
    qty: 25,
    category: 'Electronics',
  },
  {
    id: 9,
    code: 'PROD009',
    name: 'Webcam',
    price: 89.99,
    qty: 18,
    category: 'Electronics',
  },
  {
    id: 10,
    code: 'PROD010',
    name: 'Desk Lamp',
    price: 39.99,
    qty: 40,
    category: 'Furniture',
  },
  {
    id: 11,
    code: 'PROD011',
    name: 'Monitor Stand',
    price: 49.99,
    qty: 35,
    category: 'Accessories',
  },
  {
    id: 12,
    code: 'PROD012',
    name: 'Cooling Pad',
    price: 59.99,
    qty: 22,
    category: 'Accessories',
  },
];

const ITEMS_PER_PAGE = 5;

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openCreateProductModal, setOpenCreateProductModal] = useState(false);
  const { data: categories } = useGetAllCategories();

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleView = (id: number) => alert(`View product ${id}`);
  const handleEdit = (id: number) => alert(`Edit product ${id}`);
  const handleDelete = (id: number) => alert(`Delete product ${id}`);
  return (
    <>
      <CreateProductModal
        isOpen={openCreateProductModal}
        setOpenCreateModal={setOpenCreateProductModal}
        categories={categories ?? []}
      />
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
            {paginatedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className='font-medium'>{product.code}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.qty}</TableCell>
                <TableCell>{product.category}</TableCell>
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
            ))}
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
    </>
  );
}
