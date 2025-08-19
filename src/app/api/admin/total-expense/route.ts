import { format } from 'date-fns';
import { error403, error500, success200 } from '@/lib/response';
import type { AuthenticatedRequest } from '@/lib/types/auth-request';
import { isRestricted } from '@/lib/utils';
import { withDbConnectAndAuth } from '@/lib/with-db-connect-and-auth';
import Grocery from '@/models/groceryModel';
import Store from '@/models/storeModel';

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
      const total = await Grocery.find(
        {
          store: store._id,
          date: { $gte: startOfYear, $lte: endOfYear },
        },
        'total'
      );

      const sum = total.reduce((sum, grocery) => sum + grocery.total, 0);

      return {
        location: store.location,
        total: sum,
        items: total.length,
      };
    });

    // Ensure all promises in queryPromise are resolved
    const storesData = await Promise.all(queryPromise);

    const total = storesData.reduce((sum, store) => sum + store.total, 0);
    const items = storesData.reduce((sum, store) => sum + store.items, 0);

    return success200({
      result: {
        total,
        items,
        stores: storesData,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return error500({ error: error.message });
    }
    return error500({ error: 'An unknown error occurred' });
  }
}

export const GET = withDbConnectAndAuth(getHandler);
