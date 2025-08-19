import { headers } from 'next/headers';
import axios from '@/config/axios.config';
import type {
  ScheduledCateringDelivery,
  ScheduledTiffinDelivery,
} from '@/lib/types/scheduled-order';

export async function getDeliveryOrdersServer(
  orderType: 'tiffins' | 'caterings'
) {
  const headerSequence = await headers();
  const cookie = headerSequence.get('cookie');
  const { data } = await axios.get(
    `/api/order/scheduled/delivery/${orderType}`,
    {
      headers: {
        Cookie: `${cookie}`,
      },
    }
  );

  if (orderType === 'tiffins') {
    return data.data as ScheduledTiffinDelivery | null;
  }
  return data.data as ScheduledCateringDelivery | null;
}
