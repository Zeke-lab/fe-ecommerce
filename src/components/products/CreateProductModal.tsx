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
import { object, string, number, type ObjectSchema } from 'yup';
import { useFormik } from 'formik';
import { useCustomEvents } from '@/services/formik/hooks';
import type { Category } from '@/services/network/libs/categories';
import { createProduct } from '@/services/network/libs/products';

interface Props {
  isOpen: boolean;
  setOpenCreateModal: React.Dispatch<React.SetStateAction<boolean>>;
  categories: Category[];
  refetch?: () => void;
}

export interface CreateProductFormValues {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: number;
}

const CreateProductModal = (props: Props) => {
  const { isOpen, setOpenCreateModal, categories, refetch } = props;

  const initialValues: CreateProductFormValues = {
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    categoryId: 0,
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
    const response = await createProduct(values).catch((err) =>
      console.log('Create product error:', err),
    );

    if (response) {
      refetch?.();
      setOpenCreateModal(false);
    }
  };

  const formik = useFormik<CreateProductFormValues>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const { onInputChange } = useCustomEvents<CreateProductFormValues>(formik);

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldError('price', '');
    const { value } = event.target;
    formik.setFieldValue('price', value ? Number(value) : 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => setOpenCreateModal(false)}>
      <DialogContent className='sm:max-w-125'>
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
          <DialogDescription>
            Add a new product to your catalog
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
                value={formik.values.price || ''}
                onChange={handlePriceChange}
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
            <Button variant='outline' type='button' onClick={() => setOpenCreateModal(false)}>
              Cancel
            </Button>
            <Button type='submit'>Create Product</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductModal;
