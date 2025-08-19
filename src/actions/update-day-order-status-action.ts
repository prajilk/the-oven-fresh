'use server';

import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';
import type { DayStatus } from '@/lib/types/order-status';
import { withDbConnectAndActionAuth } from '@/lib/with-db-connect-and-auth';
import TiffinOrderStatus from '@/models/tiffinOrderStatusModel';

export async function updateDayOrderStatusAction(
  orderId: string,
  data: DayStatus[]
) {
  try {
    // Authorize the user
    await withDbConnectAndActionAuth();

    if (!orderId) {
      return { error: 'Invalid order ID.' };
    }

    const bulkOps = data.map(({ _id, status }) => ({
      updateOne: {
        filter: {
          _id: mongoose.Types.ObjectId.createFromHexString(_id),
        }, // Convert _id if necessary
        update: { $set: { status } },
      },
    }));

    await TiffinOrderStatus.bulkWrite(bulkOps);

    revalidatePath('/dashboard/orders');

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unknown error occurred' };
  }
}
