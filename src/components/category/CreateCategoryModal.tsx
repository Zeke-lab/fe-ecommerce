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
import { object, string, type ObjectSchema } from 'yup';
import { useFormik } from 'formik';
import { useCustomEvents } from '@/services/formik/hooks';
import { createCategory } from '@/services/network/libs/categories';

interface Props {
  isOpen: boolean;
  setOpenCreateModal: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
}

export interface CreateCategoryFormValues {
  name: string;
  description?: string
}

const CreateCategoryModal = (props: Props) => {
  const { isOpen, refetch, setOpenCreateModal } = props;

  const initialValues: CreateCategoryFormValues = {
    name: '',
    description: '',
  }


  const validationSchema: ObjectSchema<CreateCategoryFormValues> = object().shape({
    name: string().required('Category name is required!'),
    description: string().optional()
  })

  const onSubmit = async (values: CreateCategoryFormValues) => {
    const response = await createCategory(values).catch((err) =>
      console.log('Create category error:', err),
    );

    if (response) {
      refetch();
      setOpenCreateModal(false)
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  })

  const { onInputChange } = useCustomEvents<CreateCategoryFormValues>(formik);

  return (
    <Dialog open={isOpen} onOpenChange={() => setOpenCreateModal(false)}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>
            Add a new category to your inventory
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Category Name</Label>
              <Input id='name' name='name' placeholder='e.g., Electronics' onChange={onInputChange} value={formik.values.name} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='description'>Category Description</Label>
              <Input
                id='description'
                name='description'
                onChange={onInputChange}
                value={formik.values.description}
                placeholder='e.g, Famous kitchen appliances...'
              />
            </div>
          </div>

          <DialogFooter className='mt-5'>
            <Button variant='outline' onClick={() => setOpenCreateModal(false)}>
              Cancel
            </Button>
            <Button type='submit' onClick={() => undefined}>Create Category</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryModal;
