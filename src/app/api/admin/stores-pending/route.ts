import { format } from 'date-fns';
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

    const year =
      req.nextUrl.searchParams.get('year') || format(new Date(), 'yyyy');

    const startOfYear = new Date(Number(year), 0, 1);
    const endOfYear = new Date(Number(year) + 1, 0, 0);

    const stores = await Store.find({}, '_id location');

    const queryPromise = stores.map(async (store) => {
      const tiffinTotal = await Tiffin.find(
        {
          store: store._id,
          createdAt: { $gte: startOfYear, $lte: endOfYear },
        },
        'pendingBalance'
      );
      const cateringTotal = await Catering.find(
        {
          store: store._id,
          createdAt: { $gte: startOfYear, $lte: endOfYear },
        },
        'pendingBalance'
      );

      const tiffinSum = tiffinTotal.reduce(
        (sum, tiffin) => sum + tiffin.pendingBalance,
        0
      );
      const cateringSum = cateringTotal.reduce(
        (sum, catering) => sum + catering.pendingBalance,
        0
      );

      return {
        location: store.location,
        data: {
          total: (tiffinSum + cateringSum).toFixed(2),
          tiffin: tiffinSum.toFixed(2),
          catering: cateringSum.toFixed(2),
        },
      };
    });

    // Ensure all promises in queryPromise are resolved
    const result = await Promise.all(queryPromise);

    return success200({ result });
  } catch (error) {
    if (error instanceof Error) {
      return error500({ error: error.message });
    }
    return error500({ error: 'An unknown error occurred' });
  }
}

export const GET = withDbConnectAndAuth(getHandler);
