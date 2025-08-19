'use client';

import { Button } from '@heroui/button';
import { Pencil, TriangleAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { editPaymentAction } from '@/actions/edit-payment-action';
import { Button as ShadButton } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const EditPaymentDialog = ({
  orderId,
  paymentDetails,
  orderType,
}: {
  orderId: string;
  paymentDetails: {
    subtotal: number;
    tax: number;
    deliveryCharge: number;
    paymentMethod: string;
    advancePaid: number;
    pendingBalance: number;
    discount: number;
    fullyPaid: boolean;
  };
  orderType: 'catering' | 'tiffin';
}) => {
  const [loading, setLoading] = useState(false);
  const [tax, setTax] = useState(paymentDetails.tax);
  const [fullyPaid, setFullyPaid] = useState(
    paymentDetails.fullyPaid.toString()
  );
  const [subtotal, setSubtotal] = useState(paymentDetails.subtotal);

  useEffect(() => {
    setSubtotal(paymentDetails.subtotal);
  }, [paymentDetails.subtotal]);

  const handleSubmit = (formData: FormData) => {
    formData.append('orderId', orderId);
    formData.append('orderType', orderType);
    formData.append('tax', tax.toString());

    setLoading(true);

    const promise = async () => {
      const result = await editPaymentAction(formData);
      setLoading(false);
      if (result.success) {
        return result;
      }
      throw result;
    };

    toast.promise(promise(), {
      loading: 'Updating payment details...',
      success: () => {
        return 'Payment details updated successfully.';
      },
      error: 'Failed to update payment details.',
    });
  };

  function calculateTax() {
    const tax =
      (subtotal * Number(process.env.NEXT_PUBLIC_TAX_AMOUNT || 0)) / 100;
    setTax(tax);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button isIconOnly radius="full" size="sm" variant="flat">
          <Pencil size={15} />
        </Button>
      </DialogTrigger>
      <DialogContent className="scrollbar-thin max-h-screen overflow-y-scroll sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit payment details</DialogTitle>
        </DialogHeader>
        <form
          action={handleSubmit}
          className="grid gap-4 py-4"
          id="edit-payment-form"
        >
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-right" htmlFor="subtotal">
              Subtotal{' '}
            </Label>
            <Input
              className="col-span-2"
              id="subtotal"
              min={0}
              name="subtotal"
              onChange={(e) => setSubtotal(Number(e.target.value))}
              step={'any'}
              type="number"
              // defaultValue={paymentDetails.subtotal}
              value={subtotal}
            />
          </div>
          {orderType === 'catering' && (
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-right" htmlFor="deliveryCharge">
                Delivery fee
              </Label>
              <Input
                className="col-span-2"
                defaultValue={paymentDetails.deliveryCharge}
                id="deliveryCharge"
                min={0}
                name="deliveryCharge"
                step={'any'}
                type="number"
              />
            </div>
          )}
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-right" htmlFor="total">
              Total{' '}
              <span className="text-muted-foreground text-xs">
                &#040;incl. tax&#041;
              </span>
            </Label>
            <Input
              className="col-span-2"
              defaultValue={
                paymentDetails.subtotal +
                paymentDetails.tax +
                (paymentDetails.deliveryCharge || 0)
              }
              id="total"
              min={0}
              name="total"
              step={'any'}
              type="number"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-right" htmlFor="tax">
              Tax
            </Label>
            <Input
              id="tax"
              min={0}
              name="tax"
              onChange={(e) => setTax(Number(e.target.value))}
              step={'any'}
              type="number"
              value={tax}
            />
            <ShadButton
              onClick={calculateTax}
              size="sm"
              type="button"
              variant={'outline'}
            >
              Calculate
            </ShadButton>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-right" htmlFor="paymentMethod">
              Payment Method
            </Label>
            <Select
              defaultValue={paymentDetails.paymentMethod}
              name="paymentMethod"
            >
              <SelectTrigger className="col-span-2" id="paymentMethod">
                <SelectValue placeholder="payment" />
              </SelectTrigger>
              <SelectContent className="z-[1560]">
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="e-transfer">E-Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-right" htmlFor="advancePaid">
              Advance Paid
            </Label>
            <Input
              className="col-span-2"
              defaultValue={paymentDetails.advancePaid}
              id="advancePaid"
              min={0}
              name="advancePaid"
              step={'any'}
              type="number"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-right" htmlFor="discount">
              Discount
            </Label>
            <Input
              className="col-span-2"
              defaultValue={paymentDetails.discount}
              id="discount"
              min={0}
              name="discount"
              step={'any'}
              type="number"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-right" htmlFor="pendingBalance">
              Pending Balance
            </Label>
            <Input
              className="col-span-2"
              defaultValue={paymentDetails.pendingBalance}
              id="pendingBalance"
              min={0}
              name="pendingBalance"
              step={'any'}
              type="number"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-right" htmlFor="fullyPaid">
              Fully paid
            </Label>
            <Select
              name="fullyPaid"
              onValueChange={(value) => setFullyPaid(value)}
              value={fullyPaid}
            >
              <SelectTrigger className="col-span-2" id="fullyPaid">
                <SelectValue placeholder="fully paid" />
              </SelectTrigger>
              <SelectContent className="z-[1560]">
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <span className="flex items-center gap-2 rounded-md bg-yellow-500/20 p-1 text-xs text-yellow-700">
            <TriangleAlert className="ms-0.5 size-4 flex-shrink-0" />
            Values are not synced automatically. Please ensure all amounts are
            manually updated.
          </span>
        </form>
        <DialogFooter>
          <ShadButton disabled={loading} form="edit-payment-form" type="submit">
            Save changes
          </ShadButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPaymentDialog;
