import { error403, error500, success200 } from '@/lib/response';
import type { AuthenticatedRequest } from '@/lib/types/auth-request';
import { isRestricted } from '@/lib/utils';
import { withDbConnectAndAuth } from '@/lib/with-db-connect-and-auth';
import DeliveryImage from '@/models/deliveryImageModel';

const LIMIT = 9;

async function getHandler(req: AuthenticatedRequest) {
  try {
    if (isRestricted(req.user, ['admin'])) {
      return error403();
    }

    const search = req.nextUrl.searchParams.get('search') || '';
    const page = Number.parseInt(
      req.nextUrl.searchParams.get('page') || '1',
      10
    );
    const skip = (page - 1) * LIMIT;

    const proofs = await DeliveryImage.aggregate([
      // Join Tiffin
      {
        $lookup: {
          from: 'tiffins', // collection name for Tiffin model
          localField: 'order',
          foreignField: '_id',
          as: 'orderData',
        },
      },
      { $unwind: '$orderData' },

      // Search by orderId
      {
        $match: {
          'orderData.orderId': { $regex: search, $options: 'i' },
        },
      },

      // Join Store
      {
        $lookup: {
          from: 'stores',
          localField: 'store',
          foreignField: '_id',
          as: 'storeData',
        },
      },
      { $unwind: '$storeData' },

      // Fields to return
      {
        $project: {
          _id: 1,
          image: 1,
          deliveryDate: 1,
          createdAt: 1,
          messageStatus: 1,
          user: 1,
          'orderData.orderId': 1,
          'orderData._id': 1,
          'storeData.location': 1,
        },
      },

      // Pagination
      { $skip: skip },
      { $limit: LIMIT + 1 },
      { $sort: { createdAt: -1 } },
    ]);

    return success200({
      proofs: proofs.map((proof) => ({
        _id: proof._id.toString(),
        orderId: proof.orderData?.orderId,
        order_id: proof.orderData?._id,
        user: proof.user,
        image: proof.image,
        deliveryDate: proof.deliveryDate,
        messageStatus: proof.messageStatus,
        store: proof.storeData.location,
      })),
    });
  } catch (error) {
    if (error instanceof Error) {
      return error500({ error: error.message });
    }
    return error500({ error: 'An unknown error occurred' });
  }
}

export const GET = withDbConnectAndAuth(getHandler);
