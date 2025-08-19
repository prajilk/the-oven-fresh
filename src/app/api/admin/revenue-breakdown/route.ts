import { format } from 'date-fns';
import { error403, error404, error500, success200 } from '@/lib/response';
import type { AuthenticatedRequest } from '@/lib/types/auth-request';
import { getMonthInNumber, isRestricted } from '@/lib/utils';
import { withDbConnectAndAuth } from '@/lib/with-db-connect-and-auth';
import Store from '@/models/storeModel';
import { formatRevenueBreakdown } from './helper';

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

    const stores = await Store.find({}, 'location _id');
    if (!stores) {
      return error404('No stores found!');
    }

    const revenueData = await formatRevenueBreakdown(
      stores,
      monthNumber,
      Number(year)
    );

    return success200({ result: revenueData });
  } catch (error) {
    if (error instanceof Error) {
      return error500({ error: error.message });
    }
    return error500({ error: 'An unknown error occurred.' });
  }
}

export const GET = withDbConnectAndAuth(getHandler);
