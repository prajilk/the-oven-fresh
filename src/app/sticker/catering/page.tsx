import { endOfDay, isValid, startOfDay } from 'date-fns';
import connectDB from '@/config/mongoose';
import CateringMenu from '@/models/cateringMenuModel';
import Catering from '@/models/cateringModel';
import type { CateringDocumentPopulate } from '@/models/types/catering';
import CateringSheet from './pdf-sticker-generator';

const CateringStickerPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const from = (await searchParams)?.from as string;
  const to = (await searchParams)?.to as string;

  // Parse dates and check validity
  const fromDate = isValid(new Date(from))
    ? new Date(from)
    : startOfDay(new Date());
  const toDate = isValid(new Date(to)) ? new Date(to) : endOfDay(new Date());

  await connectDB();
  const orders = (await Catering.find({
    deliveryDateLocal: {
      $gte: fromDate,
      $lte: toDate,
    },
  }).populate({
    path: 'items.itemId',
    model: CateringMenu,
    select: 'name',
  })) as CateringDocumentPopulate[];

  return (
    <CateringSheet
      orders={orders.map((order) => ({
        id: order.orderId,
        deliveryDate: order.deliveryDate,
        order_type: order.order_type,
        customerName: order.customerName,
        phone: order.customerPhone,
        note: order.note,
        items: order.items
          .map((item) => ({
            name: item.itemId.name,
            quantity: item.quantity,
            priceAtOrder: item.priceAtOrder,
            size: item.size,
          }))
          .concat(
            order.customItems.map((item) => ({
              name: item.name,
              quantity: 1,
              priceAtOrder: item.priceAtOrder,
              size: item.size,
            }))
          ),
      }))}
    />
  );
};

export default CateringStickerPage;
