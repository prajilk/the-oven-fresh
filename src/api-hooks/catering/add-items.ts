import {
  type QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from '@/config/axios.config';
import type { CateringItemsState } from '@/lib/types/catering/catering-order-state';
import type { OnErrorType } from '@/lib/types/react-query';

export async function handleCreate({
  orderId,
  menuItems,
}: {
  orderId: string;
  menuItems: CateringItemsState[];
}) {
  const { data: result } = await axios.patch(`/api/order/catering/${orderId}`, {
    items: menuItems.map((item) => ({
      itemId: item._id,
      priceAtOrder: item.priceAtOrder,
      quantity: item.quantity,
      size: item.size,
    })),
  });
  return result;
}

export function useAddItems(onSuccess: (queryClient: QueryClient) => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleCreate,
    onSuccess: () => onSuccess(queryClient),
    onError: (error: OnErrorType) => {
      toast.error(error.response.data.message || 'Error in updating order!');
    },
  });
}
