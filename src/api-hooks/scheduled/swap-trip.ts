import {
    type QueryClient,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "@/config/axios.config";
import type { OnErrorType } from "@/lib/types/react-query";

export async function handleSwapTrip({
    orderType,
    orderId,
    trip,
}: {
    orderType: "catering" | "tiffin";
    orderId: string;
    trip: number;
}) {
    const { data: result } = await axios.patch("/api/order/scheduled/swap", {
        orderId,
        orderType,
        trip,
    });
    return result;
}

export function useSwapTrip(onSuccess: (queryClient: QueryClient) => void) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: handleSwapTrip,
        onSuccess: () => {
            onSuccess(queryClient);
        },
        onError: (error: OnErrorType) => {
            toast.error(
                error.response.data.message || "Error in switching order!"
            );
        },
    });
}
