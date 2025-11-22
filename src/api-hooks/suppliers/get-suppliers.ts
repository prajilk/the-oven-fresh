import { useQuery } from "@tanstack/react-query";
import axios from "@/config/axios.config";
import type { SupplierDocument } from "@/models/types/supplier";

async function getSuppliers() {
    const { data } = await axios.get("/api/suppliers");
    if (data?.suppliers) {
        return data.suppliers as SupplierDocument[] | null;
    }
    return null;
}

export function useSuppliers() {
    return useQuery({
        queryKey: ["suppliers"],
        queryFn: getSuppliers,
        staleTime: Number.POSITIVE_INFINITY,
    });
}
