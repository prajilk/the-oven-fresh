import { endOfDay, isValid, startOfDay } from 'date-fns';
import connectDB from '@/config/mongoose';
import Address from '@/models/addressModel';
import Store from '@/models/storeModel';
import Tiffin from '@/models/tiffinModel';
import type { TiffinDocumentPopulate } from '@/models/types/tiffin';
import OrdersPDFViewer from './order-pdf-generator';

const TiffinSummaryPage = async ({
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
  const orders = (await Tiffin.find({
    createdAt: {
      $gte: fromDate,
      $lte: toDate.setDate(toDate.getDate() + 1),
    },
  })
    .populate({ path: 'store', model: Store, select: 'location' })
    .populate({ path: 'address', model: Address, select: 'address' })) as
    | TiffinDocumentPopulate[]
    | [];

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
          startDate: order.startDate,
          endDate: order.endDate,
          note: order.note,
          totalPrice: order.totalPrice,
          tax: order.tax,
          advancePaid: order.advancePaid,
          pendingBalance: order.pendingBalance,
          paymentMethod: order.paymentMethod,
          status: order.status,
          numberOfWeeks: order.numberOfWeeks,
          type: order.order_type,
        };
      })}
    />
  );
};

export default TiffinSummaryPage;
