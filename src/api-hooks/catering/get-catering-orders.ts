import { useQuery } from '@tanstack/react-query';
import axios from '@/config/axios.config';
import type { CateringDocumentPopulate } from '@/models/types/catering';

async function getCateringOrders(limit?: number) {
  const { data } = await axios.get('/api/order/catering', {
    params: {
      limit,
    },
  });

  if (data?.orders) {
    return data.orders as CateringDocumentPopulate[] | null;
  }
  return null;
}

export function useCateringOrders(limit?: number) {
  return useQuery({
    queryKey: ['order', 'catering'],
    queryFn: () => getCateringOrders(limit),
    staleTime: 5 * 60 * 1000,
  });
}
