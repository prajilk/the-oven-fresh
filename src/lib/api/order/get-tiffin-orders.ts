import { headers } from 'next/headers';
import axios from '@/config/axios.config';
import type { TiffinDocument } from '@/models/types/tiffin';

export async function getTiffinOrdersServer(limit?: number) {
  const headerSequence = await headers();
  const cookie = headerSequence.get('cookie');
  const { data } = await axios.get('/api/order/tiffin', {
    params: {
      limit,
    },
    headers: {
      Cookie: `${cookie}`,
    },
  });

  return data.orders as TiffinDocument[] | null;
}
