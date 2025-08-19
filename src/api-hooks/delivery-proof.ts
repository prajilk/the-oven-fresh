import { useInfiniteQuery } from '@tanstack/react-query';
import axios from '@/config/axios.config';
import type { DeliveryProof } from '@/lib/types/delivery';

async function getDeliveryProofs({
  pageParam = 1,
  search = '',
  signal,
}: {
  signal: AbortSignal;
  pageParam?: number;
  search?: string;
}) {
  const { data } = await axios.get('/api/admin/delivery-proof', {
    params: {
      page: pageParam,
      search,
    },
    signal,
  });
  if (data?.proofs) {
    return data.proofs as DeliveryProof[] | null;
  }
  return null;
}

export function useDeliveryProofs(search: string) {
  return useInfiniteQuery({
    queryKey: ['delivery-proof', search],
    queryFn: ({ signal, pageParam }) =>
      getDeliveryProofs({ pageParam, search, signal }),
    staleTime: 10 * 60 * 1000, // Cache remains fresh for 10 minutes
    retry: 3,
    initialPageParam: 1,
    getNextPageParam: (_, pages) => pages.length + 1,
  });
}
