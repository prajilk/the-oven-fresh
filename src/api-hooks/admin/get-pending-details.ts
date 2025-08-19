import { useQuery } from '@tanstack/react-query';
import axios from '@/config/axios.config';
import type { PendingDetailsProps } from '@/lib/types/finance';

export async function getPendingDetails() {
  const { data } = await axios.get('/api/admin/pending-details');
  if (data?.result) {
    return data.result as PendingDetailsProps[] | null;
  }
  return null;
}

export function usePendingDetails() {
  return useQuery({
    queryKey: ['pending-details'],
    queryFn: getPendingDetails,
    staleTime: 10 * 60 * 1000, // Cache remains fresh for 10 minutes
  });
}
