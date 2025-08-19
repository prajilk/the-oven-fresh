import { headers } from 'next/headers';
import axios from '@/config/axios.config';
import type { StatCardProps } from '@/lib/types/order-stats';

export async function getLastMonthStatsServer(type: 'tiffin' | 'catering') {
  const headerSequence = await headers();
  const cookie = headerSequence.get('cookie');
  const { data } = await axios.get('/api/order/stats/last-month', {
    params: {
      model: type,
    },
    headers: {
      Cookie: `${cookie}`,
    },
  });

  return data.result as StatCardProps | null;
}
