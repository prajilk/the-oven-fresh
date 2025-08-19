import { headers } from 'next/headers';
import axios from '@/config/axios.config';
import type { StoreDocument } from '@/models/types/store';

export async function getStoresServer() {
  const headerSequence = await headers();
  const cookie = headerSequence.get('cookie');
  const { data } = await axios.get('/api/store', {
    headers: {
      Cookie: `${cookie}`,
    },
  });

  return data.stores as StoreDocument[] | null;
}
