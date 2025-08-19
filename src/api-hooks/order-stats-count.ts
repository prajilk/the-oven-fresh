import { useQuery } from '@tanstack/react-query';
import axios from '@/config/axios.config';
import type { OrderStatCount } from '@/lib/types/order-stats';

export async function handleOrderStats() {
  const { data: result } = await axios.get('/api/order/stats/today');
  return result.data as OrderStatCount | null;
}

export function useOrderStatsCount() {
  return useQuery({
    queryKey: ['order', 'stats', 'today'],
    queryFn: handleOrderStats,
    staleTime: 5 * 60 * 1000,
  });
}
