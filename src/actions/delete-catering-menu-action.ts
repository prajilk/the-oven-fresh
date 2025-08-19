'use server';

import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';
import { deleteFile } from '@/config/cloudinary.config';
import { withDbConnectAndActionAuth } from '@/lib/with-db-connect-and-auth';
import CateringMenu from '@/models/cateringMenuModel';
import Catering from '@/models/cateringModel';

export async function deleteCateringMenuAction(id: string) {
  try {
    // Authorize the user
    await withDbConnectAndActionAuth();

    const objectId = mongoose.Types.ObjectId.createFromHexString(id);
    const isMenuInUse = await Catering.findOne({
      items: { $elemMatch: { itemId: objectId } },
    });
    if (isMenuInUse) {
      return {
        error: 'Unable to delete the menu item. It is currently in use.',
      };
    }
    const deletedMenu = await CateringMenu.findByIdAndDelete({ _id: id });

    if (!deletedMenu) {
      return { error: 'Failed to delete menu item.' };
    }

    const publicId = deletedMenu.publicId;
    if (publicId) {
      await deleteFile(publicId);
    }

    revalidatePath('/dashboard/menus');

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unknown error occurred' };
  }
}
