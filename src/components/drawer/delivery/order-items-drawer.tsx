import { Package } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../../ui/drawer';

const OrderItemsDrawer = ({
  items,
  customItems,
  orderId,
}: {
  items: { name: string; quantity: number }[];
  customItems: { name: string; size: string }[];
  orderId: string;
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const totalItems =
    items.reduce((sum, item) => sum + item.quantity, 0) + customItems.length;
  return (
    <Drawer onOpenChange={setIsDrawerOpen} open={isDrawerOpen}>
      <DrawerTrigger asChild>
        <Button className="ml-auto" size="sm" variant="outline">
          <Package className="mr-2 h-4 w-4" />
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto max-w-md">
        <div>
          <DrawerHeader>
            <DrawerTitle>Order Items</DrawerTitle>
            <DrawerDescription>Order #{orderId}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <div className="scrollbar-thin max-h-96 space-y-4 overflow-y-scroll">
              {items.map((item) => (
                <div
                  className="flex items-center justify-between"
                  key={item.name}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                      <span className="font-medium text-sm">
                        {item.quantity}x
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                    </div>
                  </div>
                </div>
              ))}
              {customItems.map((item) => (
                <div
                  className="flex items-center justify-between"
                  key={item.name}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                      <span className="font-medium text-sm">x</span>
                    </div>
                    <div className="flex flex-col gap-0">
                      <p className="font-medium">{item.name}</p>
                      <span className="text-xs">{item.size}</span>
                    </div>
                  </div>
                </div>
              ))}

              {items.length === 0 && customItems.length === 0 && (
                <div className="py-6 text-center text-muted-foreground">
                  No items in this order
                </div>
              )}
            </div>

            {/* {items.length > 0 && (
                            <>
                                <Separator className="my-4" />
                                <div className="flex justify-between items-center font-medium">
                                    <p>Total</p>
                                    <p>
                                        $
                                        {items
                                            .reduce(
                                                (sum, item) =>
                                                    sum +
                                                    item.price * item.quantity,
                                                0
                                            )
                                            .toFixed(2)}
                                    </p>
                                </div>
                            </>
                        )} */}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default OrderItemsDrawer;
