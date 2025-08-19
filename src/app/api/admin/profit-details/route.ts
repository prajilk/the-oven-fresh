import { format } from 'date-fns';
import { error403, error500, success200 } from '@/lib/response';
import type { AuthenticatedRequest } from '@/lib/types/auth-request';
import { getMonthInNumber, isRestricted } from '@/lib/utils';
import { withDbConnectAndAuth } from '@/lib/with-db-connect-and-auth';
import Catering from '@/models/cateringModel';
import Grocery from '@/models/groceryModel';
import Store from '@/models/storeModel';
import { calculateTiffinTotal } from './helper';

async function getHandler(req: AuthenticatedRequest) {
  try {
    if (isRestricted(req.user, ['admin'])) {
      return error403();
    }
    const month =
      req.nextUrl.searchParams.get('month') ||
      format(new Date(), 'MMM').toLowerCase();
    const year =
      req.nextUrl.searchParams.get('year') || format(new Date(), 'yyyy');

    const monthNumber = getMonthInNumber(month);

    const stores = await Store.find({}, '_id location');

    const queryPromise = stores.map(async (store) => {
      const [tiffinTotal, cateringTotal, expense] = await Promise.all([
        calculateTiffinTotal(Number(year), monthNumber, store),
        Catering.aggregate([
          {
            $project: {
              totalPrice: 1,
              store: 1,
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' },
            },
          },
          {
            $match: {
              month: monthNumber,
              store: store._id,
              year: Number(year),
            },
          },
        ]),
        Grocery.aggregate([
          {
            $project: {
              total: 1,
              store: 1,
              month: { $month: '$date' },
              year: { $year: '$date' },
            },
          },
          {
            $match: {
              month: monthNumber,
              store: store._id,
              year: Number(year),
            },
          },
        ]),
      ]);

      const cateringSum = cateringTotal.reduce(
        (sum, catering) => sum + catering.totalPrice,
        0
      );
      const grocerySum = expense.reduce(
        (sum, grocery) => sum + grocery.total,
        0
      );

      return {
        store: store.location,
        totalRevenue: tiffinTotal + cateringSum,
        totalExpense: grocerySum,
        totalProfit: tiffinTotal + cateringSum - grocerySum,
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
