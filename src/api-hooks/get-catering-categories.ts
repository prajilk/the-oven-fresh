import { useQuery } from '@tanstack/react-query';
import axios from '@/config/axios.config';
import type { CateringCategoryDocument } from '@/models/types/catering-category';

async function getCategories() {
  const { data } = await axios.get('/api/menu/category');
  if (data?.categories) {
    return data.categories as CateringCategoryDocument[] | null;
  }
  return null;
}

export function useCategories() {
  return useQuery({
    queryKey: ['menu', 'category'],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000, // Cache remains fresh for 10 minutes
  });
}
