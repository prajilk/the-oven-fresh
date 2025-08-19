import { Button } from '@heroui/button';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { addCategoryAction } from '@/actions/add-category-action';
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

const EditCategoryDialog = ({ id, name }: { id: string; name: string }) => {
  const [loading, setLoading] = useState(false);

  function handleSubmit(formData: FormData) {
    setLoading(true);

    formData.append('id', id);

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
      loading: 'Updating category...',
      success: () => 'Category updated successfully.',
      error: ({ error }) => (error ? error : 'Failed to update category.'),
    });
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button isIconOnly radius="full" size="sm" variant="flat">
          <Pencil size={15} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit category</DialogTitle>
        </DialogHeader>
        <form
          action={handleSubmit}
          className="grid gap-4 py-4"
          id="edit-category-form"
        >
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right" htmlFor="name">
              Name
            </Label>
            <Input
              className="col-span-3"
              defaultValue={name}
              name="name"
              placeholder="Name"
            />
          </div>
        </form>
        <DialogFooter className="flex justify-end">
          <LoadingButton
            form="edit-category-form"
            isLoading={loading}
            size={'sm'}
            type="submit"
          >
            Update
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryDialog;
