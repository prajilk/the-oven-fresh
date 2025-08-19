'use server';

import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { capitalizeName } from '@/lib/utils';
import { withDbConnectAndActionAuth } from '@/lib/with-db-connect-and-auth';
import { ZodUserSchemaWithPassword } from '@/lib/zod-schema/schema';

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <Ignore>
export async function editStaffAction(formData: FormData) {
  try {
    const { mongooseConn } = await withDbConnectAndActionAuth();

    const result = ZodUserSchemaWithPassword.safeParse(
      Object.fromEntries(formData.entries())
    );
    if (!result.success) {
      return { error: 'Invalid data format.' };
    }

    const userId = new ObjectId(formData.get('id') as string);

    // ✅ Get current user
    const user = await mongooseConn.connection.db.collection('user').findOne({
      _id: userId,
    });

    if (!user) {
      return { error: 'User not found.' };
    }

    // ✅ Check username uniqueness
    if (user.username !== result.data.username.toLowerCase()) {
      const existingUser = await mongooseConn.connection.db
        .collection('user')
        .findOne({
          username: result.data.username.toLowerCase(),
          _id: { $ne: userId },
        });

      if (existingUser) {
        return { error: 'Username already exists!' };
      }
    }

    // ✅ If changing to delivery role, enforce max 2 per store
    if (result.data.role === 'delivery') {
      const deliveryUsersCount = await mongooseConn.connection.db
        .collection('user')
        .countDocuments({
          storeId: result.data.store,
          role: 'delivery',
          _id: { $ne: userId }, // exclude current user
        });

      if (deliveryUsersCount >= 2) {
        return { error: 'Delivery staff limit reached!' };
      }
    }

    const error: string[] = [];

    if (
      user.username !== result.data.username.toLowerCase() ||
      user.storeId.toString() !== result.data.store ||
      user.role !== result.data.role ||
      user.displayUsername !== result.data.displayUsername
    ) {
      // ✅ Use Better Auth API instead of raw DB update
      const updateUser = await auth.api.adminUpdateUser({
        body: {
          userId: formData.get('id') as string,
          data: {
            username: result.data.username.toLowerCase(),
            name: capitalizeName(result.data.displayUsername),
            displayUsername: capitalizeName(result.data.displayUsername),
            storeId: mongoose.Types.ObjectId.createFromHexString(
              result.data.store
            ),
            role: result.data.role,
          },
        },
        // This endpoint requires session cookies.
        headers: await headers(),
      });
      if (!updateUser) {
        error.push('Failed to update user');
      }
    }

    // 🔑 Update password if changed
    if (result.data.password?.trim()) {
      const updatePassword = await auth.api.setUserPassword({
        body: {
          userId: formData.get('id') as string,
          newPassword: result.data.password,
        },
        // This endpoint requires session cookies.
        headers: await headers(),
      });
      if (!updatePassword.status) {
        error.push('Failed to update password');
      }
    }

    revalidatePath('/dashboard/staffs');

    await auth.api.revokeUserSessions({
      body: {
        userId,
      },
      // This endpoint requires session cookies.
      headers: await headers(),
    });

    if (error.length >= 1) {
      return { error: error.join(', ') };
    }
    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
