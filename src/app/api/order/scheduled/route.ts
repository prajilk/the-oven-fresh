import { error400, error403, error500, success200 } from '@/lib/response';
import type { AuthenticatedRequest } from '@/lib/types/auth-request';
import { isRestricted } from '@/lib/utils';
import { withDbConnectAndAuth } from '@/lib/with-db-connect-and-auth';
import { getScheduledCateringOrders, getScheduledTiffinOrders } from './helper';

async function getHandler(req: AuthenticatedRequest) {
  try {
    if (isRestricted(req.user, ['admin', 'manager'])) {
      return error403();
    }

    const storeId = req.nextUrl.searchParams.get('storeId');
    const date = req.nextUrl.searchParams.get('date') || new Date();

    if (!storeId) {
      return error400('Store id is required!');
    }

    const tiffin = await getScheduledTiffinOrders(date);
    const catering = await getScheduledCateringOrders(date, storeId);

    const cateringData = catering.map((item) => ({
      _id: item._id.toString(),
      store: item.store._id,
      address: item.address?.address,
      customerName: item.customerName,
      customerPhone: item.customerPhone,
      order: 'catering',
      orderId: item.orderId,
      order_type: item.order_type,
      status: item.status,
    }));

    const tiffinData = tiffin
      .filter(
        (item) => item.store.toString() === storeId && item.orderId !== null
      )
      .map((item) => ({
        _id: item.orderId._id.toString(),
        store: item.orderId.store._id,
        address: item.orderId.address.address,
        customerName: item.orderId.customerName,
        customerPhone: item.orderId.customerPhone,
        order: 'tiffin',
        orderId: item.orderId.orderId,
        order_type: item.orderId.order_type,
        status: item.status,
      }));

    return success200({ orders: cateringData.concat(tiffinData) });
  } catch (error) {
    if (error instanceof Error) {
      return error500({ error: error.message });
    }
    return error500({ error: 'An unknown error occurred' });
  }
}

export const GET = withDbConnectAndAuth(getHandler);
