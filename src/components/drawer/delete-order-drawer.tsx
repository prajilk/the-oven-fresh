'use client';

import { useMediaQuery } from '@mui/material';
import type { QueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useDeleteOrder } from '@/api-hooks/delete-order';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer';
import LoadingButton from '@/components/ui/loading-button';

export function DeleteOrderDrawer({
  orderId,
  orderType,
}: {
  orderId: string;
  orderType: 'catering' | 'tiffin';
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  function onSuccess(queryClient: QueryClient) {
    queryClient.invalidateQueries({ queryKey: ['order', orderType] });
    toast.success('Order deleted successfully!');
    setOpen(false);
  }

  const mutation = useDeleteOrder(onSuccess);

  if (isDesktop) {
    return (
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger asChild>
          <button type="button">
            <Trash2 className="stroke-2 text-red-500" size={18} />
          </button>
        </DialogTrigger>
        <DialogContent className="z-[1550] flex flex-col">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription className="text-sm">
              This action cannot be undone. This will permanently delete this
              order and remove all data from the server.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                className="bg-destructive/10 text-destructive hover:bg-destructive/30 hover:text-destructive"
                variant="ghost"
              >
                Cancel
              </Button>
            </DialogClose>
            <LoadingButton
              isLoading={mutation.isPending}
              onClick={() => mutation.mutate({ orderId, orderType })}
            >
              Continue
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>
        <button type="button">
          <Trash2 className="stroke-2 text-red-500" size={18} />
        </button>
      </DrawerTrigger>
      <DrawerContent className="z-[1550]">
        <DrawerHeader className="text-left">
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete this
            order and remove all data from the server.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button
              className="bg-destructive/10 text-destructive hover:bg-destructive/30 hover:text-destructive"
              variant="ghost"
            >
              Cancel
            </Button>
          </DrawerClose>
          <LoadingButton
            isLoading={mutation.isPending}
            onClick={() => mutation.mutate({ orderId, orderType })}
          >
            Continue
          </LoadingButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
