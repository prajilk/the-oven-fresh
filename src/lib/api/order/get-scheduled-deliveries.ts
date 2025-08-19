import { headers } from 'next/headers';
import axios from '@/config/axios.config';
import type { ScheduledDeliveryProps } from '@/lib/types/scheduled-order';

export async function getScheduledDeliveriesServer(storeId: string) {
  const headerSequence = await headers();
  const cookie = headerSequence.get('cookie');
  const { data } = await axios.get('/api/order/scheduled/delivery', {
    params: {
      storeId,
    },
    headers: {
      Cookie: `${cookie}`,
    },
  });

  return data as ScheduledDeliveryProps | null;
}
