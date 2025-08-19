'use server';

import { revalidatePath } from 'next/cache';
import { withDbConnectAndActionAuth } from '@/lib/with-db-connect-and-auth';
import Catering from '@/models/cateringModel';
import type { CateringDocument } from '@/models/types/catering';

// biome-ignore lint/nursery/useMaxParams: <Ignore>
export async function updateOrderItemsAction(
  orderId: string,
  itemType: 'items' | 'customItems',
  items: CateringDocument['items'] | CateringDocument['customItems'],
  advancePaid: number,
  prevTax: number,
  deliveryCharge: number,
  subtotal: number,
  discount: number
) {
  try {
    // Authorize the user
    await withDbConnectAndActionAuth();

    if (!orderId) {
      return { error: 'Invalid order ID.' };
    }
    if (!items) {
      return { error: 'Invalid items.' };
    }

    const tax =
      (subtotal * Number(process.env.NEXT_PUBLIC_TAX_AMOUNT || 0)) / 100;
    const total =
      prevTax > 0 ? subtotal + tax + deliveryCharge : subtotal + deliveryCharge;
    const pendingBalance = total - advancePaid - discount;

    const result = await Catering.updateOne(
      { _id: orderId },
      {
        $set: {
          [itemType]: items,
          totalPrice: total.toFixed(2),
          tax: prevTax > 0 ? tax : 0,
          pendingBalance: pendingBalance.toFixed(2),
          fullyPaid: pendingBalance <= 0,
        },
      }
    );

    revalidatePath('/dashboard/orders');
    revalidatePath(`/confirm-order/catering/${orderId}`);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unknown error occurred' };
  }
}
