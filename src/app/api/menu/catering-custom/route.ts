import { error403, error500, success200 } from "@/lib/response";
import type { AuthenticatedRequest } from "@/lib/types/auth-request";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/with-db-connect-and-auth";
import CateringCustomMenu from "@/models/cateringCustomMenuModel";

async function getHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["admin", "manager", "staff"])) {
            return error403();
        }

        const menu = await CateringCustomMenu.find();

        return success200({ result: menu });
    } catch (error) {
        if (error instanceof Error) {
            return error500({ error: error.message });
        }
        return error500({ error: "An unknown error occurred" });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
