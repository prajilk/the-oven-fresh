import { headers } from 'next/headers';
import axios from '@/config/axios.config';
import type { GroceryDocument } from '@/models/types/grocery';

export async function getGroceriesServer() {
  const headerSequence = await headers();
  const cookie = headerSequence.get('cookie');
  const { data } = await axios.get('/api/groceries', {
    headers: {
      Cookie: `${cookie}`,
    },
  });

  return data.groceries as GroceryDocument[] | null;
}
