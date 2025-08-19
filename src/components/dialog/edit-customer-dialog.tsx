'use client';

import { Button } from '@heroui/button';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { editCustomerAction } from '@/actions/edit-customer-action';
import { Button as ShadButton } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '../ui/phone-input';
import { Textarea } from '../ui/textarea';

const EditCustomerDialog = ({
  orderId,
  nameAtOrder,
  phoneAtOrder,
  orderType,
  note,
}: {
  orderId: string;
  nameAtOrder: string;
  phoneAtOrder: string;
  orderType: 'catering' | 'tiffin';
  note: string;
}) => {
  const [loading, setLoading] = useState(false);
  const handleSubmit = (formData: FormData) => {
    formData.append('orderId', orderId);
    formData.append('orderType', orderType);

    setLoading(true);

    const promise = async () => {
      const result = await editCustomerAction(formData);
      setLoading(false);
      if (result.success) {
        return result;
      }
      throw result;
    };

    toast.promise(promise(), {
      loading: 'Updating customer details...',
      success: () => 'Customer details updated successfully.',
      error: 'Failed to update customer details.',
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button isIconOnly radius="full" size="sm" variant="flat">
          <Pencil size={15} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit customer details</DialogTitle>
        </DialogHeader>
        <form
          action={handleSubmit}
          className="grid gap-4 py-4"
          id="edit-customer-form"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="firstName">
              First Name
            </Label>
            <Input
              className="col-span-3"
              defaultValue={nameAtOrder.split(' ')[0]}
              id="firstName"
              name="firstName"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="lastName">
              Last Name
            </Label>
            <Input
              className="col-span-3"
              defaultValue={nameAtOrder.split(' ')[1]}
              id="lastName"
              name="lastName"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="phone">
              Phone
            </Label>
            <PhoneInput
              className="col-span-3"
              defaultCountry="CA"
              id="phone"
              name="phone"
              placeholder="phone"
              value={phoneAtOrder}
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right" htmlFor="note">
              Note
            </Label>
            <Textarea
              className="col-span-3"
              defaultValue={note}
              id="note"
              name="note"
              placeholder="Enter a note (Optional)"
            />
          </div>
        </form>
        <DialogFooter>
          <ShadButton
            disabled={loading}
            form="edit-customer-form"
            type="submit"
          >
            Save changes
          </ShadButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomerDialog;
