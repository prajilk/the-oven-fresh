"use server";

import { revalidatePath } from "next/cache";
import { withDbConnectAndActionAuth } from "@/lib/with-db-connect-and-auth";
import Supplier from "@/models/supplierModel";

export async function deleteSupplierAction(id: string) {
    try {
        // Authorize the user
        await withDbConnectAndActionAuth(["admin", "manager"]);

        await Supplier.deleteOne({ _id: id });

        revalidatePath("/dashboard/supplier");

        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An unknown error occurred" };
    }
}
