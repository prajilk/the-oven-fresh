'use client';

import { Checkbox } from '@heroui/checkbox';
import type { QueryClient } from '@tanstack/react-query';
import { CheckCircle } from 'lucide-react';
import type { CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import { useState } from 'react';
import { toast } from 'sonner';
import { useConfirmDelivery } from '@/api-hooks/delivery/confirm-delivery';
import { Show } from '@/components/show';
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
import LoadingButton from '@/components/ui/loading-button';

export function ConfirmDeliveryDrawer({
  orderType,
  orderId,
  pendingBalance,
  disabled = false,
  resource,
  statusId,
}: {
  orderType: 'caterings' | 'tiffins';
  orderId: string;
  pendingBalance: number;
  statusId?: string;
  disabled?: boolean;
  resource?: string | CloudinaryUploadWidgetInfo | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [collect, setCollect] = useState(false);

  function onSuccess(queryClient: QueryClient) {
    queryClient.invalidateQueries({
      queryKey: ['order', 'delivery', orderType],
    });
    toast.success('Order delivered successfully!');
    setOpen(false);
  }

  const mutation = useConfirmDelivery(onSuccess);

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>
        <Button
          className="flex flex-1 items-center"
          disabled={disabled}
          size="sm"
        >
          <CheckCircle className="mr-1 h-4 w-4" />
          Mark Delivered
        </Button>
      </DrawerTrigger>
      <DrawerContent className="z-[1550] mx-auto max-w-md">
        <DrawerHeader className="text-left">
          <DialogTitle>Confirm delivery?</DialogTitle>
          <DrawerDescription>
            Are you sure you want to mark this order as delivered?
          </DrawerDescription>
        </DrawerHeader>
        <Show>
          <Show.When isTrue={pendingBalance > 0}>
            <div className="flex items-center px-4 py-3">
              <Checkbox
                isSelected={collect}
                onValueChange={setCollect}
                size="sm"
              />
              <p className="text-sm">
                Collected pending balance{' '}
                <span className="font-bold">${pendingBalance}</span>
              </p>
            </div>
          </Show.When>
        </Show>
        <DrawerFooter className="pt-2">
          <LoadingButton
            className="w-full"
            isLoading={mutation.isPending}
            onClick={() =>
              mutation.mutate({
                orderId,
                statusId,
                orderType,
                resource,
                collect,
              })
            }
          >
            Mark as delivered
          </LoadingButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
