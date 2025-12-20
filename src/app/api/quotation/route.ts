import { error403, error500, success200 } from "@/lib/response";
import type { AuthenticatedRequest } from "@/lib/types/auth-request";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/with-db-connect-and-auth";
import Quotation from "@/models/quotationModel";

async function getHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user)) {
            return error403();
        }

        const quotations = await Quotation.find({});

        return success200({ quotations });
    } catch (error) {
        if (error instanceof Error) {
            return error500({ error: error.message });
        }
        return error500({ error: "An unknown error occurred" });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
