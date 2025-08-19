import { headers } from 'next/headers';
import axios from '@/config/axios.config';
import type { UserDocumentPopulate } from '@/models/types/user';

export async function getStaffsServer() {
  const headerSequence = await headers();
  const cookie = headerSequence.get('cookie');
  const { data } = await axios.get('/api/staffs', {
    headers: {
      Cookie: `${cookie}`,
    },
  });

  return data.staffs as UserDocumentPopulate[] | null;
}
