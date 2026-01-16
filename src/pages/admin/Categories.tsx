

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Eye, Edit, Trash2, Plus, Loader, CircleX } from 'lucide-react';
import { deleteCategory, useGetAllCategories } from '@/services/network/libs/categories';
import { Spinner } from '@/components/ui/spinner';
import { formatDate } from '@/lib/helpers';
import CreateCategoryModal from '@/components/category/CreateCategoryModal';
import EditCategoryModal from '@/components/category/EditCategoryModal';



export default function Categories() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null)
  const [editCategoryId, setEditCategoryId] = useState<number>(0)

  // fetch api data for categories here
  const {
    data: categoryData,
    isLoading,
    isError,
    refetch,
  } = useGetAllCategories();

  const onEditClick = (categoryId: number) => {
    setEditCategoryId(categoryId);
    setOpenEditModal(true);
  }

  const onDeleteClick = (categoryId: number) => {
    setDeleteCategoryId(categoryId);
    setOpenDeleteModal(true);
  }

  const onConfirmDelete = async () => {
    await deleteCategory(deleteCategoryId!)
      .catch((error) => {
        console.log('Delete category error:', error);
      }).finally(() => {
        refetch();
        console.log('Deleting category with id:', deleteCategoryId);
        setDeleteCategoryId(null)
        setOpenDeleteModal(false);
      })
  }


  if (isError) {
    return (
      <div className='h-screen w-full flex items-center justify-center'>
        <div className='flex items-center flex-col gap-y-5'>
          <CircleX className='w-[60px] h-[60px] text-red-500' />
          <h2 className='text-2xl font-semibold'>Failed to load categories</h2>
          <p className='text-center text-muted-foreground'>
            There was an error while fetching categories. Please try again
            later.
          </p>
          <Button onClick={() => refetch()} className='w-fit mx-auto'>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4 fade-in'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Categories</h1>
        <Button onClick={() => setOpenCreateModal(true)} className='gap-2'>
          <Plus className='w-4 h-4' />
          Create Category
        </Button>
      </div>

      <div className='flex items-center gap-2'>
        <Input
          placeholder='Search by name, code, or category...'
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            // setCurrentPage(1);
          }}
          className='max-w-sm'
        />
      </div>



      {isLoading ? (
        <div className='flex w-full items-center justify-center py-5 h-[calc(100vh-250px)]'>
          <Spinner className='w-10 h-10' />
        </div>
      ) : (
        <>
          <div className='border rounded-lg overflow-hidden'>
            {/* Create Category Modal */}
            <CreateCategoryModal
              isOpen={openCreateModal}
              refetch={refetch}
              setOpenCreateModal={setOpenCreateModal}
            />

            {/* Edit Category Modal */}
            <EditCategoryModal
              isOpen={openEditModal}
              categoryId={editCategoryId}
              refetch={refetch}
              setOpenEditModal={setOpenEditModal}
            />

            {/* Delete Category Confirmation Modal */}
            <AlertDialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    category and remove all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className='bg-red-500 hover:bg-red-500/90' onClick={onConfirmDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>


            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryData &&
                  categoryData.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.description ?? '-'}</TableCell>
                      <TableCell>{formatDate(category.createdAt)}</TableCell>
                      <TableCell>{formatDate(category.updatedAt)}</TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => onEditClick(category.id)}
                            title='Edit'
                          >
                            <Edit className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => onDeleteClick(category.id)}
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


        </>
      )}
    </div>
  );
}
