"use server";

import { revalidatePath } from "next/cache";
import { withDbConnectAndActionAuth } from "@/lib/with-db-connect-and-auth";
import Quotation from "@/models/quotationModel";

export async function deleteQuotationAction(id: string) {
    try {
        // Authorize the user
        await withDbConnectAndActionAuth();

        const deletedQuotation = await Quotation.deleteOne({ _id: id });

        if (!deletedQuotation.acknowledged) {
            return { error: "Failed to delete quotation" };
        }

        revalidatePath("/dashboard/quotations");

        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An unknown error occurred" };
    }
}
