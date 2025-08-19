'use server';

import { revalidatePath } from 'next/cache';
import type { CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import type { z } from 'zod';
import { withDbConnectAndActionAuth } from '@/lib/with-db-connect-and-auth';
import { ZodCateringMenuSchema } from '@/lib/zod-schema/schema';
import CateringMenu from '@/models/cateringMenuModel';

export async function addCateringMenuAction(
  values: z.infer<typeof ZodCateringMenuSchema>,
  resource?: string | CloudinaryUploadWidgetInfo
) {
  try {
    // Authorize the user
    await withDbConnectAndActionAuth();

    const result = ZodCateringMenuSchema.safeParse(values);
    const image = resource
      ? (resource as CloudinaryUploadWidgetInfo).secure_url
      : process.env.NEXT_PUBLIC_PLACEHOLDER_IMAGE;
    const publicId = resource
      ? (resource as CloudinaryUploadWidgetInfo).public_id
      : null;

    if (!result.success) {
      return { error: 'Invalid data format.' };
    }

    await CateringMenu.create({
      ...result.data,
      image,
      publicId,
    });

    revalidatePath('/dashboard/menus');

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unknown error occurred' };
  }
}
