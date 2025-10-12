'use client';

import { useMediaQuery } from '@mui/material';
import type { UseMutationResult } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';
import Whatsapp from '@/components/icons/whatsapp';
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
import { calculateTotalAmount } from '@/lib/utils';
import type { ZodTiffinSchema } from '@/lib/zod-schema/schema';
import type { TiffinMenuDocument } from '@/models/types/tiffin-menu';
import TiffinDialogContent from './tiffin-dialog-content';

export function TiffinConfirmDrawer({
  mutation,
  form,
  open,
  setOpen,
  tiffinMenu,
  setSentToWhatsapp,
}: {
  mutation: UseMutationResult<unknown, unknown, unknown, unknown>;
  form: UseFormReturn<z.infer<typeof ZodTiffinSchema>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tiffinMenu?: TiffinMenuDocument | null;
  setSentToWhatsapp: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [pendingAmount, setPendingAmount] = useState(0);
  const [note, setNote] = useState('');
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const number_of_weeks = form.getValues('number_of_weeks');
  const order_type = form.getValues('order_type');

  // biome-ignore lint/correctness/useExhaustiveDependencies: <Ignore>
  useEffect(() => {
    const { tax, total } = calculateTotalAmount(form, tiffinMenu);

    form.setValue('totalAmount', total.toString());
    form.setValue('tax', tax);
  }, [form, tiffinMenu, number_of_weeks, order_type, open]);

  const handleAdvanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (
      value === '' ||
      (Number.parseFloat(value) > 0 &&
        Number.parseFloat(value) <= Number(form.getValues('totalAmount')))
    ) {
      setAdvanceAmount(value);
    }
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (
      value === '' ||
      (Number.parseFloat(value) > 0 &&
        Number.parseFloat(value) <= Number(form.getValues('totalAmount')))
    ) {
      setDiscountAmount(value);
    }
  };

  if (isDesktop) {
    return (
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger asChild>
          <Button disabled={!form.formState.isValid}>Submit</Button>
        </DialogTrigger>
        <DialogContent className="z-[1550] flex max-h-[90%] max-w-xl flex-col">
          <DialogHeader>
            <DialogTitle className="font-medium text-2xl">
              Order Confirmation Summary
            </DialogTitle>
            <DialogDescription>
              Confirm your order details below with advance amount.
            </DialogDescription>
          </DialogHeader>
          <div className="scrollbar-thin flex-1 overflow-y-scroll p-4 pt-0">
            <TiffinDialogContent
              advanceAmount={advanceAmount}
              discountAmount={discountAmount}
              form={form}
              handleAdvanceChange={handleAdvanceChange}
              handleDiscountChange={handleDiscountChange}
              note={note}
              pendingAmount={pendingAmount}
              setNote={setNote}
              setPendingAmount={setPendingAmount}
            />
          </div>
          <DialogFooter className="flex w-full items-center sm:justify-between">
            <WhatsappButton
              advanceAmount={advanceAmount}
              discountAmount={discountAmount}
              form={form}
              mutation={mutation}
              note={note}
              pendingAmount={pendingAmount}
              setSentToWhatsapp={setSentToWhatsapp}
            />
            <div className="flex items-center gap-2">
              <DialogClose asChild>
                <Button
                  className="bg-destructive/10 text-destructive hover:bg-destructive/30 hover:text-destructive"
                  variant="ghost"
                >
                  Cancel
                </Button>
              </DialogClose>
              <ConfirmOrderButton
                advanceAmount={advanceAmount}
                discountAmount={discountAmount}
                form={form}
                mutation={mutation}
                note={note}
                pendingAmount={pendingAmount}
                setSentToWhatsapp={setSentToWhatsapp}
              />
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>
        <Button disabled={!form.formState.isValid}>Submit</Button>
      </DrawerTrigger>
      <DrawerContent className="z-[1550] max-h-[90%]">
        <DrawerHeader className="text-left">
          <DialogTitle>Order Confirmation Summary</DialogTitle>
          <DrawerDescription>
            Confirm your order details below with advance amount.
          </DrawerDescription>
        </DrawerHeader>
        <div className="scrollbar-thin flex-1 overflow-y-scroll p-4 pt-0">
          <TiffinDialogContent
            advanceAmount={advanceAmount}
            discountAmount={discountAmount}
            form={form}
            handleAdvanceChange={handleAdvanceChange}
            handleDiscountChange={handleDiscountChange}
            note={note}
            pendingAmount={pendingAmount}
            setNote={setNote}
            setPendingAmount={setPendingAmount}
          />
        </div>
        <DrawerFooter className="pt-2">
          <WhatsappButton
            advanceAmount={advanceAmount}
            discountAmount={discountAmount}
            form={form}
            mutation={mutation}
            note={note}
            pendingAmount={pendingAmount}
            setSentToWhatsapp={setSentToWhatsapp}
          />
          <DrawerClose asChild>
            <Button
              className="bg-destructive/10 text-destructive hover:bg-destructive/30 hover:text-destructive"
              variant="ghost"
            >
              Cancel
            </Button>
          </DrawerClose>
          <ConfirmOrderButton
            advanceAmount={advanceAmount}
            discountAmount={discountAmount}
            form={form}
            mutation={mutation}
            note={note}
            pendingAmount={pendingAmount}
            setSentToWhatsapp={setSentToWhatsapp}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function WhatsappButton({
  form,
  mutation,
  advanceAmount,
  pendingAmount,
  note,
  discountAmount,
  setSentToWhatsapp,
}: {
  form: UseFormReturn<z.infer<typeof ZodTiffinSchema>>;
  mutation: UseMutationResult<unknown, unknown, unknown, unknown>;
  advanceAmount: string;
  pendingAmount: number;
  note: string;
  discountAmount: string;
  setSentToWhatsapp: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <LoadingButton
      className="flex items-center gap-2 border-green-200 text-green-500 hover:bg-green-100 hover:text-green-500"
      disabled={!form.formState.isValid || mutation.isPending}
      form="tiffin-form"
      isLoading={mutation.isPending}
      onClick={() => {
        form.setValue('advancePaid', advanceAmount);
        form.setValue('pendingAmount', pendingAmount.toString());
        form.setValue('note', note);
        form.setValue('discount', discountAmount);
        setSentToWhatsapp(true);
      }}
      type="submit"
      variant="outline"
    >
      <Whatsapp />
      Confirm order
    </LoadingButton>
  );
}

function ConfirmOrderButton({
  form,
  mutation,
  advanceAmount,
  pendingAmount,
  note,
  discountAmount,
  setSentToWhatsapp,
}: {
  form: UseFormReturn<z.infer<typeof ZodTiffinSchema>>;
  mutation: UseMutationResult<unknown, unknown, unknown, unknown>;
  advanceAmount: string;
  pendingAmount: number;
  discountAmount: string;
  note: string;
  setSentToWhatsapp: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <LoadingButton
      disabled={!form.formState.isValid || mutation.isPending}
      form="tiffin-form"
      isLoading={mutation.isPending}
      onClick={() => {
        form.setValue('advancePaid', advanceAmount);
        form.setValue('pendingAmount', pendingAmount.toString());
        form.setValue('discount', discountAmount);
        form.setValue('note', note);
        setSentToWhatsapp(false);
      }}
      type="submit"
    >
      Confirm order
    </LoadingButton>
  );
}
