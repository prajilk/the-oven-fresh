import { addDays, format } from 'date-fns';
import type { NextRequest } from 'next/server';
import connectDB from '@/config/mongoose';
import { sendWhatsappMessage } from '@/lib/whatsapp';
import Store from '@/models/storeModel';
import Tiffin from '@/models/tiffinModel';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', {
        status: 401,
      });
    }

    const today = new Date(format(new Date(), 'yyyy-MM-dd'));
    const endingDate = new Date(format(addDays(today, 2), 'yyyy-MM-dd'));

    await connectDB();
    const expiringTiffins = await Tiffin.find(
      { endDate: endingDate },
      'customerPhone customerName orderId endDate'
    ).populate({
      path: 'store',
      model: Store,
      select: 'name phone',
    });

    if (expiringTiffins.length === 0) {
      return Response.json({ success: true });
    }
    // TODO: Implement cron logic: Sent whatsapp message from here.
    if (!process.env.TWILIO_TIFFIN_EXPIRY_ID) {
      throw new Error('TWILIO_TIFFIN_EXPIRY_ID is not set.');
    }
    const messages = expiringTiffins.map((order) =>
      sendWhatsappMessage(
        order.customerPhone,
        {
          1: order.customerName,
          2: order.orderId,
          3: format(new Date(order.endDate), 'PPPP'),
          4: order.store.phone,
          5: order.store.name,
        },
        process.env.TWILIO_TIFFIN_EXPIRY_ID || ''
      )
    );

    try {
      await Promise.all(messages);
    } catch (error) {
      return Response.json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unable to sent reminder message!',
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
