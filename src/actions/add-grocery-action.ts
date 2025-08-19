'use server';

import { revalidatePath } from 'next/cache';
import { withDbConnectAndActionAuth } from '@/lib/with-db-connect-and-auth';
import { ZodGrocerySchema } from '@/lib/zod-schema/schema';
import Grocery from '@/models/groceryModel';

export async function addGroceryAction(formData: FormData) {
  try {
    // Authorize the user
    const { user } = await withDbConnectAndActionAuth();

    const storeId = user?.storeId;
    if (!storeId) {
      return { error: 'Store not found.' };
    }

    const result = ZodGrocerySchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!result.success) {
      return { error: 'Invalid data format.' };
    }

    const box = formData.get('box') === 'true';

    await Grocery.create({
      store: storeId,
      item: result.data.item,
      quantity: box ? null : result.data.quantity,
      unit: box ? 'Box' : result.data.unit,
      price: result.data.price,
      tax: result.data.tax,
      total: result.data.total,
      purchasedFrom: result.data.purchasedFrom,
      date: result.data.date,
    });

    revalidatePath('/dashboard/groceries');

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unknown error occurred' };
  }
}
