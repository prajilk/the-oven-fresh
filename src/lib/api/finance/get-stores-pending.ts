import { headers } from 'next/headers';
import axios from '@/config/axios.config';
import type { RevenueStat } from '@/lib/types/finance';

export async function getStoresPendingServer() {
  const headerSequence = await headers();
  const cookie = headerSequence.get('cookie');
  const { data } = await axios.get('/api/admin/stores-pending', {
    headers: {
      Cookie: `${cookie}`,
    },
  });

  return data.result as { location: string; data: RevenueStat }[] | null;
}
