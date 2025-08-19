import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import axios from '@/config/axios.config';
import type { ScheduledOrderProps } from '@/lib/types/scheduled-order';

async function getScheduledOrders(date: Date, storeId: string) {
  const { data } = await axios.get('/api/order/scheduled', {
    params: {
      storeId,
      date: format(date, 'yyyy-MM-dd'),
    },
  });

  if (data?.orders) {
    return data.orders as ScheduledOrderProps[] | null;
  }
  return null;
}

export function useScheduledOrders(date: Date, storeId: string, key: string[]) {
  return useQuery({
    queryKey: key,
    queryFn: () => getScheduledOrders(date, storeId),
    staleTime: 5 * 60 * 1000, // Cache remains fresh for 5 minutes
  });
}
