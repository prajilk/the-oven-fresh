"use server";

import { revalidatePath } from "next/cache";
import { withDbConnectAndActionAuth } from "@/lib/with-db-connect-and-auth";
import { ZodSupplierSchema } from "@/lib/zod-schema/schema";
import Supplier from "@/models/supplierModel";

export async function addSupplierAction(formData: FormData) {
    try {
        // Authorize the user
        const { user } = await withDbConnectAndActionAuth();

        const storeId = user?.storeId;
        if (!storeId) {
            return { error: "Store not found." };
        }

        const result = ZodSupplierSchema.safeParse(
            Object.fromEntries(formData.entries())
        );

        if (!result.success) {
            return { error: "Invalid data format." };
        }

        const balance =
            Number(result.data.totalAmount) - Number(result.data.paid);

        await Supplier.create({
            store: storeId,
            name: result.data.name,
            invoice: result.data.invoice,
            totalAmount: result.data.totalAmount,
            date: result.data.date,
            paid: result.data.paid,
            balance,
            status: balance <= 0 ? "Fully Paid" : "Partially Paid",
        });

        revalidatePath("/dashboard/supplier");

        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.startsWith("E11000")) {
                return { error: "Invoice Number already exists." };
            }
            return { error: error.message };
        }
        return { error: "An unknown error occurred" };
    }
}

export async function editSupplierAction(formData: FormData) {
    try {
        // Authorize the user
        const { user } = await withDbConnectAndActionAuth();

        const storeId = user?.storeId;
        if (!storeId) {
            return { error: "Store not found." };
        }

        const result = ZodSupplierSchema.safeParse(
            Object.fromEntries(formData.entries())
        );
        const invoiceId = formData.get("id");

        if (!(result.success && invoiceId)) {
            return { error: "Invalid data format." };
        }

        const balance =
            Number(result.data.totalAmount) - Number(result.data.paid);

        await Supplier.findByIdAndUpdate(invoiceId, {
            store: storeId,
            name: result.data.name,
            invoice: result.data.invoice,
            totalAmount: result.data.totalAmount,
            date: result.data.date,
            paid: result.data.paid,
            balance,
            status: balance <= 0 ? "Fully Paid" : "Partially Paid",
        });

        revalidatePath("/dashboard/supplier");

        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.startsWith("E11000")) {
                return { error: "Invoice Number already exists." };
            }
            return { error: error.message };
        }
        return { error: "An unknown error occurred" };
    }
}
