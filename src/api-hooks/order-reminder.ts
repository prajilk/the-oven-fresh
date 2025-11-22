import { useQuery } from "@tanstack/react-query";
import axios from "@/config/axios.config";
import type { OrderReminder } from "@/lib/types/order-stats";

export async function handleOrderReminder() {
    const { data: result } = await axios.get("/api/order/stats/reminder");
    return result.data as OrderReminder | null;
}

export function useOrderReminder() {
    return useQuery({
        queryKey: ["order", "stats", "reminder"],
        queryFn: handleOrderReminder,
        staleTime: 5 * 60 * 1000,
    });
}
