'use server';

import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { capitalizeName } from '@/lib/utils';
import { withDbConnectAndActionAuth } from '@/lib/with-db-connect-and-auth';
import { ZodUserSchemaWithPassword } from '@/lib/zod-schema/schema';

export async function addStaffAction(formData: FormData) {
  try {
    // Authorize the user
    const { mongooseConn } = await withDbConnectAndActionAuth();

    const result = ZodUserSchemaWithPassword.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (
      !result.success ||
      result.data.password === undefined ||
      result.data.password?.trim() === ''
    ) {
      return { error: 'Invalid data format.' };
    }

    const existingUser = await mongooseConn.connection.db
      .collection('user')
      .findOne({
        username: result.data.username.toLowerCase(),
      });

    if (existingUser) {
      return { error: 'Username already exists!' };
    }

    let zone: undefined | number;

    if (result.data.role === 'delivery') {
      const deliveryStaffs = await mongooseConn.connection.db
        .collection('user')
        .find({
          storeId: mongoose.Types.ObjectId.createFromHexString(
            result.data.store
          ),
          role: 'delivery',
          zone: { $in: [1, 2] },
        })
        .toArray();

      if (deliveryStaffs.length >= 2) {
        return {
          error: 'Delivery staff limit reached for this store!',
        };
      }
      zone = 1;
      if (deliveryStaffs.length === 1) {
        zone = deliveryStaffs[0].zone === 1 ? 2 : 1;
      }
    }

    await auth.api.createUser({
      body: {
        email: `${result.data.username}@gmail.com`,
        name: capitalizeName(result.data.displayUsername),
        password: result.data.password,
        data: {
          username: result.data.username,
          displayUsername: capitalizeName(result.data.displayUsername),
          role: result.data.role,
          storeId: result.data.store,
          zone,
        },
      },
      headers: await headers(),
    });

    revalidatePath('/dashboard/staffs');

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unknown error occurred' };
  }
}
