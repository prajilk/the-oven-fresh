import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import axios from '@/config/axios.config';
import type { GroceryDocument } from '@/models/types/grocery';

async function getGroceries(date: Date | 'all') {
  const params = date === 'all' ? {} : { date: format(date, 'yyyy-MM-dd') };
  const { data } = await axios.get('/api/groceries', {
    params,
  });
  if (data?.groceries) {
    return data.groceries as GroceryDocument[] | null;
  }
  return null;
}

export function useGroceries(date: Date | 'all') {
  const key =
    date === 'all' ? ['groceries'] : ['groceries', format(date, 'yyyy-MM-dd')];
  return useQuery({
    queryKey: key,
    queryFn: () => getGroceries(date),
    staleTime: 10 * 60 * 1000, // Cache remains fresh for 10 minutes
  });
}
