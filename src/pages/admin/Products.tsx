import { useState } from 'react';
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
import { Edit, Trash2, Plus, CircleX } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { formatDate } from '@/lib/helpers';
import {
  deleteProduct,
  useGetAllProducts,
  type Product,
} from '@/services/network/libs/products';
import CreateProductModal from '@/components/product/CreateProductModal';
import EditProductModal from '@/components/product/EditProductModal';
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

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [editProductId, setEditProductId] = useState<number>(0);

  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useGetAllProducts();

  const filteredProducts: Product[] =
    products?.filter((product) => {
      const term = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(term) ||
        (product.description ?? '').toLowerCase().includes(term) ||
        (product.category?.name ?? '').toLowerCase().includes(term)
      );
    }) ?? [];

  const onEditClick = (productId: number) => {
    setEditProductId(productId);
    setOpenEditModal(true);
  };

  const onDeleteClick = (productId: number) => {
    setDeleteProductId(productId);
    setOpenDeleteModal(true);
  };

  const onConfirmDelete = async () => {
    if (!deleteProductId) return;

    await deleteProduct(deleteProductId)
      .catch((error) => {
        console.log('Delete product error:', error);
      })
      .finally(() => {
        refetch();
        setDeleteProductId(null);
        setOpenDeleteModal(false);
      });
  };

  if (isError) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="flex items-center flex-col gap-y-5">
          <CircleX className="w-[60px] h-[60px] text-red-500" />
          <h2 className="text-2xl font-semibold">Failed to load products</h2>
          <p className="text-center text-muted-foreground">
            There was an error while fetching products. Please try again later.
          </p>
          <Button onClick={() => refetch()} className="w-fit mx-auto">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => setOpenCreateModal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Product
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Search by name, description, or category..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex w-full items-center justify-center py-5 h-[calc(100vh-250px)]">
          <Spinner className="w-10 h-10" />
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          {/* Create Product Modal */}
          <CreateProductModal
            isOpen={openCreateModal}
            refetch={refetch}
            setOpenCreateModal={setOpenCreateModal}
          />

          {/* Edit Product Modal */}
          <EditProductModal
            isOpen={openEditModal}
            productId={editProductId}
            refetch={refetch}
            setOpenEditModal={setOpenEditModal}
          />

          {/* Delete Product Confirmation Modal */}
          <AlertDialog
            open={openDeleteModal}
            onOpenChange={setOpenDeleteModal}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  product and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-500/90"
                  onClick={onConfirmDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description ?? '-'}</TableCell>
                  <TableCell>
                    {typeof product.price === 'string'
                      ? `$${parseFloat(product.price).toFixed(2)}`
                      : `$${product.price.toFixed(2)}`}
                  </TableCell>
                  <TableCell>{product.category?.name ?? '-'}</TableCell>
                  <TableCell>{formatDate(product.createdAt)}</TableCell>
                  <TableCell>{formatDate(product.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditClick(product.id)}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteClick(product.id)}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
