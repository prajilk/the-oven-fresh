import { useQuery } from '@tanstack/react-query';
import axios from '@/config/axios.config';
import type { TiffinMenuDocument } from '@/models/types/tiffin-menu';

async function getTiffinMenu() {
  const { data } = await axios.get('/api/menu/tiffin');
  if (data?.result) {
    return data.result as TiffinMenuDocument | null;
  }
  return null;
}

export function useTiffinMenu() {
  return useQuery({
    queryKey: ['menu', 'tiffin'],
    queryFn: getTiffinMenu,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
