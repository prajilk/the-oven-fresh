import { format } from 'date-fns';
import { headers } from 'next/headers';
import axios from '@/config/axios.config';
import type { RevenueBreakdownProps } from '@/lib/types/finance';

export async function getRevenueBreakdownServer() {
  const headerSequence = await headers();
  const cookie = headerSequence.get('cookie');
  const { data } = await axios.get('/api/admin/revenue-breakdown', {
    params: {
      year: format(new Date(), 'yyyy'),
    },
    headers: {
      Cookie: `${cookie}`,
    },
  });

  return data.result as RevenueBreakdownProps[] | null;
}
