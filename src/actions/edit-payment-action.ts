'use server';

import { revalidatePath } from 'next/cache';
import { withDbConnectAndActionAuth } from '@/lib/with-db-connect-and-auth';
import { ZodCateringSchema } from '@/lib/zod-schema/schema';
import Catering from '@/models/cateringModel';
import Tiffin from '@/models/tiffinModel';

export async function editPaymentAction(formData: FormData) {
  try {
    // Authorize the user
    await withDbConnectAndActionAuth();

    const {
      orderId,
      orderType,
      tax,
      total,
      paymentMethod,
      advancePaid,
      pendingBalance,
      fullyPaid,
      deliveryCharge,
      discount,
    } = Object.fromEntries(formData.entries());

    if (!orderId) {
      return { error: 'Invalid order ID.' };
    }
    if (!orderType) {
      return { error: 'Invalid order type.' };
    }

    const result = ZodCateringSchema.pick({
      tax: true,
      totalPrice: true,
      payment_method: true,
      advancePaid: true,
      pendingBalance: true,
      fullyPaid: true,
      deliveryCharge: true,
      discount: true,
    }).safeParse({
      tax: Number(tax),
      deliveryCharge: Number(deliveryCharge),
      totalPrice: Number(total),
      payment_method: paymentMethod,
      advancePaid: Number(advancePaid),
      pendingBalance: Number(pendingBalance),
      fullyPaid: fullyPaid === 'true',
      discount: Number(discount),
    });

    if (!result.success) {
      return { error: result.error };
    }

    if (orderType === 'catering') {
      await Catering.updateOne(
        { _id: orderId },
        {
          $set: {
            tax: result.data.tax,
            deliveryCharge: result.data.deliveryCharge,
            totalPrice: result.data.totalPrice,
            paymentMethod: result.data.payment_method,
            advancePaid: result.data.advancePaid,
            pendingBalance: result.data.pendingBalance,
            fullyPaid: result.data.fullyPaid,
            discount: result.data.discount,
          },
        }
      );
      revalidatePath(`/confirm-order/catering/${orderId}`);
    } else {
      await Tiffin.updateOne(
        { _id: orderId },
        {
          $set: {
            tax: result.data.tax,
            totalPrice: result.data.totalPrice,
            paymentMethod: result.data.payment_method,
            advancePaid: result.data.advancePaid,
            pendingBalance: result.data.pendingBalance,
            fullyPaid: result.data.fullyPaid,
            discount: result.data.discount,
          },
        }
      );
      revalidatePath(`/confirm-order/tiffin/${orderId}`);
    }

    revalidatePath('/dashboard/orders');

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unknown error occurred' };
  }
}
