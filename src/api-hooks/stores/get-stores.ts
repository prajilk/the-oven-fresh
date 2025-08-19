import { useQuery } from '@tanstack/react-query';
import axios from '@/config/axios.config';
import type { StoreDocument } from '@/models/types/store';

async function getStores() {
  const { data } = await axios.get('/api/store');
  if (data?.stores) {
    return data.stores as StoreDocument[] | null;
  }
  return null;
}

export function useStores() {
  return useQuery({
    queryKey: ['stores'],
    queryFn: getStores,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
