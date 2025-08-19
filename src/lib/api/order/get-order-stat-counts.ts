import { headers } from 'next/headers';
import axios from '@/config/axios.config';
import type { OrderStatCount } from '@/lib/types/order-stats';

export async function getOrderStatCountsServer() {
  const headerSequence = await headers();
  const cookie = headerSequence.get('cookie');
  const { data } = await axios.get('/api/order/stats/today', {
    headers: {
      Cookie: `${cookie}`,
    },
  });

  return data.data as OrderStatCount | null;
}
