import { error400, error403, error500, success200 } from "@/lib/response";
import type { AuthenticatedRequest } from "@/lib/types/auth-request";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/with-db-connect-and-auth";
import Catering from "@/models/cateringModel";
import Tiffin from "@/models/tiffinModel";

async function patchHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["admin", "manager"])) {
            return error403();
        }

        const { orderId, orderType, trip } = await req.json();
        if (!(orderId || orderType || trip)) {
            return error400("Invalid order id or type.");
        }

        if (orderType === "tiffin") {
            await Tiffin.findByIdAndUpdate(orderId, { trip });
        } else {
            await Catering.findByIdAndUpdate(orderId, { trip });
        }

        return success200({});
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "An unknown error occurred";
        return error500({ error: message });
    }
}

export const PATCH = withDbConnectAndAuth(patchHandler);
