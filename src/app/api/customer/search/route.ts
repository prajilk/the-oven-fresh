import { error400, error403, error500, success200 } from '@/lib/response';
import type { AuthenticatedRequest } from '@/lib/types/auth-request';
import { isRestricted } from '@/lib/utils';
import { withDbConnectAndAuth } from '@/lib/with-db-connect-and-auth';
import Customer from '@/models/customerModel';

async function getHandler(req: AuthenticatedRequest) {
  if (isRestricted(req.user, ['admin', 'manager'])) {
    return error403();
  }

  const search = req.nextUrl.searchParams.get('phone');

  if (!search || search === '') {
    return error400('Invalid Search keyword', { result: null });
  }

  try {
    const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special chars

    const searchResult = await Customer.aggregate([
      { $match: { phone: { $regex: `^${safeSearch}`, $options: 'i' } } },
      {
        $lookup: {
          from: 'addresses', // Address collection name (must match DB)
          localField: '_id',
          foreignField: 'customerId',
          as: 'addresses',
        },
      },
      {
        $unwind: '$addresses',
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          phone: 1,
          address: '$addresses',
        },
      },
    ]);

    return success200({
      result: searchResult,
    });
  } catch (error) {
    return error500({
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
}

export const GET = withDbConnectAndAuth(getHandler);
