import { error403, error500, success200 } from '@/lib/response';
import type { AuthenticatedRequest } from '@/lib/types/auth-request';
import { isRestricted } from '@/lib/utils';
import { withDbConnectAndAuth } from '@/lib/with-db-connect-and-auth';
import Catering from '@/models/cateringModel';
import Store from '@/models/storeModel';
import Tiffin from '@/models/tiffinModel';

async function getHandler(req: AuthenticatedRequest) {
  try {
    if (isRestricted(req.user, ['admin'])) {
      return error403();
    }
    const [tiffins, caterings] = await Promise.all([
      Tiffin.find({ pendingBalance: { $gt: 0 } })
        .populate({
          path: 'store',
          model: Store,
          select: '_id location',
        })
        .select('_id orderId customerName pendingBalance endDate'),
      Catering.find({ pendingBalance: { $gt: 0 } })
        .populate({
          path: 'store',
          model: Store,
          select: '_id location',
        })
        .select('_id orderId customerName pendingBalance deliveryDate'),
    ]);

    const tiffinData = tiffins.map((item) => ({
      _id: item._id.toString(),
      store: item.store.location,
      customerName: item.customerName,
      order: 'tiffin',
      orderId: item.orderId,
      due: item.endDate,
      pendingBalance: item.pendingBalance,
    }));

    const cateringData = caterings.map((item) => ({
      _id: item._id.toString(),
      store: item.store.location,
      customerName: item.customerName,
      order: 'catering',
      orderId: item.orderId,
      due: item.deliveryDate,
      pendingBalance: item.pendingBalance,
    }));

    return success200({ result: cateringData.concat(tiffinData) });
  } catch (error) {
    if (error instanceof Error) {
      return error500({ error: error.message });
    }
    return error500({ error: 'An unknown error occurred' });
  }
}

export const GET = withDbConnectAndAuth(getHandler);
