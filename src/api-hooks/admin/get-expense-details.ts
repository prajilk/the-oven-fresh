import { useQuery } from '@tanstack/react-query';
import axios from '@/config/axios.config';
import type { ExpenseDetailsProps } from '@/lib/types/finance';

export async function getExpenseDetails(month: string, year: string) {
  const { data } = await axios.get('/api/admin/expense-details', {
    params: { month, year },
  });
  if (data?.result) {
    return data.result as ExpenseDetailsProps[] | null;
  }
  return null;
}

export function useExpenseDetails(month: string, year: string) {
  return useQuery({
    queryKey: ['expense', 'expense-details', year, month],
    queryFn: () => getExpenseDetails(month, year),
    staleTime: 10 * 60 * 1000, // Cache remains fresh for 10 minutes
  });
}
