import { Box, Stack } from "@mui/material";
import CateringOrderDetails from "@/components/catering/order-details";
import TiffinOrderDetails from "@/components/tiffin/order-details";
import { getOrderServer } from "@/lib/api/order/get-order";
import type { CateringDocumentPopulate } from "@/models/types/catering";
import type { TiffinDocumentPopulate } from "@/models/types/tiffin";
import { type ReactNode } from "react";

const OrderPage = async ({
    params,
    searchParams,
}: {
    params: Promise<{ orderId: string }>;
    searchParams: Promise<{ mid: string | undefined }>;
}) => {
    const { orderId: orderKey } = await params;
    const orderType = orderKey.split("-")[0];
    const orderId = `${orderKey.split("-")[1]}-${orderKey.split("-")[2]}`;
    const mid = (await searchParams).mid;

    if (orderType !== "catering" && orderType !== "tiffin") {
        return (
            <Base>
                <h1 className="text-lg">Order not found</h1>
                <p>Invalid order type.</p>
            </Base>
        );
    }

    if (orderType === "tiffin" && !mid) {
        return (
            <Base>
                <h1 className="text-lg">Order not found</h1>
                <p>No MID provided.</p>
            </Base>
        );
    }

    const order = await getOrderServer(orderId, orderType, mid as string).catch(
        () => (
            <Base>
                <h1>Sorry, something went wrong.</h1>
            </Base>
        )
    );

    if (!order) {
        return (
            <Base>
                <h1 className="text-lg">Order not found</h1>
                <p>Order you are looking for does not exist.</p>
            </Base>
        );
    }

    return (
        <Base>
            {orderType === "catering" ? (
                <CateringOrderDetails
                    orderData={order as CateringDocumentPopulate}
                />
            ) : (
                <TiffinOrderDetails
                    orderData={order as TiffinDocumentPopulate}
                />
            )}
        </Base>
    );
};

export default OrderPage;

function Base({ children }: { children: ReactNode }) {
    return (
        <Box className="flex-grow overflow-auto" component="main">
            <Stack
                spacing={2}
                sx={{
                    alignItems: "center",
                    mx: { xs: 1.5, md: 3 },
                    pb: 5,
                    pt: { xs: 2, md: 0 },
                    mt: { xs: 8, md: 2 },
                }}
            >
                {children}
            </Stack>
        </Box>
    );
}
