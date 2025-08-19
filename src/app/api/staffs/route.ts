import mongoose from 'mongoose';
import { error403, error500, success200 } from '@/lib/response';
import type { AuthenticatedRequest } from '@/lib/types/auth-request';
import { isRestricted } from '@/lib/utils';
import { withDbConnectAndAuth } from '@/lib/with-db-connect-and-auth';

async function getHandler(req: AuthenticatedRequest) {
  try {
    if (isRestricted(req.user)) {
      return error403();
    }

    const users = await mongoose.connection.db
      ?.collection('user')
      .aggregate([
        {
          $match: {
            role: { $nin: ['admin'] },
          },
        },
        {
          $lookup: {
            from: 'stores', // collection to join
            localField: 'storeId', // field in `user` documents
            foreignField: '_id', // field in `stores` documents
            as: 'store', // output array field with matched stores
          },
        },
        {
          $unwind: '$store', // flatten the store array to a single object (optional)
        },
        {
          $project: {
            role: 1,
            username: 1,
            displayUsername: 1,
            zone: 1,
            'store.location': 1, // only include location and _id from store
            'store._id': 1,
          },
        },
      ])
      .toArray();

    return success200({ staffs: users });
  } catch (error) {
    if (error instanceof Error) {
      return error500({ error: error.message });
    }
    return error500({ error: 'An unknown error occurred' });
  }
}

export const GET = withDbConnectAndAuth(getHandler);
