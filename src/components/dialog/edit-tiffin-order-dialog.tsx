'use client';

import { Button } from '@heroui/button';
import { Checkbox } from '@heroui/checkbox';
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { editTiffinOrderAction } from '@/actions/edit-tiffin-order-action';
import { Button as ShadButton } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const EditTiffinOrderDialog = ({
  orderId,
  startDate,
  numberOfWeeks,
  type,
  tax,
  advancePaid,
}: {
  orderId: string;
  startDate: Date;
  numberOfWeeks: number;
  type: 'pickup' | 'delivery';
  tax: number;
  advancePaid: number;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState(type);
  const [nWeeks, setNWeeks] = useState(numberOfWeeks);
  const [updateEndDate, setUpdateEndDate] = useState(true);

  useEffect(() => {
    setNWeeks(numberOfWeeks);
  }, [numberOfWeeks]);

  const handleSubmit = (formData: FormData) => {
    formData.append('orderId', orderId);
    formData.append('startDate', startDate as unknown as string);
    formData.append('updateEndDate', updateEndDate.toString());
    formData.append('numberOfWeeks', nWeeks.toString());
    formData.append('order_type', orderType);
    formData.append('tax', tax.toString());
    formData.append('advancePaid', advancePaid.toString());

    setLoading(true);

    const promise = async () => {
      const result = await editTiffinOrderAction(formData);
      setLoading(false);
      setOpen(false);
      if (result.success) {
        return result;
      }
      throw result;
    };

    toast.promise(promise(), {
      loading: 'Updating order details...',
      success: () => 'Order details updated successfully.',
      error: (error) => {
        return error.error || 'Failed to update order details.';
      },
    });
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button isIconOnly radius="full" size="sm" variant="flat">
          <Pencil size={15} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Order type details</DialogTitle>
        </DialogHeader>
        <form
          action={handleSubmit}
          className="grid gap-4 py-4"
          id="edit-tiffin-order-type-form"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="numberOfWeeks">
              Number of weeks
            </Label>
            <Select
              onValueChange={(value) => setNWeeks(Number(value))}
              value={nWeeks.toString()}
            >
              <div className="col-span-3">
                <SelectTrigger id="numberOfWeeks">
                  <SelectValue placeholder="number of weeks" />
                </SelectTrigger>
                <Checkbox
                  classNames={{
                    label: 'text-xs text-muted-foreground',
                    base: 'rounded-md',
                  }}
                  isSelected={updateEndDate}
                  onValueChange={setUpdateEndDate}
                  radius="sm"
                  size="sm"
                >
                  Update End date with number of weeks
                </Checkbox>
              </div>
              <SelectContent className="z-[1560]">
                <SelectItem value="2">2 weeks</SelectItem>
                <SelectItem value="3">3 weeks</SelectItem>
                <SelectItem value="4">4 weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="order_type">
              Order Type
            </Label>
            <Select
              onValueChange={(value) =>
                setOrderType(value as 'pickup' | 'delivery')
              }
              value={orderType}
            >
              <SelectTrigger className="col-span-3" id="order_type">
                <SelectValue placeholder="order type" />
              </SelectTrigger>
              <SelectContent className="z-[1560]">
                <SelectItem value="pickup">Pickup</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
        <DialogFooter>
          <ShadButton
            disabled={loading}
            form="edit-tiffin-order-type-form"
            type="submit"
          >
            Save changes
          </ShadButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTiffinOrderDialog;
