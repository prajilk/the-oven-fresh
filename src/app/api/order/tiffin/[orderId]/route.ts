import { revalidatePath } from "next/cache";
import { error403, error404, error500, success200 } from "@/lib/response";
import type { AuthenticatedRequest } from "@/lib/types/auth-request";
import { formatTimezone, isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/with-db-connect-and-auth";
import Address from "@/models/addressModel";
import Catering from "@/models/cateringModel";
import Customer from "@/models/customerModel";
import Store from "@/models/storeModel";
import Tiffin from "@/models/tiffinModel";
import TiffinOrderStatus from "@/models/tiffinOrderStatusModel";

async function deleteHandler(
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        if (isRestricted(req.user, ["admin", "manager"])) {
            return error403();
        }

        const { orderId } = await params;

        const [order] = await Promise.all([
            Tiffin.findByIdAndDelete(orderId),
            TiffinOrderStatus.deleteMany({ orderId }),
        ]);

        if (!order) {
            return error404("Order not found.");
        }

        const [tiffinExist, cateringExist] = await Promise.all([
            Tiffin.findOne({
                customer: order.customer,
                orderId: { $ne: order.orderId },
            }),
            Catering.findOne({
                customer: order.customer,
                orderId: { $ne: order.orderId },
            }),
        ]);

        if (!(tiffinExist || cateringExist)) {
            await Promise.all([
                Customer.findByIdAndDelete(order.customer),
                Address.deleteMany({ customerId: order.customer }),
            ]);
        }

        revalidatePath(`/confirm-order/tiffin/${orderId}`);

        return success200({ message: "Order deleted successfully." });
    } catch (error) {
        if (error instanceof Error) {
            return error500({ error: error.message });
        }
        return error500({ error: "An unknown error occurred" });
    }
}

async function getHandler(
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        if (isRestricted(req.user, ["admin", "manager", "staff"])) {
            return error403();
        }

        const { orderId } = await params;
        const mid = req.nextUrl.searchParams.get("mid");

        const [order, status] = await Promise.all([
            Tiffin.findOne({ orderId })
                .populate({ path: "address", model: Address })
                .populate({ path: "customer", model: Customer })
                .populate({ path: "store", model: Store }),
            TiffinOrderStatus.find({ orderId: mid }),
        ]);

        const formattedStatus = status.map((item) => ({
            ...item._doc,
            date: formatTimezone(item.date),
        }));

        if (order) {
            return success200({
                orders: {
                    ...order?._doc,
                    startDate: formatTimezone(order._doc.startDate),
                    endDate: formatTimezone(order._doc.endDate),
                    individualStatus: formattedStatus,
                },
            });
        }
        return success200({ orders: null });
    } catch (error) {
        if (error instanceof Error) {
            return error500({ error: error.message });
        }
        return error500({ error: "An unknown error occurred" });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
export const DELETE = withDbConnectAndAuth(deleteHandler);
