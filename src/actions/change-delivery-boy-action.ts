'use server';

import mongoose from 'mongoose';
import { withDbConnectAndActionAuth } from '@/lib/with-db-connect-and-auth';

export async function changeDeliveryBoyAction(staff: string, zone: number) {
  try {
    // Authorize the user
    const { mongooseConn } = await withDbConnectAndActionAuth();

    await mongooseConn.connection.db
      .collection('user')
      .updateOne(
        { _id: mongoose.Types.ObjectId.createFromHexString(staff) },
        { $set: { zone } }
      );

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unknown error occurred' };
  }
}
