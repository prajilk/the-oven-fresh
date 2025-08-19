'use server';

import { revalidatePath } from 'next/cache';
import { withDbConnectAndActionAuth } from '@/lib/with-db-connect-and-auth';
import DeliveryImage from '@/models/deliveryImageModel';

export async function deleteProofAction(id: string) {
  try {
    // Authorize the user
    await withDbConnectAndActionAuth();

    const deletedStore = await DeliveryImage.deleteOne({ _id: id });

    if (!deletedStore.acknowledged) {
      return { error: 'Failed to delete proof' };
    }

    revalidatePath('/dashboard/delivery-proof');

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unknown error occurred' };
  }
}
