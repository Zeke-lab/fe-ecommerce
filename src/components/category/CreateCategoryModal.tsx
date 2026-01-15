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
import { Textarea } from '../ui/textarea';

interface Props {
  isOpen: boolean;
  setOpenCreateModal: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
}

const CreateCategoryModal = (props: Props) => {
  const { isOpen, refetch, setOpenCreateModal } = props;

  return (
    <Dialog open={isOpen} onOpenChange={() => setOpenCreateModal(false)}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>
            Add a new category to your inventory
          </DialogDescription>
        </DialogHeader>
        <form action=''>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Category Name</Label>
              <Input id='name' name='name' placeholder='e.g., Electronics' />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='description'>Category Description</Label>
              {/* <Input id="name" name="name" placeholder="e.g., Laptop" /> */}
              <Textarea
                id='description'
                name='description'
                className='min-h-50'
                placeholder='e.g, Famous kitchen appliances...'
              />
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button variant='outline' onClick={() => undefined}>
            Cancel
          </Button>
          <Button onClick={() => undefined}>Create Product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryModal;
