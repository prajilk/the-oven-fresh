"use server";

import { withDbConnectAndActionAuth } from "@/lib/withDbConnectAndAuth";
import DeliveryImage from "@/models/deliveryImageModel";
import User from "@/models/userModel";
import { revalidatePath } from "next/cache";

export async function deleteStaffAction(id: string) {
    try {
        // Authorize the user
        await withDbConnectAndActionAuth();

        const isRelated = await DeliveryImage.findOne({ user: id });
        if (isRelated) {
            return {
                error: "Cannot delete staff, as they have related deliveries.",
            };
        }

        const deletedUser = await User.deleteOne({ _id: id });

        if (!deletedUser.acknowledged) {
            return { error: "Failed to delete staff" };
        }

        revalidatePath("/dashboard/staffs");

        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        } else {
            return { error: "An unknown error occurred" };
        }
    }
}
