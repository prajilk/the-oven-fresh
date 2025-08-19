import type { UseFormReturn } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import type { z } from 'zod';
import type {
  ZodCateringSchema,
  ZodTiffinSchema,
} from '@/lib/zod-schema/schema';
import { setPaymentMethod } from '@/store/slices/catering-order-slice';
import { FormControl } from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type CateringType = UseFormReturn<z.infer<typeof ZodCateringSchema>>;
type TiffinType = UseFormReturn<z.infer<typeof ZodTiffinSchema>>;

type PaymentSelectProps = {
  form: CateringType | TiffinType;
};

const PaymentSelect = ({ form }: PaymentSelectProps) => {
  const dispatch = useDispatch();
  return (
    <Select
      defaultValue="cash" // Watch the selected value
      onValueChange={(val: 'card' | 'cash' | 'e-transfer') => {
        (form as CateringType).setValue('payment_method', val);
        dispatch(setPaymentMethod(val));
      }}
      value={(form as CateringType).watch('payment_method')}
    >
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="payment" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        <SelectItem value="cash">Cash</SelectItem>
        <SelectItem value="card">Card</SelectItem>
        <SelectItem value="e-transfer">E-Transfer</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default PaymentSelect;
