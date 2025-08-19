import { useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ItemCardSummary from '@/components/catering/select-items/item-card-summary';
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

export function OrderListDrawer() {
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
            View order list
          </Button>
        </DialogTrigger>
        <DialogContent className="z-[1550] flex max-w-xl flex-col">
          <DialogHeader>
            <DialogTitle>Order list</DialogTitle>
          </DialogHeader>
          <OrderListDialogContent
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
          disabled={!cateringOrder.length}
          size={'sm'}
          type="button"
          variant={'link'}
        >
          View order list
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Order list</DrawerTitle>
          </DrawerHeader>
          <OrderListDialogContent
            cateringCustomItem={cateringCustomItem}
            cateringOrder={cateringOrder}
          />
          <DrawerFooter />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function OrderListDialogContent({
  cateringOrder,
  cateringCustomItem,
}: {
  cateringOrder: CateringItemsState[];
  cateringCustomItem: CateringCustomItemState[];
}) {
  return (
    <>
      {cateringOrder.map((item) => (
        <ItemCardSummary item={item} key={item._id} />
      ))}
      {cateringCustomItem.map((item) => (
        <ItemCardSummary
          item={{
            name: item.name,
            size: item.size,
            priceAtOrder: item.priceAtOrder,
            quantity: 1,
          }}
          key={item.name}
        />
      ))}
    </>
  );
}
