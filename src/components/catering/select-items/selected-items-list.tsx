'use client';

import { Divider } from '@mui/material';
import { ImageIcon, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { OrderListDrawer } from '@/components/drawer/catering/order-list-drawer';
import { PaymentDetailsDrawer } from '@/components/drawer/catering/payment-details-drawer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { RootState } from '@/store';
import { removeCustomItem } from '@/store/slices/catering-custom-item-slice';
import { removeItem } from '@/store/slices/catering-item-slice';

export function SelectedItemsList() {
  const cateringOrder = useSelector((state: RootState) => state.cateringItem);
  const cateringCustomItem = useSelector(
    (state: RootState) => state.cateringCustomItem
  );
  const dispatch = useDispatch();

  const total =
    cateringOrder.reduce(
      (acc, item) => acc + item.priceAtOrder * item.quantity,
      0
    ) + cateringCustomItem.reduce((acc, item) => acc + item.priceAtOrder, 0);
  const tax = (total * Number(process.env.NEXT_PUBLIC_TAX_AMOUNT || 0)) / 100;
  const totalPayment = total + tax;

  const handleRemoveItem = (id: string, size: string) => {
    dispatch(removeItem({ _id: id, size }));
  };
  const handleRemoveCustomItem = (name: string) => {
    dispatch(removeCustomItem({ name }));
  };

  return (
    <>
      <Card className="sticky top-4 hidden lg:block">
        <CardHeader className="px-4 py-4">
          <CardTitle className="text-lg">Selected Items</CardTitle>
          <CardDescription>Items added to the current order</CardDescription>
        </CardHeader>
        <CardContent className="w-full px-4">
          {cateringOrder.length === 0 && cateringCustomItem.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No items selected yet. Please select items from the menu.
            </div>
          ) : (
            <div className="space-y-3">
              {cateringOrder.map((item) => (
                <div
                  className="flex flex-col rounded-md border p-3 pb-2"
                  key={item._id}
                >
                  <div className="mb-1 flex items-start gap-2">
                    <Image
                      alt={item.name}
                      className="rounded-md"
                      height={56}
                      src={item.image}
                      width={56}
                    />
                    <div>
                      <div className="flex items-center gap-1 font-medium">
                        {item.name}
                        <div className="text-muted-foreground text-xs">
                          &#040;x{item.quantity}&#041;
                        </div>
                      </div>
                      <div className="text-xs">{item.variant}</div>
                      <div className="text-muted-foreground text-xs capitalize">
                        {item.size} - $ {item.priceAtOrder.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      $ {(item.priceAtOrder * item.quantity).toFixed(2)}
                    </div>
                    <Button
                      className="h-8 w-8"
                      onClick={() => handleRemoveItem(item._id, item.size)}
                      size="icon"
                      variant="ghost"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {cateringCustomItem.map((item) => (
                <div
                  className="flex flex-col rounded-md border p-3 pb-2"
                  key={item.name}
                >
                  <div className="mb-1 flex items-start gap-2">
                    <div className="flex size-14 items-center justify-center rounded-md bg-gray-200">
                      <ImageIcon size={15} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 font-medium">
                        {item.name}
                      </div>
                      <div className="text-muted-foreground text-xs capitalize">
                        {item.size} - $ {item.priceAtOrder.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      $ {item.priceAtOrder.toFixed(2)}
                    </div>
                    <Button
                      className="h-8 w-8"
                      onClick={() => handleRemoveCustomItem(item.name)}
                      size="icon"
                      variant="ghost"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Divider />
              <div className="mt-1 sm:mt-2 lg:mt-4 lg:rounded-md lg:bg-gray-100 lg:p-2">
                <h2 className="mb-4">Payment Summary</h2>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Sub Total</span>
                    <span className="font-medium">${total}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Total Payment</span>
                    <span className="font-medium">
                      ${totalPayment.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="fixed right-0 bottom-0 left-0 z-10 p-4 px-3 lg:hidden">
        <div className="w-full rounded-lg border bg-white p-3.5 shadow">
          <div className="flex items-center justify-between lg:hidden">
            <span>
              {cateringOrder.length + cateringCustomItem.length} items in the
              list
            </span>
            <OrderListDrawer />
          </div>
          <div className="flex items-center justify-between lg:hidden">
            <span>
              Total: <b className="font-medium">${totalPayment.toFixed(2)}</b>
            </span>
            <PaymentDetailsDrawer />
          </div>
        </div>
      </div>
    </>
  );
}
