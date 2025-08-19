import mongoose from 'mongoose';
import { error400, error403, error500, success200 } from '@/lib/response';
import type { AuthenticatedRequest } from '@/lib/types/auth-request';
import { isRestricted } from '@/lib/utils';
import { withDbConnectAndAuth } from '@/lib/with-db-connect-and-auth';
import Setting from '@/models/settingsModel';

async function getHandler(req: AuthenticatedRequest) {
  try {
    if (isRestricted(req.user)) {
      return error403();
    }
    const store = req.nextUrl.searchParams.get('store');
    if (!store) {
      return error400('Store Id not found.');
    }

    const settings = await Setting.findOne({
      store: mongoose.Types.ObjectId.createFromHexString(store),
    });

    return success200({ settings });
  } catch (error) {
    if (error instanceof Error) {
      return error500({ error: error.message });
    }
    return error500({ error: 'An unknown error occurred' });
  }
}

async function patchHandler(req: AuthenticatedRequest) {
  try {
    if (isRestricted(req.user)) {
      return error403();
    }

    const data = await req.json();
    if (!data) {
      return error400('Invalid data format.', {});
    }
    if (!req.user?.storeId) {
      return error403('Store Id not found.');
    }

    await Setting.updateOne(
      {
        store: req.user.storeId,
      },
      {
        $set: {
          disable_sending_proof: data.disable_sending_proof,
        },
      },
      { upsert: true }
    );

    return success200({});
  } catch (error) {
    if (error instanceof Error) {
      return error500({ error: error.message });
    }
    return error500({ error: 'An unknown error occurred' });
  }
}

export const GET = withDbConnectAndAuth(getHandler);
export const PATCH = withDbConnectAndAuth(patchHandler);
