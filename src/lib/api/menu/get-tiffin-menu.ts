import { headers } from 'next/headers';
import axios from '@/config/axios.config';
import type { TiffinMenuDocument } from '@/models/types/tiffin-menu';

export async function getTiffinMenuServer() {
  const headerSequence = await headers();
  const cookie = headerSequence.get('cookie');
  const { data } = await axios.get('/api/menu/tiffin', {
    headers: {
      Cookie: `${cookie}`,
    },
  });

  return data.result as TiffinMenuDocument | null;
}
