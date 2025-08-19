import { format } from 'date-fns';
import { error403, error500, success200 } from '@/lib/response';
import type { AuthenticatedRequest } from '@/lib/types/auth-request';
import { getMonthInNumber, isRestricted } from '@/lib/utils';
import { withDbConnectAndAuth } from '@/lib/with-db-connect-and-auth';
import Grocery from '@/models/groceryModel';

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

    const groceries = await Grocery.aggregate([
      {
        $lookup: {
          from: 'stores',
          localField: 'store',
          foreignField: '_id',
          as: 'store',
        },
      },
      {
        $project: {
          _id: 1,
          store: '$store.location',
          item: 1,
          quantity: 1,
          price: 1,
          tax: 1,
          total: 1,
          unit: 1,
          date: 1,
          purchasedFrom: 1,
          month: { $month: '$date' },
          year: { $year: '$date' },
        },
      },
      { $match: { month: monthNumber, year: Number(year) } },
    ]);

    const result = groceries.map((grocery) => ({
      _id: grocery._id,
      store: grocery.store[0],
      item: grocery.item,
      quantity: grocery.quantity,
      purchasedFrom: grocery.purchasedFrom,
      price: grocery.price,
      tax: grocery.tax,
      total: grocery.total,
      unit: grocery.unit,
      date: grocery.date,
    }));

    return success200({ result });
  } catch (error) {
    if (error instanceof Error) {
      return error500({ error: error.message });
    }
    return error500({ error: 'An unknown error occurred' });
  }
}

export const GET = withDbConnectAndAuth(getHandler);
