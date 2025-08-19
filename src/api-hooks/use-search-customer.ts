import { useQuery } from '@tanstack/react-query';
import axios from '@/config/axios.config';
import type { CustomerSearchResult } from '@/lib/types/customer';

async function getSearchResult(query: string, signal: AbortSignal) {
  if (!query) {
    return null;
  }
  const { data } = await axios.get('/api/customer/search', {
    params: { phone: query },
    signal,
  });
  if (data?.result) {
    return data.result as CustomerSearchResult[] | null;
  }
  return null;
}

export function useSearchCustomer(search: string) {
  return useQuery({
    queryKey: ['customer', 'search', search],
    queryFn: ({ signal }) => getSearchResult(search, signal),
    retry: false,
    staleTime: 10 * 60 * 1000,
  });
}
