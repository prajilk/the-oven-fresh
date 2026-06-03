import { useQuery } from "@tanstack/react-query";
import axios from "@/config/axios.config";
import type { CateringCustomMenuDocument } from "@/models/types/catering-menu";

export async function getCateringCustomMenu() {
    const { data } = await axios.get("/api/menu/catering-custom");

    if (data?.result) {
        return data.result as CateringCustomMenuDocument[] | null;
    }
    return null;
}

export function useCateringCustomMenu() {
    return useQuery({
        queryKey: ["menu", "catering-custom"],
        queryFn: () => getCateringCustomMenu(),
        staleTime: 10 * 60 * 1000, // Cache remains fresh for 10 minutes
    });
}
