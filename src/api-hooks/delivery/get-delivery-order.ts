import { useQuery } from '@tanstack/react-query';
import axios from '@/config/axios.config';
import type {
  ScheduledCateringDelivery,
  ScheduledTiffinDelivery,
} from '@/lib/types/scheduled-order';

export async function getDeliveryOrders(orderType: 'tiffins' | 'caterings') {
  const { data } = await axios.get(
    `/api/order/scheduled/delivery/${orderType}`
  );
  if (orderType === 'tiffins') {
    return data.data as ScheduledTiffinDelivery | null;
  }
  return data.data as ScheduledCateringDelivery | null;
}

export function useDeliveryOrders(orderType: 'tiffins' | 'caterings') {
  return useQuery({
    queryKey: ['order', 'delivery', orderType],
    queryFn: () => getDeliveryOrders(orderType),
    staleTime: 1 * 60 * 1000, // Cache remains fresh for 5 minutes
  });
}
