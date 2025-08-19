'use server';

import { format } from 'date-fns';
import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';
import { createOrderStatus } from '@/app/api/order/tiffin/helper';
import { getPlaceDetails } from '@/lib/google';
import { withDbConnectAndActionAuth } from '@/lib/with-db-connect-and-auth';
import {
  ZodCateringSchema,
  ZodCustomerSchema,
  ZodTiffinSchema,
} from '@/lib/zod-schema/schema';
import Address from '@/models/addressModel';
import Catering from '@/models/cateringModel';
import Tiffin from '@/models/tiffinModel';
import TiffinOrderStatus from '@/models/tiffinOrderStatusModel';

type ValidatedDataType = {
  address: string;
  lat: number;
  lng: number;
  aptSuiteUnit: string;
  deliveryDate: Date;
  start_date: Date;
  end_date: Date;
  order_type: 'pickup' | 'delivery';
};

export async function editAddressAction(formData: FormData) {
  try {
    // Authorize the user
    await withDbConnectAndActionAuth();

    const {
      orderId,
      orderType,
      addressId,
      address,
      placeId,
      customerId,
      deliveryDate,
      startDate,
      endDate,
      aptSuiteUnit,
      order_type,
    } = Object.fromEntries(formData.entries());

    if (!(orderId && orderType)) {
      return { error: 'Invalid order ID or order type.' };
    }

    // Fetch existing address from the database
    const currentAddress = await Address.findById(addressId);

    if (!currentAddress) {
      return { error: 'Address not found.' };
    }

    // Validate input data based on order type
    const validationSchema =
      orderType === 'catering'
        ? ZodCustomerSchema.merge(ZodCateringSchema).pick({
            address: true,
            aptSuiteUnit: true,
            deliveryDate: true,
            order_type: true,
          })
        : ZodCustomerSchema.merge(ZodTiffinSchema).pick({
            address: true,
            aptSuiteUnit: true,
            start_date: true,
            end_date: true,
          });

    const validated = validationSchema.safeParse({
      address,
      deliveryDate,
      aptSuiteUnit,
      start_date: startDate,
      end_date: endDate,
      order_type,
    });

    if (!validated.success) {
      return { error: validated.error.format() };
    }

    const validatedData = validated.data as ValidatedDataType;

    // Check if address details have changed
    const isAddressSame =
      currentAddress.address === validatedData.address &&
      currentAddress.aptSuiteUnit === validatedData.aptSuiteUnit;

    if (isAddressSame) {
      // Only update order details if the address is unchanged
      await updateOrder(orderId.toString(), orderType.toString(), {
        ...validatedData,
        addressId: addressId as string,
      });
    } else {
      // Check if the address is shared with other orders
      const isAddressInUse = await Promise.all([
        Catering.findOne({ address: addressId, _id: { $ne: orderId } }),
        Tiffin.findOne({ address: addressId, _id: { $ne: orderId } }),
      ]);

      const places = await getPlaceDetails(placeId.toString());

      let newAddressId = addressId as string;

      if (isAddressInUse.some((order) => order)) {
        // Create a new address if it's used by another order
        const newAddress = await Address.create({
          address: validatedData.address,
          lat: places?.lat,
          lng: places?.lng,
          street: places?.street,
          city: places?.city,
          province: places?.province,
          zipCode: places?.zipCode,
          aptSuiteUnit: validatedData.aptSuiteUnit,
          placeId,
          customerId,
        });

        newAddressId = newAddress._id;
      } else {
        // Update existing address
        await Address.updateOne(
          { _id: addressId },
          {
            $set: {
              address: validatedData.address,
              aptSuiteUnit: validatedData.aptSuiteUnit,
              lat: places?.lat,
              lng: places?.lng,
              street: places?.street,
              city: places?.city,
              province: places?.province,
              zipCode: places?.zipCode,
            },
          }
        );
      }

      // Update order with the new address
      await updateOrder(
        orderId.toString(),
        orderType.toString(),
        validatedData,
        newAddressId
      );
    }

    // Revalidate the order dashboard
    revalidatePath('/dashboard/orders');

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unknown error occurred' };
  }
}

// Define the type for updateData
type UpdateDataType = {
  address?: string;
  order_type?: string;
  deliveryDate?: string;
  startDate?: string;
  endDate?: string;
};

// Function to update order details
async function updateOrder(
  orderId: string,
  orderType: string,
  data: ValidatedDataType & { addressId?: string },
  newAddressId?: string
) {
  const updateData: UpdateDataType = {
    address: newAddressId || data.addressId,
  };

  if (orderType === 'catering') {
    updateData.deliveryDate = format(new Date(data.deliveryDate), 'yyyy-MM-dd');
    updateData.order_type = data.order_type;
    await Catering.updateOne({ _id: orderId }, { $set: updateData });
    revalidatePath(`/confirm-order/catering/${orderId}`);
  } else {
    updateData.startDate = format(new Date(data.start_date), 'yyyy-MM-dd');
    updateData.endDate = format(new Date(data.end_date), 'yyyy-MM-dd');
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
      format(new Date(data.start_date), 'yyyy-MM-dd'),
      format(new Date(data.end_date), 'yyyy-MM-dd'),
      updatedOrder.store
    );
    revalidatePath(`/confirm-order/tiffin/${orderId}`);
  }
}
