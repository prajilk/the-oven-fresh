import { Checkbox } from '@heroui/checkbox';
import { DateInput } from '@heroui/date-input';
import { CalendarDate } from '@internationalized/date';
import { useState } from 'react';
import { toast } from 'sonner';
import { addGroceryAction } from '@/actions/add-grocery-action';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ZodGrocerySchema } from '@/lib/zod-schema/schema';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const GroceryForm = ({
  setLoading,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [box, setBox] = useState(false);
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

    const promise = async () => {
      const result = await addGroceryAction(formData);
      setLoading(false);
      if (result.success) {
        return result;
      }
      throw result;
    };

    toast.promise(promise(), {
      loading: 'Adding grocery...',
      success: () => 'Grocery item added successfully.',
      error: ({ error }) => (error ? error : 'Failed to add grocery.'),
    });
  }
  return (
    <form
      action={handleSubmit}
      className="grid gap-4 py-4"
      id="add-grocery-form"
    >
      <div className="grid grid-cols-4 items-center gap-2">
        <Label className="text-right" htmlFor="item">
          Item
        </Label>
        <Input className="col-span-3" name="item" placeholder="Item" />
      </div>
      <div className="grid grid-cols-4 items-center gap-2">
        <Label className="text-right" htmlFor="quantity">
          Quantity
        </Label>
        <Input
          className="col-span-1"
          disabled={box}
          name="quantity"
          placeholder="Quantity"
        />
        <Select disabled={box} name="unit">
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
        <Checkbox checked={box} onValueChange={setBox} size="sm">
          Box
        </Checkbox>
      </div>
      <div className="grid grid-cols-4 items-center gap-2">
        <Label className="text-right" htmlFor="price">
          Price
        </Label>
        <Input
          className="col-span-3"
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
          name="date"
          placeholderValue={new CalendarDate(1995, 11, 6)}
        />
      </div>
    </form>
  );
};

export default GroceryForm;
