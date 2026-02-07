import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { createProduct } from '@/services/network/libs/products';
import type { Category } from '@/services/network/libs/categories';

interface Props {
  isOpen: boolean;
  setOpenCreateModal: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
  categories: Category[];
}

export interface CreateProductFormValues {
  code?: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  qty?: number;
  categoryId?: number;
}

const CreateProductModal = (props: Props) => {
  const { isOpen, refetch, setOpenCreateModal, categories } = props;

  const initialValues: CreateProductFormValues = {
    code: '',
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    qty: 0,
    categoryId: undefined,
  };

  const validationSchema: ObjectSchema<CreateProductFormValues> = object().shape({
    code: string().optional(),
    name: string().required('Product name is required!'),
    description: string().optional(),
    price: number().required('Price is required!').positive('Price must be positive'),
    imageUrl: string().optional(),
    qty: number().optional().min(0, 'Quantity cannot be negative'),
    categoryId: number().optional().positive('Category must be selected'),
  });

  const onSubmit = async (values: CreateProductFormValues) => {
    try {
      const response = await createProduct(values);
      if (response) {
        refetch();
        setOpenCreateModal(false);
        formik.resetForm();
      }
    } catch (error) {
      console.error('Create product error:', error);
      // TODO: Add toast notification for error
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const { onInputChange } = useCustomEvents<CreateProductFormValues>(formik);

  return (
    <Dialog open={isOpen} onOpenChange={() => setOpenCreateModal(false)}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
          <DialogDescription>
            Add a new product to your inventory
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='code'>Product Code</Label>
              <Input
                id='code'
                name='code'
                placeholder='e.g., PROD001'
                onChange={onInputChange}
                value={formik.values.code}
              />
            </div>
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
              <Label htmlFor='description'>Description</Label>
              <Input
                id='description'
                name='description'
                onChange={onInputChange}
                value={formik.values.description}
                placeholder='Product description...'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='price'>Price</Label>
              <Input
                id='price'
                name='price'
                type='number'
                step='0.01'
                onChange={onInputChange}
                value={formik.values.price}
                placeholder='0.00'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='qty'>Quantity</Label>
              <Input
                id='qty'
                name='qty'
                type='number'
                onChange={onInputChange}
                value={formik.values.qty}
                placeholder='0'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='imageUrl'>Image URL</Label>
              <Input
                id='imageUrl'
                name='imageUrl'
                onChange={onInputChange}
                value={formik.values.imageUrl}
                placeholder='https://example.com/image.jpg'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='categoryId'>Category</Label>
              <Select
                value={formik.values.categoryId ? String(formik.values.categoryId) : ''}
                onValueChange={(val) => formik.setFieldValue('categoryId', Number(val))}
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
            <Button variant='outline' onClick={() => setOpenCreateModal(false)}>
              Cancel
            </Button>
            <Button type='submit' onClick={() => undefined}>
              Create Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductModal;
