import { error400, error403, error500, success200 } from '@/lib/response';
import type { AuthenticatedRequest } from '@/lib/types/auth-request';
import { isRestricted } from '@/lib/utils';
import { withDbConnectAndAuth } from '@/lib/with-db-connect-and-auth';
import Catering from '@/models/cateringModel';
import Tiffin from '@/models/tiffinModel';
import { fetchOrderStats } from './helper';

async function getHandler(req: AuthenticatedRequest) {
  try {
    if (isRestricted(req.user, ['admin', 'manager'])) {
      return error403();
    }

    const modelType = req.nextUrl.searchParams.get('model');
    if (!modelType) {
      return error400('Model type is required!');
    }

    const storeId = req.user?.storeId.toString();

    if (!storeId) {
      return error403();
    }

    const model = modelType === 'tiffin' ? Tiffin : Catering;

    const orderStat = await fetchOrderStats(model, storeId);

    return success200({
      result: {
        data: orderStat.last30DaysCounts,
        trend: orderStat.trend,
        percentage:
          orderStat.trend === 'up'
            ? `+${orderStat.percentageChange}%`
            : `${
                Number(orderStat.percentageChange || 0) > 0 ? '-' : ''
              }${orderStat.percentageChange}%`,
        title: `${modelType} Orders`,
        value: orderStat.totalLast30Days.toString(),
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
