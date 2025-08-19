import { deleteFile, extractPublicId } from '@/config/cloudinary.config';
import {
  error400,
  error403,
  error404,
  error409,
  error500,
  success200,
} from '@/lib/response';
import type { AuthenticatedRequest } from '@/lib/types/auth-request';
import { isRestricted } from '@/lib/utils';
import { withDbConnectAndAuth } from '@/lib/with-db-connect-and-auth';
import { ZodCateringMenuSchema } from '@/lib/zod-schema/schema';
import CateringMenu from '@/models/cateringMenuModel';
import Catering from '@/models/cateringModel';

async function deleteHandler(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ menuId: string }> }
) {
  try {
    if (isRestricted(req.user, ['admin', 'manager'])) {
      return error403();
    }

    const { menuId } = await params;

    // Check if any order contains the menu item
    const ordersWithMenuItem = await Catering.findOne({
      'items.itemId': menuId, // Look for orders that reference this menu item
    });

    if (ordersWithMenuItem) {
      return error409(
        'Cannot delete this menu item because it is part of existing orders.'
      );
    }

    const menu = await CateringMenu.findByIdAndDelete(menuId);

    if (!menu) {
      return error404('Menu not found.');
    }

    if (menu.publicId) {
      const deleted = await deleteFile(menu.publicId);
      if (!deleted) {
        return success200({
          message: 'Menu deleted successfully. Failed to delete menu image!',
        });
      }
    }

    return success200({ message: 'Menu deleted successfully.' });
  } catch (error) {
    if (error instanceof Error) {
      return error500({ error: error.message });
    }
    return error500({ error: 'An unknown error occurred' });
  }
}

async function putHandler(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ menuId: string }> }
) {
  try {
    if (isRestricted(req.user, ['admin', 'manager'])) {
      return error403();
    }

    const data = await req.json();

    if (!data) {
      return error400('Invalid data format.', {});
    }

    const { menuId } = await params;

    const result = ZodCateringMenuSchema.safeParse(data);

    if (result.success) {
      const existingMenu = await CateringMenu.findOne({
        _id: menuId,
      });

      if (!existingMenu) {
        return error400('Menu not found.');
      }

      if (result.data.image) {
        const publicId = extractPublicId(result.data.image);
        if (existingMenu.publicId !== publicId) {
          await deleteFile(existingMenu.publicId);
          // @ts-expect-error: publicId might not exist in result.data, but we are assigning it anyway
          result.data.publicId = publicId;
        }
      }

      const menu = await CateringMenu.findByIdAndUpdate(menuId, result.data, {
        new: true,
      });
      return success200({ menu });
    }

    if (!result.error) {
      return error400('Invalid data format.', {});
    }
  } catch (error) {
    if (error instanceof Error) {
      return error500({ error: error.message });
    }
    return error500({ error: 'An unknown error occurred' });
  }
}

export const DELETE = withDbConnectAndAuth(deleteHandler);
export const PUT = withDbConnectAndAuth(putHandler);
