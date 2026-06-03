"use server";

import { revalidatePath } from "next/cache";
import { withDbConnectAndActionAuth } from "@/lib/with-db-connect-and-auth";
import CateringCustomMenu from "@/models/cateringCustomMenuModel";
import type { CateringCustomItemState } from "@/lib/types/catering/catering-order-state";

export async function saveCustomItemAction(data: CateringCustomItemState) {
    try {
        // Authorize the user
        await withDbConnectAndActionAuth(["admin", "manager"]);

        const { itemDescription, rate, quantity, unit } = data;

        if (!(itemDescription && rate && quantity && unit)) {
            return { error: "Invalid data format." };
        }

        await CateringCustomMenu.create({
            itemDescription: itemDescription as string,
            rate: Number(rate),
            quantity: Number(quantity),
            unit: unit as string,
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
