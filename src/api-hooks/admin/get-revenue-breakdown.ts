import { useQuery } from '@tanstack/react-query';
import axios from '@/config/axios.config';
import type { RevenueBreakdownProps } from '@/lib/types/finance';

export async function getRevenueBreakdown(year: string, month: string) {
  const { data } = await axios.get('/api/admin/revenue-breakdown', {
    params: {
      year,
      month,
    },
  });
  if (data?.result) {
    return data.result as RevenueBreakdownProps[] | null;
  }
  return null;
}

export function useRevenueBreakdown(year: string, month: string) {
  return useQuery({
    queryKey: ['revenue', 'revenue-breakdown', year, month],
    queryFn: () => getRevenueBreakdown(year, month),
    staleTime: 10 * 60 * 1000, // Cache remains fresh for 10 minutes
  });
}
