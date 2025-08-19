'use server';

import { revalidatePath } from 'next/cache';
import { withDbConnectAndActionAuth } from '@/lib/with-db-connect-and-auth';
import { ZodStoreSchema } from '@/lib/zod-schema/schema';
import Store from '@/models/storeModel';
import type { StoreDocument } from '@/models/types/store';

export async function editStoreAction(formData: FormData) {
  try {
    // Authorize the user
    await withDbConnectAndActionAuth();

    const result = ZodStoreSchema.safeParse({
      ...Object.fromEntries(formData.entries()),
      lat: Number(formData.get('lat') as string),
      lng: Number(formData.get('lng') as string),
      dividerLine: JSON.parse(formData.get('dividerLine') as string),
    });

    if (!result.success) {
      return { error: 'Invalid data format.' };
    }

    const storeId = formData.get('id');

    const existingStore = await Store.findById(storeId);
    if (!existingStore) {
      return { error: 'Store not found.' };
    }

    const updateData: Partial<StoreDocument> = result.data;

    await Store.findByIdAndUpdate(storeId, {
      $set: updateData,
    });

    revalidatePath('/dashboard/stores');

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unknown error occurred' };
  }
}
