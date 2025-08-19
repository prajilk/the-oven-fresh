import type { PlaceAutocompleteResult } from '@googlemaps/google-maps-services-js';
import { useQuery } from '@tanstack/react-query';
import axios from '@/config/axios.config';

async function getSearchResult(
  query: string,
  key: number,
  signal: AbortSignal
) {
  if (query.length < 3 || key === 0) {
    return [];
  }
  const { data } = await axios.get('/api/address/search', {
    params: { address: query },
    signal,
  });

  if (data?.result) {
    return data.result as PlaceAutocompleteResult[] | undefined;
  }
  return null;
}

export function useSearchAddress({
  address,
  key,
}: {
  address: string;
  key: number;
}) {
  return useQuery({
    queryKey: ['address', 'search', address],
    queryFn: ({ signal }) => getSearchResult(address, key, signal),
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
