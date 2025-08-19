import {
  type QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from '@/config/axios.config';
import type { OnErrorType } from '@/lib/types/react-query';

export async function handleDelete({
  orderType,
  orderId,
}: {
  orderType: 'catering' | 'tiffin';
  orderId: string;
}) {
  const { data: result } = await axios.delete(
    `/api/order/${orderType}/${orderId}`
  );
  return result;
}

export function useDeleteOrder(onSuccess: (queryClient: QueryClient) => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleDelete,
    onSuccess: () => onSuccess(queryClient),
    onError: (error: OnErrorType) => {
      if (error.response.status === 403) {
        toast.error(error.response.data.message || 'Error in deleting order!');
      } else {
        toast.error('Error in deleting order!');
      }
    },
  });
}
