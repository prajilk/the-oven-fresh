'use server';

import { sendWhatsappMessage } from '@/lib/whatsapp';
import { withDbConnectAndActionAuth } from '@/lib/with-db-connect-and-auth';
import Catering from '@/models/cateringModel';
import Tiffin from '@/models/tiffinModel';
import type { CateringDocument } from '@/models/types/catering';
import type { TiffinDocument } from '@/models/types/tiffin';

export async function sentOrderToWhatsappAction(
  orderId: string,
  orderType: string
) {
  try {
    if (!orderId) {
      return { error: 'No order id provided' };
    }
    // Authorize the user
    await withDbConnectAndActionAuth();

    let order: TiffinDocument | CateringDocument | null = null;

    if (orderType === 'tiffin') {
      order = (await Tiffin.findById(
        orderId,
        'customerPhone customerName _id'
      )) as TiffinDocument;
    } else if (orderType === 'catering') {
      order = (await Catering.findById(
        orderId,
        'customerPhone customerName _id'
      )) as CateringDocument;
    }

    if (!order) {
      return { error: 'Order not found' };
    }

    if (!process.env.TWILIO_ORDER_CONFIRM_ID) {
      throw new Error('TWILIO_ORDER_CONFIRM_ID is not set.');
    }

    await sendWhatsappMessage(
      order.customerPhone,
      {
        1: order.customerName,
        2: `tiffin/${order._id.toString()}`,
      },
      process.env.TWILIO_ORDER_CONFIRM_ID
    );

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unknown error occurred' };
  }
}
