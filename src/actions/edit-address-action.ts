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

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <Ignore>
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

    if (!address) {
      if (orderType === 'tiffin') {
        const tiffin = await Tiffin.findOne({ _id: orderId }, 'order_type');
        if (tiffin?.order_type === 'delivery' || order_type === 'delivery') {
          return { error: 'Address is required for delivery orders' };
        }
      } else if (orderType === 'catering') {
        const catering = await Catering.findOne({ _id: orderId }, 'order_type');
        if (catering?.order_type === 'delivery' || order_type === 'delivery') {
          return { error: 'Address is required for delivery orders' };
        }
      }
    }

    // Validate input data based on order type
    const validationSchema =
      orderType === 'catering'
        ? ZodCustomerSchema.extend(ZodCateringSchema.shape).pick({
            address: true,
            aptSuiteUnit: true,
            deliveryDate: true,
            order_type: true,
          })
        : ZodCustomerSchema.extend(ZodTiffinSchema.shape).pick({
            address: true,
            aptSuiteUnit: true,
            start_date: true,
            end_date: true,
          });

    const validated = validationSchema.safeParse({
      address,
      deliveryDate: new Date(deliveryDate as string),
      aptSuiteUnit: aptSuiteUnit || '',
      start_date: startDate,
      end_date: endDate,
      order_type,
    });

    if (!validated.success) {
      return { error: validated.error.message };
    }

    const validatedData = validated.data as unknown as ValidatedDataType;

    let isAddressSame = true;
    if (addressId) {
      const currentAddress = await Address.findById(addressId);
      if (!currentAddress) {
        return { error: 'Address not found.' };
      }

      isAddressSame =
        currentAddress.address === validatedData.address &&
        currentAddress.aptSuiteUnit === validatedData.aptSuiteUnit;
    } else if (placeId && validatedData.address) {
      isAddressSame = false;
    }

    const isAddressInUse = async (id: string) => {
      const [catering, tiffin] = await Promise.all([
        Catering.findOne({ address: id, _id: { $ne: orderId } }),
        Tiffin.findOne({ address: id, _id: { $ne: orderId } }),
      ]);
      return Boolean(catering || tiffin);
    };

    const createAddress = async () => {
      const places = await getPlaceDetails(placeId.toString());
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
      return newAddress._id;
    };

    const updateAddress = async (id: string) => {
      const places = await getPlaceDetails(placeId.toString());
      await Address.updateOne(
        { _id: id },
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
    };

    // biome-ignore lint/nursery/noUnnecessaryConditions: <Ignore>
    if (isAddressSame) {
      // Only update order details if the address is unchanged
      await updateOrder(orderId.toString(), orderType.toString(), {
        ...validatedData,
        addressId: (addressId as string) || null,
      });
    } else {
      let newAddressId: string | null = addressId as string;
      if (addressId && placeId && address) {
        // Check if the address is shared with other orders
        if (await isAddressInUse(addressId as string)) {
          // Create a new address if it's used by another order
          newAddressId = await createAddress(); // Create new one if shared
        } else {
          // Update existing address
          await updateAddress(addressId as string);
        }
      } else if (!addressId && placeId && validatedData.address) {
        // Create new address
        newAddressId = await createAddress();
      } else if (addressId && placeId && (!address || address === '')) {
        if (!(await isAddressInUse(addressId as string))) {
          // Address cleared, remove if unused
          await Address.deleteOne({ _id: addressId });
        }
        newAddressId = null;
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
  address?: string | null;
  order_type?: string;
  deliveryDate?: string | Date;
  deliveryDateLocal?: string | Date;
  startDate?: string;
  endDate?: string;
};

// Function to update order details
async function updateOrder(
  orderId: string,
  orderType: string,
  data: ValidatedDataType & { addressId?: string | null },
  newAddressId?: string | null
) {
  const updateData: UpdateDataType = {
    address: newAddressId === null ? null : newAddressId || data.addressId,
  };

  if (orderType === 'catering') {
    updateData.deliveryDate = data.deliveryDate;
    updateData.deliveryDateLocal = format(
      new Date(data.deliveryDate),
      'yyyy-MM-dd'
    );
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
