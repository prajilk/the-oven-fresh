import { Plus } from 'lucide-react';
import { useState } from 'react';
import GroceryForm from '../forms/grocery-form';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import LoadingButton from '../ui/loading-button';

const AddGroceryDialog = () => {
  const [loading, setLoading] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2" size={'sm'}>
          <Plus />
          Add grocery
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new item</DialogTitle>
        </DialogHeader>
        <GroceryForm setLoading={setLoading} />
        <DialogFooter className="flex justify-end">
          <LoadingButton
            form="add-grocery-form"
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

export default AddGroceryDialog;
