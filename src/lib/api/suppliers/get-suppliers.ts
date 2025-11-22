import { headers } from "next/headers";
import axios from "@/config/axios.config";
import type { SupplierDocument } from "@/models/types/supplier";

export async function getSuppliersServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/suppliers", {
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.suppliers as SupplierDocument[] | null;
}
