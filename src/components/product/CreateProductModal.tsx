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
import { object, string, number, type ObjectSchema } from 'yup';
import { useFormik } from 'formik';
import { useCustomEvents } from '@/services/formik/hooks';
import { createProduct, type CreateProductPayload } from '@/services/network/libs/products';
import { useGetAllCategories } from '@/services/network/libs/categories';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  isOpen: boolean;
  setOpenCreateModal: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
}

interface CreateProductFormValues {
  name: string;
  description?: string;
  price: string;
  imageUrl?: string;
  categoryId?: string;
}

const CreateProductModal = (props: Props) => {
  const { isOpen, refetch, setOpenCreateModal } = props;

  const { data: categories } = useGetAllCategories();

  const initialValues: CreateProductFormValues = {
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    categoryId: undefined,
  };

  const validationSchema: ObjectSchema<CreateProductFormValues> = object().shape({
    name: string().required('Product name is required!'),
    description: string().optional(),
    price: string()
      .required('Price is required!')
      .test('is-number', 'Price must be a valid number', (value) =>
        value === undefined || value === null || value === ''
          ? false
          : !isNaN(Number(value)),
      ),
    imageUrl: string().url('Image URL must be a valid URL').optional(),
    categoryId: string().optional(),
  });

  const onSubmit = async (values: CreateProductFormValues) => {
    const payload: CreateProductPayload = {
      name: values.name,
      description: values.description || undefined,
      price: Number(values.price),
      imageUrl: values.imageUrl || undefined,
      categoryId: values.categoryId ? Number(values.categoryId) : undefined,
    };

    const response = await createProduct(payload).catch((err) =>
      console.log('Create product error:', err),
    );

    if (response) {
      refetch();
      setOpenCreateModal(false);
    }
  };

  const formik = useFormik<CreateProductFormValues>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const { onInputChange } = useCustomEvents<CreateProductFormValues>(formik);

  return (
    <Dialog open={isOpen} onOpenChange={() => setOpenCreateModal(false)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
          <DialogDescription>
            Add a new product to your inventory
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Laptop"
                onChange={onInputChange}
                value={formik.values.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Short description..."
                onChange={onInputChange}
                value={formik.values.description}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                placeholder="e.g., 99.99"
                onChange={onInputChange}
                value={formik.values.price}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                placeholder="https://example.com/image.jpg"
                onChange={onInputChange}
                value={formik.values.imageUrl}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <Select
                value={formik.values.categoryId}
                onValueChange={(value) =>
                  formik.setFieldValue('categoryId', value)
                }
              >
                <SelectTrigger id="categoryId">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-5">
            <Button variant="outline" onClick={() => setOpenCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Product</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductModal;

