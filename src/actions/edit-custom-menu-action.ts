"use server";

import { revalidatePath } from "next/cache";
import { withDbConnectAndActionAuth } from "@/lib/with-db-connect-and-auth";
import { CateringCustomItemState } from "@/lib/types/catering/catering-order-state";
import CateringCustomMenu from "@/models/cateringCustomMenuModel";

// biome-ignore lint/nursery/useMaxParams: <Ignore>
export async function editCustomMenuAction(
    menuId: string,
    values: CateringCustomItemState
) {
    try {
        // Authorize the user
        await withDbConnectAndActionAuth(["admin", "manager"]);

        await CateringCustomMenu.findByIdAndUpdate(menuId, {
            ...values,
        });

        revalidatePath("/dashboard/menus");

        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An unknown error occurred" };
    }
}
