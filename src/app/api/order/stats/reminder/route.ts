import { addDays, format } from "date-fns";
import type { Model } from "mongoose";
import { error403, error500, success200 } from "@/lib/response";
import type { AuthenticatedRequest } from "@/lib/types/auth-request";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/with-db-connect-and-auth";
import Catering from "@/models/cateringModel";
import TiffinOrderStatus from "@/models/tiffinOrderStatusModel";

async function getHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["admin", "manager"])) {
            return error403();
        }

        const storeId = req.user?.storeId;

        if (!storeId) {
            return error403();
        }

        const today = format(new Date(), "yyyy-MM-dd");
        const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
        const dayAfter = format(addDays(new Date(), 2), "yyyy-MM-dd");

        // Helper function to count documents
        const countDocuments = async <T extends Document>(
            model: Model<T>,
            query: object
        ): Promise<number> => {
            return await model.countDocuments(query);
        };

        // Run all queries in parallel
        const [
            pendingTiffinToday,
            pendingCateringToday,
            pendingTiffinTomorrow,
            pendingCateringTomorrow,
            pendingTiffinDayAfter,
            pendingCateringDayAfter,
        ] = await Promise.all([
            countDocuments(TiffinOrderStatus, {
                store: storeId,
                date: today,
                status: "PENDING",
            }),
            countDocuments(Catering, {
                store: storeId,
                deliveryDateLocal: today,
                status: "PENDING",
            }),
            countDocuments(TiffinOrderStatus, {
                store: storeId,
                date: tomorrow,
                status: "PENDING",
            }),
            countDocuments(Catering, {
                store: storeId,
                deliveryDateLocal: tomorrow,
                status: "PENDING",
            }),
            countDocuments(TiffinOrderStatus, {
                store: storeId,
                date: dayAfter,
                status: "PENDING",
            }),
            countDocuments(Catering, {
                store: storeId,
                deliveryDateLocal: dayAfter,
                status: "PENDING",
            }),
        ]);

        const todayStats = {
            tiffin: pendingTiffinToday,
            catering: pendingCateringToday,
        };
        const tomorrowStats = {
            tiffin: pendingTiffinTomorrow,
            catering: pendingCateringTomorrow,
        };
        const dayAfterStats = {
            tiffin: pendingTiffinDayAfter,
            catering: pendingCateringDayAfter,
        };

        return success200({
            data: {
                today: todayStats,
                tomorrow: tomorrowStats,
                dayAfter: dayAfterStats,
            },
        });
    } catch (error) {
        if (error instanceof Error) {
            return error500({ error: error.message });
        }
        return error500({ error: "An unknown error occurred" });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
