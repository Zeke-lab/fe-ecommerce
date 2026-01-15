

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
import { Eye, Edit, Trash2, Plus, Loader } from 'lucide-react';
import { useGetAllCategories } from '@/services/network/libs/categories';
import { Spinner } from '@/components/ui/spinner';
import { formatDate } from '@/lib/helpers';
import CreateCategoryModal from '@/components/category/CreateCategoryModal';

// Mock category data
// const categoryData = [
//   { id: 1, name: "Electronics", description: "Devices and gadgets" },
//   { id: 2, name: "Furniture", description: "Home and office furniture" },
//   { id: 3, name: "Accessories", description: "Various accessories" },
//   { id: 4, name: "Clothing", description: "Apparel and accessories" },
//   { id: 5, name: "Books", description: "Literature and reading materials" }
// ]

const ITEMS_PER_PAGE = 5;

export default function Categories() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  // fetch api data for categories here
  const {
    data: categoryData,
    isLoading,
    isError,
    refetch,
  } = useGetAllCategories();

  // const filteredCategories = useMemo(() => {
  //   return categoryData.filter(
  //     (category) =>
  //       category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  //   )
  // }, [searchTerm])

  // const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE)
  // const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  // const paginatedCategories = filteredCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // const handleView = (id: number) => alert(`View category ${id}`)
  // const handleEdit = (id: number) => alert(`Edit category ${id}`)
  // const handleDelete = (id: number) => alert(`Delete category ${id}`)
  // const handleCreateCategory = () => alert("Create category modal")

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
            setCurrentPage(1);
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
            <CreateCategoryModal
              isOpen={openCreateModal}
              refetch={refetch}
              setOpenCreateModal={setOpenCreateModal}
            />

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
                            onClick={() => console.log('edit')}
                            title='Edit'
                          >
                            <Edit className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => console.log('delete')}
                            title='Delete'
                          >
                            <Trash2 className='w-4 h-4 text-destructive' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                {/* {paginatedCategories.map((category) => (
              <TableRow key={category.id}>

                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">

                    <Button variant="ghost" size="sm" onClick={() => handleEdit(category.id)} title="Edit">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(category.id)} title="Delete">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))} */}
              </TableBody>
            </Table>
          </div>

          {/* <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {paginatedCategories.length > 0 ? startIndex + 1 : 0} to{" "}
          {Math.min(startIndex + ITEMS_PER_PAGE, filteredCategories.length)} of {filteredCategories.length} categories
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="text-sm font-medium">
            Page {currentPage} of {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
      </div> */}
        </>
      )}
    </div>
  );
}
