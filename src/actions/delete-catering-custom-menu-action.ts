"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { withDbConnectAndActionAuth } from "@/lib/with-db-connect-and-auth";
import CateringCustomMenu from "@/models/cateringCustomMenuModel";

export async function deleteCateringCustomMenuAction(id: string) {
    try {
        // Authorize the user
        await withDbConnectAndActionAuth();

        const objectId = mongoose.Types.ObjectId.createFromHexString(id);

        const deletedMenu = await CateringCustomMenu.findByIdAndDelete({
            _id: id,
        });

        if (!deletedMenu) {
            return { error: "Failed to delete menu item." };
        }

        revalidatePath("/dashboard/menus");

        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An unknown error occurred" };
    }
}
