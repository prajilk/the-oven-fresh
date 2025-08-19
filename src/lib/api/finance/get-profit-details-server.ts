import { format } from 'date-fns';
import { headers } from 'next/headers';
import axios from '@/config/axios.config';
import type { ProfitDetailsProps } from '@/lib/types/finance';

export async function getProfitDetailsServer() {
  const headerSequence = await headers();
  const cookie = headerSequence.get('cookie');
  const { data } = await axios.get('/api/admin/profit-details', {
    params: {
      year: format(new Date(), 'yyyy'),
      month: format(new Date(), 'MMM').toLowerCase(),
    },
    headers: {
      Cookie: `${cookie}`,
    },
  });

  return data.result as ProfitDetailsProps[] | null;
}
