'use server';

import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';
import { withDbConnectAndActionAuth } from '@/lib/with-db-connect-and-auth';
import CateringCategory from '@/models/cateringCategoryModel';

export async function addCategoryAction(formData: FormData) {
  try {
    // Authorize the user
    await withDbConnectAndActionAuth();

    const { id, name } = Object.fromEntries(formData.entries());

    if (!name) {
      return { error: 'Invalid data format.' };
    }
    let _id = id as string;
    if (!_id) {
      _id = new mongoose.Types.ObjectId().toString();
    }

    await CateringCategory.findByIdAndUpdate(
      _id,
      { name: (name as string).charAt(0).toUpperCase() + name.slice(1) },
      { upsert: true }
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
