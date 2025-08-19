import {
  type QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import type { CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import { toast } from 'sonner';
import axios from '@/config/axios.config';
import type { OnErrorType } from '@/lib/types/react-query';

export async function handleConfirm({
  orderType,
  orderId,
  statusId,
  resource,
  collect,
}: {
  orderType: 'caterings' | 'tiffins';
  orderId: string;
  statusId?: string;
  resource?: string | CloudinaryUploadWidgetInfo | undefined;
  collect: boolean;
}) {
  const { data: result } = await axios.patch('/api/order/delivery/confirm', {
    orderId,
    orderType,
    statusId,
    collect,
    url: (resource as CloudinaryUploadWidgetInfo)?.secure_url,
    publicId: (resource as CloudinaryUploadWidgetInfo)?.public_id,
  });
  return result;
}

export function useConfirmDelivery(
  onSuccess: (queryClient: QueryClient) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleConfirm,
    onSuccess: (result) => {
      onSuccess(queryClient);
      if (result.messageSent === false) {
        toast.error('Failed to send proof to customer. Please inform Admin!');
      }
    },
    onError: (error: OnErrorType) => {
      toast.error(error.response.data.message || 'Error in delivering order!');
    },
  });
}
