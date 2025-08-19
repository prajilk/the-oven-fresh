import { error403, error500, success200 } from '@/lib/response';
import type { AuthenticatedRequest } from '@/lib/types/auth-request';
import { isRestricted } from '@/lib/utils';
import { withDbConnectAndAuth } from '@/lib/with-db-connect-and-auth';
import Store from '@/models/storeModel';

async function getHandler(req: AuthenticatedRequest) {
  try {
    if (isRestricted(req.user)) {
      return error403();
    }

    const stores = await Store.find({});

    return success200({ stores });
  } catch (error) {
    if (error instanceof Error) {
      return error500({ error: error.message });
    }
    return error500({ error: 'An unknown error occurred' });
  }
}

export const GET = withDbConnectAndAuth(getHandler);
