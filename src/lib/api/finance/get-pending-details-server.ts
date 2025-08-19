import { headers } from 'next/headers';
import axios from '@/config/axios.config';
import type { PendingDetailsProps } from '@/lib/types/finance';

export async function getPendingDetailsServer() {
  const headerSequence = await headers();
  const cookie = headerSequence.get('cookie');
  const { data } = await axios.get('/api/admin/pending-details', {
    headers: {
      Cookie: `${cookie}`,
    },
  });

  return data.result as PendingDetailsProps[] | null;
}
