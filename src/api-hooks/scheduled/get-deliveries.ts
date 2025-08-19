import { useQuery } from '@tanstack/react-query';
import axios from '@/config/axios.config';
import type { ScheduledDeliveryProps } from '@/lib/types/scheduled-order';

async function getScheduledDeliveries(storeId: string) {
  const { data } = await axios.get('/api/order/scheduled/delivery', {
    params: {
      storeId,
    },
  });

  if (data) {
    return data as ScheduledDeliveryProps | null;
  }
  return null;
}

export function useScheduledDeliveries(storeId: string) {
  return useQuery({
    queryKey: ['order', 'scheduled', storeId, 'delivery'],
    queryFn: () => getScheduledDeliveries(storeId),
    staleTime: 1 * 60 * 1000, // Cache remains fresh for 5 minutes
  });
}
