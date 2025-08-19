import { Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { addItem } from '@/store/slices/catering-custom-item-slice';
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

const AddCustomItemDialog = () => {
  const dispatch = useDispatch();
  function handleSubmit(formData: FormData) {
    const { name, priceAtOrder, size } = Object.fromEntries(formData);
    if (!(name && priceAtOrder && size)) {
      toast.error('Invalid data format.');
      return;
    }
    dispatch(
      addItem({
        name: name as string,
        priceAtOrder: Number(priceAtOrder),
        size: size as string,
      })
    );
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2" size={'sm'}>
          <Plus />
          Add custom items
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add custom item</DialogTitle>
        </DialogHeader>
        <form
          action={handleSubmit}
          className="grid gap-4 py-4"
          id="add-custom-item-form"
        >
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right" htmlFor="name">
              Name
            </Label>
            <Input className="col-span-3" name="name" placeholder="Name" />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right" htmlFor="size">
              Size
            </Label>
            <Input className="col-span-3" name="size" placeholder="5 PPL" />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right" htmlFor="priceAtOrder">
              Price
            </Label>
            <Input
              className="col-span-3"
              name="priceAtOrder"
              placeholder="$99"
            />
          </div>
        </form>
        <DialogFooter className="flex justify-end">
          <Button form="add-custom-item-form" size={'sm'} type="submit">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomItemDialog;
