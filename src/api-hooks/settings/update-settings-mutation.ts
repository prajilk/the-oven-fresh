import {
  type QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from '@/config/axios.config';
import type { OnErrorType } from '@/lib/types/react-query';
import type { SettingsDocument } from '@/models/types/setting';

export async function handleCreate({
  disable_sending_proof,
}: Partial<SettingsDocument>) {
  const { data: result } = await axios.patch('/api/settings', {
    disable_sending_proof,
  });
  return result;
}

export function useSettingsMutation(
  onSuccess: (queryClient: QueryClient) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleCreate,
    onSuccess: () => onSuccess(queryClient),
    onError: (error: OnErrorType) => {
      if (error.response.status === 403) {
        toast.error(error.response.data.message || 'Error in creating order!');
      } else {
        toast.error('Error in creating order!');
      }
    },
  });
}
