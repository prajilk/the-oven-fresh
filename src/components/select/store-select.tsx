'use client';

import { MapPin } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import getQueryClient from '@/lib/query-utils/get-query-client';
import type { RootState } from '@/store';
import { setState } from '@/store/slices/select-store-slice';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const StoreSelect = ({
  stores,
}: {
  stores: { id: string; location: string }[];
}) => {
  const [loading, setLoading] = useState(false);
  const queryClient = getQueryClient();
  const value = useSelector((state: RootState) => state.selectStore);
  const dispatch = useDispatch();

  const onValueChange = async (newStoreId: string) => {
    try {
      setLoading(true);
      dispatch(setState(newStoreId));
      await authClient.updateUser({
        storeId: newStoreId,
      });
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['order'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['groceries'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['stores'],
        }),
      ]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to switch store'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select
      disabled={loading}
      onValueChange={onValueChange} // Watch the selected value
      value={value} // Call the onValueChange function when the value changes
    >
      <SelectTrigger
        className="!text-primary w-fit bg-primary-foreground md:w-auto"
        data-placeholder="Store"
      >
        <MapPin className="size-4" />
        <SelectValue placeholder="Store" />
      </SelectTrigger>
      <SelectContent className="z-[1210] bg-primary-foreground text-primary lg:bg-white">
        {stores.map((store) => (
          <SelectItem key={store.id} value={store.id}>
            {loading ? 'Loading...' : store.location}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StoreSelect;
