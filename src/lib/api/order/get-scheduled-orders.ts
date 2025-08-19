import { format } from 'date-fns';
import { headers } from 'next/headers';
import axios from '@/config/axios.config';
import type { ScheduledOrderProps } from '@/lib/types/scheduled-order';

export async function getScheduledOrdersServer(date: Date, storeId: string) {
  const headerSequence = await headers();
  const cookie = headerSequence.get('cookie');
  const { data } = await axios.get('/api/order/scheduled', {
    params: {
      storeId,
      date: format(date, 'yyyy-MM-dd'),
    },
    headers: {
      Cookie: `${cookie}`,
    },
  });

  return data.orders as ScheduledOrderProps[] | null;
}
