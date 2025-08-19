'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogTitle } from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import LoadingButton from '@/components/ui/loading-button';

export function AddOrderDrawer() {
  const [open, setOpen] = useState(false);

  // function onSuccess(queryClient: QueryClient) {
  //     queryClient.invalidateQueries({
  //         queryKey: ["delivery", "sortedOrders", orderType],
  //     });
  //     toast.success("Order delivered successfully!");
  //     setOpen(false);
  // }

  // const mutation = useConfirmDelivery(onSuccess);

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>
        <Button
          className="size-11 rounded-full shadow-lg"
          size={'icon'}
          variant={'outline'}
        >
          <Plus />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="z-[1550] mx-auto max-w-md">
        <DrawerHeader className="text-left">
          <DialogTitle>Add order</DialogTitle>
          <DrawerDescription>
            Enter the order ID you want to add to the delivery.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          <Input placeholder="Enter order ID" />
          <LoadingButton
            className="w-full"
            // isLoading={mutation.isPending}
            // onClick={() => mutation.mutate({ orderId, orderType })}
            isLoading={false}
          >
            Add Order
          </LoadingButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
