import { revalidatePath } from 'next/cache';
import { error403, error404, error500, success200 } from '@/lib/response';
import type { AuthenticatedRequest } from '@/lib/types/auth-request';
import { isRestricted } from '@/lib/utils';
import { withDbConnectAndAuth } from '@/lib/with-db-connect-and-auth';
import Address from '@/models/addressModel';
import CateringMenu from '@/models/cateringMenuModel';
import Catering from '@/models/cateringModel';
import Customer from '@/models/customerModel';
import Store from '@/models/storeModel';
import Tiffin from '@/models/tiffinModel';

async function deleteHandler(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    if (isRestricted(req.user, ['admin', 'manager'])) {
      return error403();
    }

    const { orderId } = await params;

    const order = await Catering.findByIdAndDelete(orderId);
    if (!order) {
      return error404('Order not found.');
    }

    const [tiffinExist, cateringExist] = await Promise.all([
      Tiffin.findOne({
        customer: order.customer,
        orderId: { $ne: order.orderId },
      }),
      Catering.findOne({
        customer: order.customer,
        orderId: { $ne: order.orderId },
      }),
    ]);

    if (!(tiffinExist || cateringExist)) {
      await Promise.all([
        Customer.findByIdAndDelete(order.customer),
        Address.deleteMany({ customerId: order.customer }),
      ]);
    }

    revalidatePath(`/confirm-order/catering/${orderId}`);

    return success200({ message: 'Order deleted successfully.' });
  } catch (error) {
    if (error instanceof Error) {
      return error500({ error: error.message });
    }
    return error500({ error: 'An unknown error occurred' });
  }
}

async function getHandler(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    if (isRestricted(req.user, ['admin', 'manager'])) {
      return error403();
    }

    const { orderId } = await params;

    const orders = await Catering.findOne({
      orderId,
    })
      .populate({ path: 'address', model: Address })
      .populate({ path: 'customer', model: Customer })
      .populate({ path: 'store', model: Store })
      .populate({ path: 'items.itemId', model: CateringMenu });

    return success200({ orders });
  } catch (error) {
    if (error instanceof Error) {
      return error500({ error: error.message });
    }
    return error500({ error: 'An unknown error occurred' });
  }
}

async function patchHandler(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    if (isRestricted(req.user, ['admin', 'manager'])) {
      return error403();
    }

    const { orderId } = await params;
    const {
      items,
    }: {
      items?: {
        itemId: string;
        priceAtOrder: number;
        quantity: number;
        size: string;
      }[];
    } = await req.json();

    if (!orderId) {
      return error404('Order not found.');
    }
    if (!items || items.length === 0) {
      return error404('Items not found.');
    }

    const order = await Catering.findById({ _id: orderId });
    if (!order) {
      return error404('Order not found in database.');
    }

    const { totalPrice, tax, advancePaid, deliveryCharge, discount } = order;

    const newSubtotal = items.reduce(
      (acc, item) => acc + item.priceAtOrder * item.quantity,
      0
    );

    // const newTotal = totalPrice + newSubtotal;
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_AMOUNT || 0);

    const oldSubtotal = totalPrice - tax - deliveryCharge;
    const subtotal = oldSubtotal + newSubtotal;
    const newTax = tax > 0 ? (subtotal * taxRate) / 100 : 0;
    const updatedTotal =
      tax > 0 ? subtotal + newTax + deliveryCharge : subtotal + deliveryCharge;
    const pendingBalance = updatedTotal - advancePaid - discount;
    const fullyPaid = pendingBalance <= 0;

    await Catering.updateOne(
      { _id: orderId },
      {
        $push: { items: { $each: items } },
        $set: {
          totalPrice: updatedTotal.toFixed(2),
          tax: newTax.toFixed(2),
          pendingBalance: pendingBalance.toFixed(2),
          fullyPaid,
        },
      }
    );

    revalidatePath(`/confirm-order/catering/${orderId}`);

    return success200({ message: 'Order updated successfully.' });
  } catch (error) {
    if (error instanceof Error) {
      return error500({ error: error.message });
    }
    return error500({ error: 'An unknown error occurred' });
  }
}

export const GET = withDbConnectAndAuth(getHandler);
export const DELETE = withDbConnectAndAuth(deleteHandler);
export const PATCH = withDbConnectAndAuth(patchHandler);
