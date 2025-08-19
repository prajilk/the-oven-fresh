import { headers } from 'next/headers';
import axios from '@/config/axios.config';
import type { CateringDocumentPopulate } from '@/models/types/catering';
import type { TiffinDocumentPopulate } from '@/models/types/tiffin';

export async function getOrderServer<
  T extends TiffinDocumentPopulate | CateringDocumentPopulate,
>(
  orderId: string,
  orderType: 'tiffin' | 'catering',
  mid?: string
): Promise<T | null> {
  const headerSequence = await headers();
  const cookie = headerSequence.get('cookie');

  // Determine the correct endpoint based on order type
  const endpoint = `/api/order/${orderType}/${orderId}`;

  const { data } = await axios.get(endpoint, {
    params: {
      mid,
    },
    headers: {
      Cookie: `${cookie}`,
    },
  });

  return data.orders as T;
}
