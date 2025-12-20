import { headers } from "next/headers";
import axios from "@/config/axios.config";
import type { QuotationDocument } from "@/models/types/quotation";

export async function getQuotationsServer(limit?: number) {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/quotation", {
        params: {
            limit,
        },
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.quotations as QuotationDocument[] | null;
}
