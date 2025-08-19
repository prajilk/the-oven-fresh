import { useQuery } from '@tanstack/react-query';
import axios from '@/config/axios.config';
import type { RevenueStat } from '@/lib/types/finance';

export async function getStoresPending() {
  const { data } = await axios.get('/api/admin/stores-pending');
  if (data?.result) {
    return data.result as { location: string; data: RevenueStat }[] | null;
  }
  return null;
}

export function useStoresPending() {
  return useQuery({
    queryKey: ['stores-pending'],
    queryFn: getStoresPending,
    staleTime: 10 * 60 * 1000, // Cache remains fresh for 10 minutes
  });
}
