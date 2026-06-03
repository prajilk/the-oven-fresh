import { headers } from "next/headers";
import axios from "@/config/axios.config";
import type { CateringCustomMenuDocument } from "@/models/types/catering-menu";

export async function getCateringCustomMenuServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/menu/catering-custom", {
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.result as CateringCustomMenuDocument[] | null;
}
