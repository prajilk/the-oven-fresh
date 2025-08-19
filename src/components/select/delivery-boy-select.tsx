'use client';

import { MapPin } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { changeDeliveryBoyAction } from '@/actions/change-delivery-boy-action';
import type { UserDocument } from '@/models/types/user';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const DeliveryBoySelect = ({
  staffs,
  defaultValue,
  zone,
}: {
  staffs: Pick<UserDocument, '_id' | 'username' | 'zone'>[];
  zone: number;
  defaultValue?: string;
}) => {
  const [loading, setLoading] = useState(false);

  const onValueChange = (staff: string) => {
    setLoading(true);
    const promise = async () => {
      const result = await changeDeliveryBoyAction(staff, zone);
      setLoading(false);
      if (result.success) {
        return result;
      }
      throw result;
    };

    toast.promise(promise(), {
      loading: 'Updating delivery boy...',
      success: () => 'Updated successfully.',
      error: ({ error }) => (error ? error : 'Failed to update delivery boy.'),
    });
  };

  return (
    <Select
      // value={value} // Watch the selected value
      defaultValue={defaultValue} // Call the onValueChange function when the value changes
      disabled={loading}
      onValueChange={onValueChange}
    >
      <SelectTrigger className="w-fit text-xs capitalize md:w-auto">
        <MapPin className="size-4" />
        <SelectValue placeholder="Delivery Boy" />
      </SelectTrigger>
      <SelectContent className="z-[1210] bg-primary-foreground text-primary lg:bg-white">
        {staffs?.map((staff) => (
          <SelectItem
            className="capitalize"
            key={staff._id}
            value={staff._id.toString()}
          >
            {staff.username}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DeliveryBoySelect;
