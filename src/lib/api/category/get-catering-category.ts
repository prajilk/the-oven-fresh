import { headers } from 'next/headers';
import axios from '@/config/axios.config';
import type { CateringCategoryDocument } from '@/models/types/catering-category';

export async function getCateringCategoryServer() {
  const headerSequence = await headers();
  const cookie = headerSequence.get('cookie');
  const { data } = await axios.get('/api/menu/category', {
    headers: {
      Cookie: `${cookie}`,
    },
  });

  return data.categories as CateringCategoryDocument[] | null;
}
