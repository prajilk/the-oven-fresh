import { useQuery } from '@tanstack/react-query';
import axios from '@/config/axios.config';
import type { StatCardProps } from '@/lib/types/order-stats';

export async function handleOrderStats(model: 'tiffin' | 'catering') {
  const { data } = await axios.get('/api/order/stats/last-month', {
    params: {
      model,
    },
  });
  return data.result as StatCardProps | null;
}

export function useLastMonthStats(type: 'tiffin' | 'catering') {
  return useQuery({
    queryKey: ['order', 'stats', 'last-month', type],
    queryFn: () => handleOrderStats(type),
    staleTime: 5 * 60 * 1000,
  });
}
