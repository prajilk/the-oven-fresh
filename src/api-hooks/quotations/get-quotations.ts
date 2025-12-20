import { useQuery } from "@tanstack/react-query";
import axios from "@/config/axios.config";
import type { QuotationDocument } from "@/models/types/quotation";

async function getQuotations() {
    const { data } = await axios.get("/api/quotation");
    if (data?.quotations) {
        return data.quotations as QuotationDocument[] | null;
    }
    return null;
}

export function useQuotations() {
    return useQuery({
        queryKey: ["quotation"],
        queryFn: getQuotations,
        staleTime: Number.POSITIVE_INFINITY,
        retry: false,
    });
}
