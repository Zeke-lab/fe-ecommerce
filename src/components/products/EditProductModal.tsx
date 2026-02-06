import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormik } from 'formik';
import { number, object, string, type ObjectSchema } from 'yup';
import { useCustomEvents } from '@/services/formik/hooks';
import type { Category } from '@/services/network/libs/categories';
import {
  updateProduct,
  useGetProductById,
} from '@/services/network/libs/products';
import { useEffect } from 'react';
import type { CreateProductFormValues } from './CreateProductModal';

interface Props {
  isOpen: boolean;
  productId: number;
  setOpenEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  categories: Category[];
  refetch: () => void;
}

const EditProductModal = ({
  isOpen,
  productId,
  setOpenEditModal,
  categories,
  refetch,
}: Props) => {
  const { data: productData } = useGetProductById(productId, isOpen);

  const initialValues: CreateProductFormValues = {
    name: productData?.name ?? '',
    description: productData?.description ?? '',
    price: productData ? Number(productData.price) : 0,
    imageUrl: productData?.imageUrl ?? '',
    categoryId: productData?.categoryId ?? 0,
  };

  const validationSchema: ObjectSchema<CreateProductFormValues> = object().shape({
    name: string().required('Product name is required!'),
    description: string().optional(),
    price: number()
      .typeError('Price must be a number!')
      .positive('Price must be greater than zero!')
      .required('Price is required!'),
    imageUrl: string().url('Provide a valid image URL.').optional(),
    categoryId: number()
      .typeError('Please select a category')
      .positive('Please select a category')
      .required('Category is required!'),
  });

  const onSubmit = async (values: CreateProductFormValues) => {
    const payload = {
      ...values,
      price: Number(values.price),
    };

    const response = await updateProduct(productId, payload).catch((err) =>
      console.log('Update product error:', err),
    );

    if (response) {
      refetch();
      setOpenEditModal(false);
    }
  };

  const formik = useFormik<CreateProductFormValues>({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  const { onInputChange } = useCustomEvents<CreateProductFormValues>(formik);

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen, formik]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpenEditModal}>
      <DialogContent className='sm:max-w-125'>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the product details below
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Product Name</Label>
              <Input
                id='name'
                name='name'
                placeholder='e.g., Wireless Mouse'
                onChange={onInputChange}
                value={formik.values.name}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='description'>Product Description</Label>
              <Input
                id='description'
                name='description'
                placeholder='Short description'
                onChange={onInputChange}
                value={formik.values.description}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='price'>Price</Label>
              <Input
                id='price'
                name='price'
                type='number'
                step='0.01'
                min='0'
                placeholder='e.g., 99.99'
                value={formik.values.price > 0 ? formik.values.price : ''}
                onChange={(event) => {
                  formik.setFieldError('price', '');
                  formik.setFieldValue(
                    'price',
                    event.target.value ? Number(event.target.value) : 0,
                  );
                }}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='imageUrl'>Image URL</Label>
              <Input
                id='imageUrl'
                name='imageUrl'
                placeholder='https://example.com/product.jpg'
                onChange={onInputChange}
                value={formik.values.imageUrl}
              />
            </div>
            <div className='space-y-2'>
              <Label>Category</Label>
              <Select
                value={
                  formik.values.categoryId
                    ? String(formik.values.categoryId)
                    : ''
                }
                onValueChange={(value: string) =>
                  formik.setFieldValue('categoryId', Number(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select a category' />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className='mt-5'>
            <Button
              variant='outline'
              type='button'
              onClick={() => setOpenEditModal(false)}
            >
              Cancel
            </Button>
            <Button type='submit'>Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
