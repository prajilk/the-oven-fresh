import { Checkbox } from '@heroui/checkbox';
import {
  CalendarIcon,
  CreditCardIcon,
  MapPinIcon,
  PhoneIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/lib/utils';
import type { ZodTiffinSchema } from '@/lib/zod-schema/schema';

type TiffinDialogContentProps = {
  form: UseFormReturn<z.infer<typeof ZodTiffinSchema>>;
  advanceAmount: string;
  discountAmount: string;
  handleAdvanceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDiscountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  note: string;
  setNote: React.Dispatch<React.SetStateAction<string>>;
  pendingAmount: number;
  setPendingAmount: React.Dispatch<React.SetStateAction<number>>;
};

const TiffinDialogContent = ({
  form,
  advanceAmount,
  discountAmount,
  note,
  setNote,
  handleAdvanceChange,
  handleDiscountChange,
  pendingAmount,
  setPendingAmount,
}: TiffinDialogContentProps) => {
  const [noTax, setNoTax] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <Ignore>
  useEffect(() => {
    const total = Number(form.getValues('totalAmount'));
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_AMOUNT || 0);

    const subtotal = (total * 100) / (100 + taxRate);
    setSubtotal(subtotal);
    const tax = (total * taxRate) / (100 + taxRate);
    setTax(tax);

    if (noTax) {
      form.setValue('tax', 0, { shouldValidate: true });
      setPendingAmount(
        total - Number(advanceAmount) - Number(discountAmount) - tax
      );
    } else {
      form.setValue('tax', tax, { shouldValidate: true });
      setPendingAmount(total - Number(advanceAmount) - Number(discountAmount));
    }
  }, [
    form,
    setPendingAmount,
    noTax,
    advanceAmount,
    discountAmount,
    setSubtotal,
  ]);

  const orderDetails = {
    firstName: form.getValues('customerDetails.firstName'),
    lastName: form.getValues('customerDetails.lastName'),
    phone: form.getValues('customerDetails.phone'),
    address: form.getValues('customerDetails.address'),
    startDate: formatDate(new Date(form.getValues('start_date'))),
    endDate: formatDate(new Date(form.getValues('end_date'))),
    numberOfWeeks: form.getValues('number_of_weeks'),
    paymentMethod: form.getValues('payment_method'),
    totalAmount:
      form.getValues('tax') === 0
        ? (Number(form.getValues('totalAmount')) - tax).toString()
        : form.getValues('totalAmount'),
    tax: form.getValues('tax'),
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Customer Details</h3>
          <p className="font-semibold text-sm">
            {orderDetails.firstName} {orderDetails.lastName}
          </p>
          <p className="flex items-center text-sm">
            <PhoneIcon className="mr-2 h-4 w-4" />
            {orderDetails.phone}
          </p>
          <p className="flex items-center text-sm">
            <MapPinIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            {orderDetails.address}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Order Details</h3>
          <p className="flex items-center text-sm">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Start Date: {orderDetails.startDate}
          </p>
          <p className="flex items-center text-sm">
            <CalendarIcon className="mr-2 h-4 w-4" />
            End Date: {orderDetails.endDate}
          </p>
          <p className="text-sm">
            Number of Weeks: {orderDetails.numberOfWeeks}
          </p>
          <p className="flex items-center text-sm">
            <CreditCardIcon className="mr-2 h-4 w-4" />
            Payment Method: {orderDetails.paymentMethod}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <Label htmlFor="advance-amount">Advance Amount</Label>
          <Input
            id="advance-amount"
            onChange={handleAdvanceChange}
            placeholder="Enter advance amount"
            type="number"
            value={advanceAmount}
          />
        </div>
        <div>
          <Label htmlFor="discount">Discount</Label>
          <Input
            id="discount"
            onChange={handleDiscountChange}
            placeholder="Enter discount amount"
            type="number"
            value={discountAmount}
          />
        </div>
        <div>
          <Label htmlFor="note">Note</Label>
          <Textarea
            id="note"
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter a note (Optional)"
            value={note}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Price Summary</h3>
        <p className="flex justify-between font-semibold text-sm">
          Subtotal: <span>${subtotal.toFixed(2)}</span>
        </p>
        <p className="flex flex-col text-sm">
          <span className="flex items-center justify-between gap-1">
            Tax:{' '}
            <span>
              {orderDetails.tax === 0
                ? `- $${tax.toFixed(2)}`
                : `$${orderDetails.tax.toFixed(2)}`}
            </span>
          </span>
          <span>
            <Checkbox
              checked={noTax}
              classNames={{
                label: 'text-xs text-muted-foreground',
              }}
              onChange={() => setNoTax(!noTax)}
              size="sm"
            >
              Remove tax
            </Checkbox>
          </span>
        </p>
        <p className="flex justify-between font-semibold text-sm">
          Total Amount:{' '}
          <span>${Number(orderDetails.totalAmount).toFixed(2)}</span>
        </p>
        <p className="flex justify-between text-sm">
          Advance Paid:{' '}
          <span>
            {Number(advanceAmount) !== 0 && '- '}$
            {advanceAmount === '' ? 0 : advanceAmount}
          </span>
        </p>
        <p className="flex justify-between text-sm">
          Discount:{' '}
          <span>
            {Number(discountAmount) !== 0 && '- '}$
            {discountAmount === '' ? 0 : discountAmount}
          </span>
        </p>
        <p className="flex justify-between font-semibold text-sm">
          Pending Amount: <span>${pendingAmount.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
};

export default TiffinDialogContent;
