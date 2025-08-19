import { headers } from 'next/headers';
import axios from '@/config/axios.config';
import type { DeliveryProof } from '@/lib/types/delivery';

export async function getDeliveryProofServer() {
  const headerSequence = await headers();
  const cookie = headerSequence.get('cookie');
  const { data } = await axios.get('/api/admin/delivery-proof', {
    params: {
      page: 1,
    },
    headers: {
      Cookie: `${cookie}`,
    },
  });

  return (data?.proofs ?? null) as DeliveryProof[] | null;
}
