import { headers } from 'next/headers';
import axios from '@/config/axios.config';
import type { CateringDocument } from '@/models/types/catering';

export async function getCateringOrdersServer(limit?: number) {
  const headerSequence = await headers();
  const cookie = headerSequence.get('cookie');
  const { data } = await axios.get('/api/order/catering', {
    params: {
      limit,
    },
    headers: {
      Cookie: `${cookie}`,
    },
  });

  return data.orders as CateringDocument[] | null;
}
