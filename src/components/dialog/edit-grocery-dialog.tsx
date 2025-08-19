import { Checkbox } from '@heroui/checkbox';
import { DateInput } from '@heroui/date-input';
import { CalendarDate, parseDate } from '@internationalized/date';
import { format } from 'date-fns';
import { CalendarDays, Pencil } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { editGroceryAction } from '@/actions/edit-grocery-action';
import { ZodGrocerySchema } from '@/lib/zod-schema/schema';
import type { GroceryDocument } from '@/models/types/grocery';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const EditGroceryDialog = ({ grocery }: { grocery: GroceryDocument }) => {
  const [loading, setLoading] = useState(false);
  const [box, setBox] = useState(grocery.unit === 'Box');

  function handleSubmit(formData: FormData) {
    setLoading(true);

    if (box) {
      formData.set('box', 'true');
      formData.set('quantity', '0');
      formData.set('unit', 'none');
    }

    const data = Object.fromEntries(formData);

    const result = ZodGrocerySchema.safeParse(data);
    if (!result.success) {
      toast.error('Invalid data format.');
      setLoading(false);
      return;
    }

    formData.set('id', grocery._id);

    const promise = async () => {
      const result = await editGroceryAction(formData);
      setLoading(false);
      if (result.success) {
        return result;
      }
      throw result;
    };

    toast.promise(promise(), {
      loading: 'Updating grocery...',
      success: () => 'Grocery item updated successfully.',
      error: ({ error }) => (error ? error : 'Failed to update item.'),
    });
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button">
          <Pencil className="stroke-2 text-muted-foreground" size={18} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Grocery</DialogTitle>
        </DialogHeader>
        <form
          action={handleSubmit}
          className="grid gap-4 py-4"
          id="edit-grocery-form"
        >
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right" htmlFor="item">
              Item
            </Label>
            <Input
              className="col-span-3"
              defaultValue={grocery.item}
              name="item"
              placeholder="Item"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right" htmlFor="quantity">
              Quantity
            </Label>
            <Input
              className="col-span-1"
              defaultValue={grocery.quantity}
              disabled={box}
              min="0"
              name="quantity"
              placeholder="Quantity"
              step="0.01"
              type="number"
            />
            <Select defaultValue={grocery.unit} disabled={box} name="unit">
              <SelectTrigger>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent className="z-[1550]">
                <SelectItem value="L">L</SelectItem>
                <SelectItem value="Kg">Kg</SelectItem>
                <SelectItem value="g">g</SelectItem>
                <SelectItem value="lbs">lbs</SelectItem>
                <SelectItem value="Pcs">Pcs</SelectItem>
                <SelectItem value="Nos">Nos</SelectItem>
                <SelectItem value="none">none</SelectItem>
              </SelectContent>
            </Select>
            <Checkbox isSelected={box} onValueChange={setBox} size="sm">
              Box
            </Checkbox>
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right" htmlFor="price">
              Price
            </Label>
            <Input
              className="col-span-3"
              defaultValue={grocery.price}
              min="0"
              name="price"
              placeholder="Price"
              step="0.01"
              type="number"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right" htmlFor="tax">
              Tax
            </Label>
            <Input
              className="col-span-3"
              defaultValue={grocery.tax}
              min="0"
              name="tax"
              placeholder="Tax"
              step="0.01"
              type="number"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right" htmlFor="total">
              Total amount
            </Label>
            <Input
              className="col-span-3"
              defaultValue={grocery.total}
              min="0"
              name="total"
              placeholder="Total Amount"
              step="0.01"
              type="number"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right" htmlFor="purchasedFrom">
              Purchased from
            </Label>
            <Input
              className="col-span-3"
              defaultValue={grocery.purchasedFrom}
              name="purchasedFrom"
              placeholder="Store name"
              type="text"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right" htmlFor="date">
              Date
            </Label>
            <DateInput
              aria-label="Date"
              className="col-span-3"
              classNames={{
                inputWrapper: 'bg-white border rounded-lg hover:bg-white',
              }}
              defaultValue={parseDate(
                format(new Date(grocery.date), 'yyyy-MM-dd')
              )}
              endContent={<CalendarDays />}
              name="date"
              placeholderValue={new CalendarDate(1995, 11, 6)}
            />
          </div>
        </form>
        <DialogFooter className="flex justify-end">
          <LoadingButton
            form="edit-grocery-form"
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

export default EditGroceryDialog;
