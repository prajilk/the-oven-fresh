import { autocomplete } from '@/lib/google';
import { error400, error403, error500, success200 } from '@/lib/response';
import type { AuthenticatedRequest } from '@/lib/types/auth-request';
import { isRestricted } from '@/lib/utils';
import { withDbConnectAndAuth } from '@/lib/with-db-connect-and-auth';

async function getHandler(req: AuthenticatedRequest) {
  if (isRestricted(req.user, ['admin', 'manager'])) {
    return error403();
  }

  const search = req.nextUrl.searchParams.get('address');

  if (!search || search === '') {
    return error400('Invalid Address keyword', { result: null });
  }

  try {
    const searchResult = await autocomplete(search);
    if (!searchResult) {
      return error500({ error: 'Google API Error' });
    }

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
