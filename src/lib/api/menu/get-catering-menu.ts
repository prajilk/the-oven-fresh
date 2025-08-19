import { headers } from 'next/headers';
import axios from '@/config/axios.config';
import type { CateringMenuDocumentPopulate } from '@/models/types/catering-menu';

export async function getCateringMenuServer(disabled?: 'true' | 'false') {
  const headerSequence = await headers();
  const cookie = headerSequence.get('cookie');
  const { data } = await axios.get('/api/menu/catering', {
    headers: {
      Cookie: `${cookie}`,
    },
    params: {
      disabled,
    },
  });

  return data.result as CateringMenuDocumentPopulate[] | null;
}
