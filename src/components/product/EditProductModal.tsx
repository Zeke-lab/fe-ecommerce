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
import { object, string, type ObjectSchema } from 'yup';
import { useFormik } from 'formik';
import { useCustomEvents } from '@/services/formik/hooks';
import {
  type UpdateProductPayload,
  useGetProductById,
  updateProduct,
} from '@/services/network/libs/products';
import { useEffect } from 'react';
import { useGetAllCategories } from '@/services/network/libs/categories';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  isOpen: boolean;
  productId: number;
  setOpenEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
}

interface EditProductFormValues {
  name?: string;
  description?: string;
  price?: string;
  imageUrl?: string;
  categoryId?: string;
}

const EditProductModal = (props: Props) => {
  const { isOpen, refetch, setOpenEditModal, productId } = props;

  const { data: productData } = useGetProductById(productId);
  const { data: categories } = useGetAllCategories();

  const initialValues: EditProductFormValues = {
    name: productData?.name ?? '',
    description: productData?.description ?? '',
    price:
      productData?.price !== undefined
        ? String(productData.price)
        : '',
    imageUrl: productData?.imageUrl ?? '',
    categoryId: productData?.categoryId
      ? String(productData.categoryId)
      : undefined,
  };

  const validationSchema: ObjectSchema<EditProductFormValues> = object().shape({
    name: string().optional(),
    description: string().optional(),
    price: string()
      .optional()
      .test('is-number', 'Price must be a valid number', (value) => {
        if (!value) return true;
        return !isNaN(Number(value));
      }),
    imageUrl: string().url('Image URL must be a valid URL').optional(),
    categoryId: string().optional(),
  });

  const onSubmit = async (values: EditProductFormValues) => {
    const payload: UpdateProductPayload = {
      name: values.name,
      description: values.description,
      price:
        values.price !== undefined && values.price !== ''
          ? Number(values.price)
          : undefined,
      imageUrl: values.imageUrl,
      categoryId: values.categoryId ? Number(values.categoryId) : undefined,
    };

    const response = await updateProduct(productId, payload).catch((err) =>
      console.log('Update product error:', err),
    );

    if (response) {
      refetch();
      setOpenEditModal(false);
    }
  };

  const formik = useFormik<EditProductFormValues>({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  const { onInputChange } = useCustomEvents<EditProductFormValues>(formik);

  useEffect(() => {
    if (productData) {
      formik.setValues({
        name: productData.name ?? '',
        description: productData.description ?? '',
        price:
          productData.price !== undefined
            ? String(productData.price)
            : '',
        imageUrl: productData.imageUrl ?? '',
        categoryId: productData.categoryId
          ? String(productData.categoryId)
          : undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productData]);

  return (
    <Dialog open={isOpen} onOpenChange={() => setOpenEditModal(false)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Modify the details of your product
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
                onValueChange={(value: string) =>
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
            <Button variant="outline" onClick={() => setOpenEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Edit Product</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;

