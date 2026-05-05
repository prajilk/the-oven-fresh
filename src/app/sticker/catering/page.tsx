import connectDB from "@/config/mongoose";
import CateringMenu from "@/models/cateringMenuModel";
import Catering from "@/models/cateringModel";
import type { CateringDocumentPopulate } from "@/models/types/catering";
import CateringSheet from "./pdf-sticker-generator";
import Address from "@/models/addressModel";

const CateringStickerPage = async ({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const remarks = await searchParams;
    const orderId = remarks?.orderId;

    if (!orderId) {
        return <div>No order ID provided</div>;
    }

    const firstKey = Object.keys(remarks || {})[0];
    delete remarks?.[firstKey];

    await connectDB();
    const order = (await Catering.findOne({
        orderId,
    })
        .populate({
            path: "items.itemId",
            model: CateringMenu,
            select: "name",
        })
        .populate({
            path: "address",
            model: Address,
        })) as CateringDocumentPopulate;

    return (
        <CateringSheet
            order={{
                id: orderId as string,
                deliveryDate: order.deliveryDate,
                createdAt: order.createdAt,
                order_type: order.order_type,
                customerName: order.customerName,
                address: order.address?.address,
                phone: order.customerPhone,
                order_taken_by: order.order_taken_by,
                fullyPaid: order.fullyPaid,
                items: order.items.map((item) => ({
                    _id: item.itemId._id.toString(),
                    name: item.itemId.name,
                    quantity: item.quantity,
                    priceAtOrder: item.priceAtOrder,
                    size: item.size,
                })),
                customItems: order.customItems.map((item) => ({
                    _id: item._id.toString(),
                    itemDescription: item.itemDescription,
                    quantity: item.quantity,
                    rate: item.rate,
                    unit: item.unit,
                })),
            }}
            remarks={remarks as Record<string, string>}
        />
    );
};

export default CateringStickerPage;
