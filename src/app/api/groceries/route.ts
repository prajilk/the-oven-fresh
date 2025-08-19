import { format } from 'date-fns';
import { error403, success200 } from '@/lib/response';
import type { AuthenticatedRequest } from '@/lib/types/auth-request';
import { isRestricted } from '@/lib/utils';
import { withDbConnectAndAuth } from '@/lib/with-db-connect-and-auth';
import Grocery from '@/models/groceryModel';

async function getHandler(req: AuthenticatedRequest) {
  try {
    if (isRestricted(req.user, ['admin', 'manager'])) {
      return error403();
    }
    const storeId = req.user?.storeId.toString();
    if (!storeId) {
      return error403();
    }

    const date = req.nextUrl.searchParams.get('date');
    const filter = date
      ? { store: storeId, date: format(new Date(date), 'yyyy-MM-dd') }
      : { store: storeId };

    const groceries = await Grocery.find(filter).sort({ date: -1 });

    return success200({ groceries });
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unknown error occurred';
  }
}

export const GET = withDbConnectAndAuth(getHandler);
