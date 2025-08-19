import { useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import type {
  CateringCustomItemState,
  CateringItemsState,
} from '@/lib/types/catering/catering-order-state';
import type { RootState } from '@/store';

export function PaymentDetailsDrawer() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const cateringOrder = useSelector((state: RootState) => state.cateringItem);
  const cateringCustomItem = useSelector(
    (state: RootState) => state.cateringCustomItem
  );

  if (isDesktop) {
    return (
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger asChild>
          <Button
            className="underline"
            disabled={!cateringOrder.length}
            size={'sm'}
            type="button"
            variant={'link'}
          >
            View payment details
          </Button>
        </DialogTrigger>
        <DialogContent className="z-[1550] flex max-w-xl flex-col">
          <DialogHeader>
            <DialogTitle>Payment details</DialogTitle>
          </DialogHeader>
          <PaymentDialogContent
            cateringCustomItem={cateringCustomItem}
            cateringOrder={cateringOrder}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className="underline"
          size={'sm'}
          type="button"
          variant={'link'}
        >
          View payment details
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Payment details</DrawerTitle>
        </DrawerHeader>
        <div className="px-4">
          <PaymentDialogContent
            cateringCustomItem={cateringCustomItem}
            cateringOrder={cateringOrder}
          />
        </div>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
}

function PaymentDialogContent({
  cateringOrder,
  cateringCustomItem,
}: {
  cateringOrder: CateringItemsState[];
  cateringCustomItem: CateringCustomItemState[];
}) {
  const total = cateringOrder.reduce(
    (acc, item) => acc + item.priceAtOrder * item.quantity,
    0
  );
  const totalCustomItem = cateringCustomItem.reduce(
    (acc, item) => acc + item.priceAtOrder,
    0
  );

  const tax =
    ((total + totalCustomItem) *
      Number(process.env.NEXT_PUBLIC_TAX_AMOUNT || 0)) /
    100;
  const totalPayment = total + tax;
  return (
    <div className="mt-1 rounded-md bg-gray-100 p-2">
      <h2 className="mb-4 text-xl">Payment Summary</h2>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Sub Total</span>
          <span className="font-medium">${total + totalCustomItem}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        <hr />
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Payment</span>
          <span className="font-medium">${totalPayment.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
