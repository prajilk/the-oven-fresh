import { format } from 'date-fns';
import { headers } from 'next/headers';
import axios from '@/config/axios.config';
import type { MonthlyExpenseTrendProps } from '@/lib/types/finance';

export async function getMonthlyTrendServer() {
  const headerSequence = await headers();
  const cookie = headerSequence.get('cookie');
  const { data } = await axios.get('/api/admin/monthly-trend', {
    params: { year: format(new Date(), 'yyyy') },
    headers: {
      Cookie: `${cookie}`,
    },
  });

  return data.result as MonthlyExpenseTrendProps | null;
}
