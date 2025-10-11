'use server';

import { format } from 'date-fns';
import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';
import { createOrderStatus } from '@/app/api/order/tiffin/helper';
import { addWeekdays } from '@/lib/utils';
import { withDbConnectAndActionAuth } from '@/lib/with-db-connect-and-auth';
import { ZodTiffinSchema } from '@/lib/zod-schema/schema';
import TiffinMenu from '@/models/tiffinMenuModel';
import Tiffin from '@/models/tiffinModel';
import TiffinOrderStatus from '@/models/tiffinOrderStatusModel';

// Helper function for form data parsing
const getFormDataValue = (formData: FormData, key: string) =>
  formData.get(key)?.toString().trim() || '';

export async function editTiffinOrderAction(formData: FormData) {
  try {
    // Authorize the user
    await withDbConnectAndActionAuth();

    // Get form data
    const orderId = getFormDataValue(formData, 'orderId');
    const startDate = getFormDataValue(formData, 'startDate');
    const updateEndDate = getFormDataValue(formData, 'updateEndDate');
    const numberOfWeeks = getFormDataValue(formData, 'numberOfWeeks');
    const order_type = getFormDataValue(formData, 'order_type');
    const tax = getFormDataValue(formData, 'tax');
    const advancePaid = getFormDataValue(formData, 'advancePaid');

    // Validate required fields
    if (
      !(
        orderId &&
        startDate &&
        numberOfWeeks &&
        order_type &&
        tax &&
        advancePaid
      )
    ) {
      return { error: 'Missing required fields.' };
    }

    if(order_type === 'delivery') {
      const tiffin = await Tiffin.findOne({ _id: orderId }, "address");
      if(tiffin?.address === null) {
        return { error: 'Address is required for delivery orders' };
      }
    }

    // Parse and validate order data using Zod schema
    const validation = ZodTiffinSchema.pick({
      number_of_weeks: true,
      order_type: true,
    }).safeParse({ number_of_weeks: numberOfWeeks, order_type });

    if (!validation.success) {
      return { error: validation.error };
    }

    // Retrieve tiffin menu
    const tiffinMenu = await TiffinMenu.findOne();
    if (!tiffinMenu) {
      return { error: 'Tiffin menu not found.' };
    }

    const weeksNumber = Number.parseFloat(numberOfWeeks);
    if (Number.isNaN(weeksNumber)) {
      return { error: 'Invalid number of weeks.' };
    }

    const endDate = addWeekdays(startDate, weeksNumber);

    // Calculate total amount
    const calculateTotalAmount = () => {
      const baseAmount =
        order_type === 'pickup'
          ? tiffinMenu?.pickup[`${numberOfWeeks}_weeks`] || 0
          : tiffinMenu?.delivery[`${numberOfWeeks}_weeks`] || 0;

      const totalTax =
        baseAmount * (Number(process.env.NEXT_PUBLIC_TAX_AMOUNT || 0) / 100);
      return {
        tax: totalTax,
        total: baseAmount + (Number(tax) > 0 ? totalTax : 0),
      };
    };

    // Prepare update data
    const updateData: Record<string, string | number | Date> = {
      numberOfWeeks: validation.data.number_of_weeks,
      order_type: validation.data.order_type,
      totalPrice: calculateTotalAmount().total,
      tax: Number(tax) > 0 ? calculateTotalAmount().tax : 0,
      pendingBalance: calculateTotalAmount().total - Number(advancePaid),
    };

    // Conditionally update end date
    if (updateEndDate === 'true') {
      updateData.endDate = endDate;
    }

    // Update order in database
    const updatedOrder = await Tiffin.findOneAndUpdate(
      { _id: orderId },
      { $set: updateData }
    );
    await TiffinOrderStatus.deleteMany({
      orderId: mongoose.Types.ObjectId.createFromHexString(orderId),
      status: 'PENDING',
    });

    // 4️⃣ Create Order Status
    await createOrderStatus(
      mongoose.Types.ObjectId.createFromHexString(orderId),
      startDate,
      format(endDate, 'yyyy-MM-dd'),
      updatedOrder.store
    );

    // Revalidate the path
    revalidatePath('/dashboard/orders');
    revalidatePath(`/confirm-order/tiffin/${orderId}`);

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unknown error occurred' };
  }
}
