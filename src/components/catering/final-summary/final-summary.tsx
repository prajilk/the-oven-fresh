import { Checkbox } from '@heroui/checkbox';
import { CalendarIcon, CreditCard, Info } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import type { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/lib/utils';
import type { ZodCateringSchema } from '@/lib/zod-schema/schema';
import type { RootState } from '@/store';
import {
  setAdvancePaid,
  setDeliveryCharge,
  setDiscount,
  setFullyPaid,
  setNote,
  setPendingBalance,
  setTaxAmount,
  setTotalPrice,
} from '@/store/slices/catering-order-slice';
import FinalCustomItemCard from './final-custom-item-card';
import FinalItemCard from './final-item-card';

export default function FinalSummary({
  form,
}: {
  form: UseFormReturn<z.infer<typeof ZodCateringSchema>>;
}) {
  const [noTax, setNoTax] = useState(false);
  const orderItems = useSelector((state: RootState) => state.cateringItem);
  const customItems = useSelector(
    (state: RootState) => state.cateringCustomItem
  );
  const orderDetail = useSelector((state: RootState) => state.cateringOrder);
  const deliveryCharge = orderDetail.deliveryCharge;

  const dispatch = useDispatch();

  const handleAdvanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || Number.parseFloat(value) > 0) {
      dispatch(setAdvancePaid(Number(value)));
    }
  };

  const handleDeliveryChargeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === '' || Number.parseFloat(value) > 0) {
      dispatch(setDeliveryCharge(Number(value)));
    }
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || Number.parseFloat(value) > 0) {
      dispatch(setDiscount(Number(value)));
    }
  };

  const address = {
    ...form.getValues('customerDetails'),
    deliveryDate: form.getValues('deliveryDate'),
    paymentMethod: form.getValues('payment_method'),
  };

  const subtotal =
    orderItems.reduce(
      (acc, item) => acc + item.priceAtOrder * item.quantity,
      0
    ) + customItems.reduce((acc, item) => acc + item.priceAtOrder, 0);
  useEffect(() => {
    if (noTax) {
      dispatch(setTaxAmount(0));
      dispatch(setTotalPrice(subtotal + deliveryCharge));
      return;
    }
    const tax =
      (subtotal * (Number(process.env.NEXT_PUBLIC_TAX_AMOUNT) || 0)) / 100;
    const total = subtotal + tax + deliveryCharge;
    dispatch(setTotalPrice(total));
    dispatch(setTaxAmount(tax));
  }, [subtotal, noTax, dispatch, deliveryCharge]);

  useEffect(() => {
    dispatch(
      setPendingBalance(
        orderDetail.totalPrice - orderDetail.advancePaid - orderDetail.discount
      )
    );
    dispatch(
      setFullyPaid(
        orderDetail.totalPrice -
          orderDetail.advancePaid -
          orderDetail.discount <=
          0
      )
    );
  }, [
    orderDetail.totalPrice,
    orderDetail.advancePaid,
    orderDetail.discount,
    dispatch,
  ]);

  useEffect(() => {
    form.setValue('totalPrice', orderDetail.totalPrice);
  }, [form, orderDetail.totalPrice]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <Ignore>
  useEffect(() => {
    dispatch(
      setPendingBalance(
        Number(form.getValues('totalPrice')) -
          orderDetail.advancePaid -
          orderDetail.discount
      )
    );
  }, [
    orderDetail.advancePaid,
    orderDetail.discount,
    form.formState.isDirty,
    orderItems,
    customItems,
    dispatch,
    form,
  ]);

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <h1 className="mb-6 font-bold text-3xl">Order Summary</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h2 className="mb-4 font-semibold text-xl">Order Items</h2>

            {orderItems.length === 0 && customItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center">
                <span className="flex items-center gap-1 text-muted-foreground text-xs">
                  <Info size={15} /> No items in your order.
                </span>
              </div>
            ) : (
              <div className="scrollbar-thin max-h-52 overflow-y-scroll">
                {orderItems.map((item) => (
                  <FinalItemCard item={item} key={item.name} />
                ))}
                {customItems.map((item) => (
                  <FinalCustomItemCard item={item} key={item.name} />
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-4 font-semibold text-xl">Payment</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <span>
                    Tax{' '}
                    <i className="text-muted-foreground text-xs">
                      &#040;
                      {process.env.NEXT_PUBLIC_TAX_AMOUNT}
                      %&#041;
                    </i>
                  </span>
                  <span>${orderDetail.tax.toFixed(2)}</span>
                </div>
                <div className="flex items-center">
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
                </div>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>${orderDetail.deliveryCharge}</span>
              </div>
              <div className="flex justify-between">
                <span>Advance Paid</span>
                <span>
                  {orderDetail.advancePaid > 0 && '-'} $
                  {orderDetail.advancePaid}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>
                  {orderDetail.discount > 0 && '-'} ${orderDetail.discount}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total</span>
                <span>${orderDetail.totalPrice.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Pending Pay</span>
                <span
                  className={
                    orderDetail.pendingBalance < 0 ? 'text-red-500' : ''
                  }
                >
                  ${orderDetail.pendingBalance.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="mb-4 font-semibold text-xl">Address</h2>
            {address.firstName && address.phone ? (
              <div className="space-y-2">
                <p className="font-medium">
                  {address.firstName} {address.lastName}
                </p>
                <p>{address.phone}</p>
                <p>{address.address}</p>
                <div className="flex items-center space-x-2 text-gray-500 text-sm">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Delivery on {formatDate(address.deliveryDate)}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500 text-sm">
                  <CreditCard className="h-4 w-4" />
                  <span className="capitalize">{address.paymentMethod}</span>
                </div>
              </div>
            ) : (
              <span className="flex items-center justify-center gap-1 text-muted-foreground text-xs">
                <Info size={15} />
                Please fill the address from
              </span>
            )}
          </div>

          <div>
            <h2 className="mb-4 font-semibold text-xl">Additional Details</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="advance-amount">Delivery Charge</Label>
                <Input
                  id="delivery-charge"
                  onChange={handleDeliveryChargeChange}
                  placeholder="Enter delivery charge"
                  step=""
                  type="number"
                  value={orderDetail.deliveryCharge}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="advance-amount">Advance Amount</Label>
                <Input
                  id="advance-amount"
                  onChange={handleAdvanceChange}
                  placeholder="Enter advance amount"
                  step=""
                  type="number"
                  value={orderDetail.advancePaid}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount-amount">Discount</Label>
                <Input
                  id="discount-amount"
                  onChange={handleDiscountChange}
                  placeholder="Enter a discount amount"
                  step=""
                  type="number"
                  value={orderDetail.discount}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  onChange={(e) => dispatch(setNote(e.target.value))}
                  placeholder="Enter any additional notes"
                  value={orderDetail.note}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
