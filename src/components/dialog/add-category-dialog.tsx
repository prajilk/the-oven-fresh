import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { addCategoryAction } from '@/actions/add-category-action';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import LoadingButton from '../ui/loading-button';

const AddCategoryDialog = () => {
  const [loading, setLoading] = useState(false);

  function handleSubmit(formData: FormData) {
    setLoading(true);

    const { name } = Object.fromEntries(formData);
    if (!name) {
      toast.error('Invalid data format.');
      setLoading(false);
      return;
    }

    const promise = async () => {
      const result = await addCategoryAction(formData);
      setLoading(false);
      if (result.success) {
        return result;
      }
      throw result;
    };

    toast.promise(promise(), {
      loading: 'Creating category...',
      success: () => 'Category created successfully.',
      error: ({ error }) => (error ? error : 'Failed to create category.'),
    });
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2" size={'sm'}>
          <Plus />
          Add category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new category</DialogTitle>
        </DialogHeader>
        <form
          action={handleSubmit}
          className="grid gap-4 py-4"
          id="add-category-form"
        >
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right" htmlFor="name">
              Name
            </Label>
            <Input className="col-span-3" name="name" placeholder="Name" />
          </div>
        </form>
        <DialogFooter className="flex justify-end">
          <LoadingButton
            form="add-category-form"
            isLoading={loading}
            size={'sm'}
            type="submit"
          >
            Create
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
