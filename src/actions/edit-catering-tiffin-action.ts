'use server';

import { revalidatePath } from 'next/cache';
import { withDbConnectAndActionAuth } from '@/lib/with-db-connect-and-auth';
import TiffinMenu from '@/models/tiffinMenuModel';

export async function editTiffinMenuAction({
  pickupMenu,
  deliveryMenu,
}: {
  pickupMenu: { [k: string]: number };
  deliveryMenu: { [k: string]: number };
}) {
  try {
    // Authorize the user
    await withDbConnectAndActionAuth();

    await TiffinMenu.updateOne(
      {},
      {
        $set: {
          pickup: pickupMenu,
          delivery: deliveryMenu,
        },
      }
    );

    revalidatePath('/dashboard/menus');

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unknown error occurred' };
  }
}
