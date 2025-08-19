'use server';

import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';
import { withDbConnectAndActionAuth } from '@/lib/with-db-connect-and-auth';
import Catering from '@/models/cateringModel';
import Store from '@/models/storeModel';
import TiffinMenu from '@/models/tiffinMenuModel';
import Tiffin from '@/models/tiffinModel';

export async function deleteStoreAction(id: string) {
  try {
    // Authorize the user
    const { mongooseConn } = await withDbConnectAndActionAuth();

    const userExistWithStore = await mongooseConn.connection.db
      .collection('user')
      .findOne({
        storeId: mongoose.Types.ObjectId.createFromHexString(id),
      });

    if (userExistWithStore) {
      return {
        error:
          'Cannot delete this store. There are users associated with this store.',
      };
    }

    const [cateringOrderExistWithStore, tiffinOrderExistWithStore] =
      await Promise.all([
        Catering.findOne({
          store: id,
        }),
        Tiffin.findOne({
          store: id,
        }),
      ]);

    if (tiffinOrderExistWithStore || cateringOrderExistWithStore) {
      return {
        error:
          'Cannot delete this store. There is orders associated with this store.',
      };
    }

    const [tiffinMenuExistWithStore] = await Promise.all([
      TiffinMenu.findOne({ store: id }),
      // CateringMenu.findOne({store: id})
    ]);

    if (tiffinMenuExistWithStore) {
      return {
        error:
          'Cannot delete this store. There are menus associated with this store.',
      };
    }

    const deletedStore = await Store.deleteOne({ _id: id });

    if (!deletedStore.acknowledged) {
      return { error: 'Failed to delete store' };
    }

    revalidatePath('/dashboard/stores');

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unknown error occurred' };
  }
}
