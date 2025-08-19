import { useQuery } from '@tanstack/react-query';
import axios from '@/config/axios.config';
import type { UserDocumentPopulate } from '@/models/types/user';

async function getStaffs() {
  const { data } = await axios.get('/api/staffs');
  if (data?.staffs) {
    return data.staffs as UserDocumentPopulate[] | null;
  }
  return null;
}

export function useStaffs() {
  return useQuery({
    queryKey: ['staffs'],
    queryFn: getStaffs,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
