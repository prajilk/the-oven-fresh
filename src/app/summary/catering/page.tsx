import { endOfDay, isValid, startOfDay } from 'date-fns';
import connectDB from '@/config/mongoose';
import Address from '@/models/addressModel';
import CateringMenu from '@/models/cateringMenuModel';
import Catering from '@/models/cateringModel';
import Store from '@/models/storeModel';
import type { CateringDocumentPopulate } from '@/models/types/catering';
import OrdersPDFViewer from './order-pdf-generator';

const CateringSummaryPage = async ({
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
    createdAt: {
      $gte: fromDate,
      $lte: toDate.setDate(toDate.getDate() + 1),
    },
  })
    .populate({ path: 'store', model: Store, select: 'location' })
    .populate({ path: 'address', model: Address, select: 'address' })
    .populate({
      path: 'items.itemId',
      model: CateringMenu,
      select: 'name',
    })) as CateringDocumentPopulate[] | [];

  return (
    <OrdersPDFViewer
      orders={orders.map((order) => {
        return {
          id: order.orderId,
          store: order.store.location,
          customer: order.customerName,
          phone: order.customerPhone,
          address: order.address.address,
          createdAt: order.createdAt,
          deliveryDate: order.deliveryDate,
          items: order.items.map((item) => {
            return {
              name: item.itemId.name,
              quantity: item.quantity,
              priceAtOrder: item.priceAtOrder,
            };
          }),
          note: order.note,
          totalPrice: order.totalPrice,
          tax: order.tax,
          advancePaid: order.advancePaid,
          pendingBalance: order.pendingBalance,
          paymentMethod: order.paymentMethod,
          status: order.status,
        };
      })}
    />
  );
};

export default CateringSummaryPage;
