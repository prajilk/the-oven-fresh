import { useQuery } from '@tanstack/react-query';
import axios from '@/config/axios.config';
import type { RevenueStat } from '@/lib/types/finance';

export async function getTotalPending() {
  const { data } = await axios.get('/api/admin/total-pending');
  if (data?.result) {
    return data.result as RevenueStat | null;
  }
  return null;
}

export function useTotalPending() {
  return useQuery({
    queryKey: ['total-pending'],
    queryFn: getTotalPending,
    staleTime: 5 * 60 * 1000,
  });
}
