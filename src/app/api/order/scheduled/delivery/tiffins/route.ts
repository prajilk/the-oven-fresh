import { format } from 'date-fns';
import { error403, error500, success200 } from '@/lib/response';
import type { AuthenticatedRequest } from '@/lib/types/auth-request';
import type {
  CateringInputProps,
  TiffinInputProps,
} from '@/lib/types/delivery';
import { findOptimalRoute, isRestricted } from '@/lib/utils';
import { withDbConnectAndAuth } from '@/lib/with-db-connect-and-auth';
import Store from '@/models/storeModel';
import { formatTiffin, getTiffins, groupByZone } from '../helper';

async function getHandler(req: AuthenticatedRequest) {
  try {
    if (isRestricted(req.user, ['admin', 'manager', 'delivery'])) {
      return error403();
    }

    const storeId = req.user?.storeId.toString();

    if (!storeId) {
      return error403();
    }

    const store = await Store.findById(storeId);
    if (!store) {
      return error500({ error: 'Store not found.' });
    }

    const user = req.user;

    const date = format(new Date(), 'yyyy-MM-dd');

    const tiffins = await getTiffins(storeId, date);

    const tiffinDelivery = tiffins.filter(
      (o) => o.orderId.order_type === 'delivery'
    );

    const tiffinInput = tiffinDelivery.map((order) => ({
      ...order._doc,
      id: order._id,
      lat: order.orderId.address.lat,
      lng: order.orderId.address.lng,
    })) as TiffinInputProps[];

    const storeCoords = { lat: store.lat, lng: store.lng };

    const { zone1: tiffinUp, zone2: tiffinDown } = groupByZone(
      tiffinInput,
      (o) => ({ lat: o.lat, lng: o.lng }),
      store.dividerLine
    );

    let sortedT: (TiffinInputProps | CateringInputProps)[] = [];

    if (user?.zone === 1) {
      sortedT = findOptimalRoute(storeCoords, tiffinUp);
    } else if (user?.zone === 2) {
      sortedT = findOptimalRoute(storeCoords, tiffinDown);
    }

    return success200({
      data: {
        // @ts-expect-error: Type 'any' is not assignable to type 'TiffinInputProps'.
        orders: sortedT.map(formatTiffin),
        stats: {
          total: sortedT.length,
          delivered: sortedT.filter((o) => o.status === 'DELIVERED').length,
          pending: sortedT.filter((o) => o.status === 'PENDING').length,
        },
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return error500({ error: message });
  }
}

export const GET = withDbConnectAndAuth(getHandler);
