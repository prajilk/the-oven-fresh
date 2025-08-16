"use server";

import { withDbConnectAndActionAuth } from "@/lib/withDbConnectAndAuth";
import { ZodCateringMenuSchema } from "@/lib/zod-schema/schema";
import CateringMenu from "@/models/cateringMenuModel";
import { CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function addCateringMenuAction(
    values: z.infer<typeof ZodCateringMenuSchema>,
    resource?: string | CloudinaryUploadWidgetInfo
) {
    try {
        // Authorize the user
        await withDbConnectAndActionAuth();

        const result = ZodCateringMenuSchema.safeParse(values);
        const image = resource
            ? (resource as CloudinaryUploadWidgetInfo).secure_url
            : process.env.NEXT_PUBLIC_PLACEHOLDER_IMAGE;
        const publicId = resource
            ? (resource as CloudinaryUploadWidgetInfo).public_id
            : null;

        if (!result.success) {
            return { error: "Invalid data format." };
        }

        await CateringMenu.create({
            ...result.data,
            image,
            publicId,
        });

        revalidatePath("/dashboard/menus");

        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        } else {
            return { error: "An unknown error occurred" };
        }
    }
}
