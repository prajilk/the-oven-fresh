import { useQuery } from '@tanstack/react-query';
import axios from '@/config/axios.config';
import type { CateringMenuDocumentPopulate } from '@/models/types/catering-menu';

export async function getCateringMenu(disabled?: 'true' | 'false') {
  const { data } = await axios.get('/api/menu/catering', {
    params: {
      disabled,
    },
  });

  if (data?.result) {
    return data.result as CateringMenuDocumentPopulate[] | null;
  }
  return null;
}

export function useCateringMenu(disabled?: 'true' | 'false') {
  return useQuery({
    queryKey: ['menu', 'catering'],
    queryFn: () => getCateringMenu(disabled),
    staleTime: 10 * 60 * 1000, // Cache remains fresh for 10 minutes
  });
}
