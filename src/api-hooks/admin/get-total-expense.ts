import { useQuery } from '@tanstack/react-query';
import axios from '@/config/axios.config';
import type { ExpenseStat } from '@/lib/types/finance';

export async function getTotalExpense(year: string) {
  const { data } = await axios.get('/api/admin/total-expense', {
    params: {
      year,
    },
  });
  if (data?.result) {
    return data.result as ExpenseStat | null;
  }
  return null;
}

export function useTotalExpense(year: string) {
  return useQuery({
    queryKey: ['expense', 'total-expense', year],
    queryFn: () => getTotalExpense(year),
    staleTime: 5 * 60 * 1000,
  });
}
