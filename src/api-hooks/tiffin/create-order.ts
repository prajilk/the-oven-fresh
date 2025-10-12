import {
  type QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import type { z } from 'zod';
import axios from '@/config/axios.config';
import type { OnErrorType } from '@/lib/types/react-query';
import type { ZodTiffinSchema } from '@/lib/zod-schema/schema';

type CreateTiffinOrderProps = {
  values: z.infer<typeof ZodTiffinSchema>;
  googleAddress: {
    address: string;
    placeId: string;
  };
  sentToWhatsapp?: boolean;
};

export async function handleCreate({
  values,
  googleAddress,
  sentToWhatsapp = false,
}: CreateTiffinOrderProps) {
  const { data: result } = await axios.post('/api/order/tiffin', {
    ...values,
    googleAddress,
    sentToWhatsapp,
  });
  return result;
}

export function useCreateTiffinOrder(
  onSuccess: (queryClient: QueryClient) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleCreate,
    onSuccess: (result) => {
      onSuccess(queryClient);
      if (result.messageSent === false) {
        toast.error('Error sending whatsapp message.');
      } else if (result.messageSent === true) {
        toast.success('Order details sent to customer.');
      }
    },
    onError: (error: OnErrorType) => {
      if (error.response.status === 403) {
        toast.error(error.response.data.message || 'Error in creating order!');
      } else {
        toast.error('Error in creating order!');
      }
    },
  });
}
