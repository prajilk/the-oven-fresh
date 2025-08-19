import { format } from 'date-fns';
import { error400, error403, error500, success200 } from '@/lib/response';
import type { AuthenticatedRequest } from '@/lib/types/auth-request';
import type {
  CateringInputProps,
  TiffinInputProps,
} from '@/lib/types/delivery';
import { findOptimalRoute, isRestricted } from '@/lib/utils';
import { withDbConnectAndAuth } from '@/lib/with-db-connect-and-auth';
import Store from '@/models/storeModel';
import {
  formatCatering,
  formatTiffin,
  getCaterings,
  getTiffins,
  groupByZone,
} from './helper';

async function getHandler(req: AuthenticatedRequest) {
  try {
    if (isRestricted(req.user, ['admin', 'manager'])) {
      return error403();
    }

    const storeId = req.nextUrl.searchParams.get('storeId');
    if (!storeId) {
      return error400('Store id is required!');
    }

    const store = await Store.findById(storeId);
    if (!store) {
      return error500({ error: 'Store not found.' });
    }

    const date = format(new Date(), 'yyyy-MM-dd');

    const [tiffins, caterings] = await Promise.all([
      getTiffins(storeId, date),
      getCaterings(storeId, date),
    ]);

    const tiffinDelivery = tiffins.filter(
      (o) => o.orderId.order_type === 'delivery'
    );
    const cateringDelivery = caterings.filter(
      (o) => o.order_type === 'delivery'
    );

    const tiffinInput = tiffinDelivery.map((order) => ({
      ...order._doc,
      id: order._id,
      lat: order.orderId.address.lat,
      lng: order.orderId.address.lng,
    })) as TiffinInputProps[];

    const cateringInput = cateringDelivery.map((order) => ({
      ...order._doc,
      id: order._id,
      lat: order.address.lat,
      lng: order.address.lng,
    })) as CateringInputProps[];

    const storeCoords = { lat: store.lat, lng: store.lng };

    const { zone1: tiffinUp, zone2: tiffinDown } = groupByZone(
      tiffinInput,
      (o) => ({ lat: o.lat, lng: o.lng }),
      store.dividerLine
    );
    const { zone1: cateringUp, zone2: cateringDown } = groupByZone(
      cateringInput,
      (o) => ({ lat: o.lat, lng: o.lng }),
      store.dividerLine
    );

    const sortedT1 = findOptimalRoute(storeCoords, tiffinUp);
    const sortedT2 = findOptimalRoute(storeCoords, tiffinDown);
    const sortedC1 = findOptimalRoute(storeCoords, cateringUp);
    const sortedC2 = findOptimalRoute(storeCoords, cateringDown);

    return success200({
      tiffins: {
        // @ts-expect-error: Type 'any' is not assignable to type 'TiffinInputProps'.
        zone1: sortedT1.map(formatTiffin),
        // @ts-expect-error: Type 'any' is not assignable to type 'TiffinInputProps'.
        zone2: sortedT2.map(formatTiffin),
      },
      caterings: {
        // @ts-expect-error: Type 'any' is not assignable to type 'CateringInputProps'.
        zone1: sortedC1.map(formatCatering),
        // @ts-expect-error: Type 'any' is not assignable to type 'CateringInputProps'.
        zone2: sortedC2.map(formatCatering),
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return error500({ error: message });
  }
}

export const GET = withDbConnectAndAuth(getHandler);
