import { format } from 'date-fns';
import { error403, error500, success200 } from '@/lib/response';
import type { AuthenticatedRequest } from '@/lib/types/auth-request';
import { isRestricted } from '@/lib/utils';
import { withDbConnectAndAuth } from '@/lib/with-db-connect-and-auth';
import Catering from '@/models/cateringModel';
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

    const [tiffins, caterings] = await Promise.all([
      Tiffin.find(
        {
          createdAt: { $gte: startOfYear, $lte: endOfYear },
        },
        'pendingBalance'
      ),
      Catering.find(
        {
          createdAt: { $gte: startOfYear, $lte: endOfYear },
        },
        'pendingBalance'
      ),
    ]);
    const tiffinTotal = tiffins.reduce(
      (sum, doc) => sum + doc.pendingBalance,
      0
    );
    const cateringTotal = caterings.reduce(
      (sum, doc) => sum + doc.pendingBalance,
      0
    );

    return success200({
      result: {
        total: (tiffinTotal + cateringTotal).toFixed(2),
        tiffin: tiffinTotal.toFixed(2),
        catering: cateringTotal.toFixed(2),
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
