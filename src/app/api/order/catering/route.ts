import { format } from 'date-fns';
import { getPlaceDetails } from '@/lib/google';
import {
  error400,
  error403,
  error500,
  success200,
  success201,
} from '@/lib/response';
import type { AuthenticatedRequest } from '@/lib/types/auth-request';
import { generateOrderId, isRestricted } from '@/lib/utils';
import { sendWhatsappMessage } from '@/lib/whatsapp';
import { withDbConnectAndAuth } from '@/lib/with-db-connect-and-auth';
import { ZodCateringSchema } from '@/lib/zod-schema/schema';
import Address from '@/models/addressModel';
import CateringMenu from '@/models/cateringMenuModel';
import Catering from '@/models/cateringModel';
import Customer from '@/models/customerModel';
import Store from '@/models/storeModel';

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <Ignore>
async function postHandler(req: AuthenticatedRequest) {
  try {
    if (isRestricted(req.user, ['admin', 'manager'])) {
      return error403();
    }

    const store = req.user?.storeId.toString();

    if (!store) {
      return error403();
    }

    const data = await req.json();
    if (!data) {
      return error400('Invalid data format.', {});
    }

    const result = ZodCateringSchema.safeParse({
      ...data,
      deliveryDate: new Date(data.deliveryDate),
    });

    if (!result.success) {
      return error400('Invalid data format.', {});
    }

    const { customerDetails, ...orderData } = result.data;

    if (!data.customerDetails.address && orderData.order_type === 'delivery') {
      return error400('Address is required for delivery orders', {});
    }

    const placeData: {
      lat: number;
      lng: number;
      street?: string;
      city?: string;
      province?: string;
      zipCode?: string;
    } = {
      lat: customerDetails.lat,
      lng: customerDetails.lng,
    };

    if (
      data.customerDetails.placeId &&
      customerDetails.address &&
      !(placeData.lat && placeData.lng)
    ) {
      // Get lat and lng of the address
      const place = await getPlaceDetails(data.customerDetails.placeId);
      if (!place) {
        return error400('Unable to get coordinates.', {});
      }
      placeData.lat = place.lat;
      placeData.lng = place.lng;
      placeData.street = place.street;
      placeData.city = place.city;
      placeData.province = place.province;
      placeData.zipCode = place.zipCode;
    }

    // 1️⃣ Find or Create Customer (Atomic)
    const customer = await Customer.findOneAndUpdate(
      { phone: customerDetails.phone }, // Search by phone
      {
        firstName: customerDetails.firstName.trim(),
        lastName: customerDetails.lastName.trim(),
      }, // Update name if changed
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    let customerAddress: unknown;
    if (customerDetails.address && data.customerDetails.placeId) {
      // 2️⃣ Find or Create Address (Atomic)
      customerAddress = await Address.findOneAndUpdate(
        {
          customerId: customer._id,
          address: customerDetails.address.trim(),
          placeId: data.customerDetails.placeId,
          aptSuiteUnit: customerDetails.aptSuiteUnit,
        }, // Match customer and address
        {
          lat: placeData.lat,
          lng: placeData.lng,
          street: placeData.street,
          city: placeData.city,
          province: placeData.province,
          zipCode: placeData.zipCode,
          aptSuiteUnit: customerDetails.aptSuiteUnit,
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    }

    const order = await Catering.create({
      ...orderData,
      store,
      orderId: generateOrderId(),
      deliveryDate: orderData.deliveryDate,
      deliveryDateLocal: format(new Date(orderData.deliveryDate), 'yyyy-MM-dd'),
      pendingBalance: Number(orderData.pendingBalance)?.toFixed(2),
      totalPrice: Number(orderData.totalPrice)?.toFixed(2),
      tax: Number(orderData.tax)?.toFixed(2),
      customer: customer._id,
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerPhone: customer.phone,
      address: customerAddress
        ? (customerAddress as { _id: string })._id
        : null,
      paymentMethod: orderData.payment_method,
    });

    if (data.sentToWhatsapp) {
      if (!process.env.TWILIO_ORDER_CONFIRM_ID) {
        throw new Error('TWILIO_ORDER_CONFIRM_ID is not set.');
      }

      try {
        await sendWhatsappMessage(
          customer.phone,
          {
            1: `${customer.firstName} ${customer.lastName}`,
            2: `catering/${order._id.toString()}`,
          },
          process.env.TWILIO_ORDER_CONFIRM_ID
        );
        return success201({ order, messageSent: true });
      } catch {
        return success201({
          messageSent: false,
        });
      }
    }

    return success201({ order });
  } catch (error) {
    if (error instanceof Error) {
      return error500({ error: error.message });
    }
    return error500({ error: 'An unknown error occurred' });
  }
}

async function getHandler(req: AuthenticatedRequest) {
  try {
    if (isRestricted(req.user, ['admin', 'manager'])) {
      return error403();
    }

    const storeId = req.user?.storeId.toString();

    if (!storeId) {
      return error403();
    }

    const limit = req.nextUrl.searchParams.get('limit');

    const filter = storeId ? { store: storeId } : {};

    let query = Catering.find(filter)
      .populate({
        path: 'customer',
        model: Customer,
      })
      .populate({
        path: 'address',
        model: Address,
        select: 'address',
      })
      .populate({
        path: 'store',
        model: Store,
        select: 'location',
      })
      .populate({
        path: 'items.itemId',
        model: CateringMenu,
        select: 'name',
      })
      .sort({ createdAt: -1 });

    if (limit && !Number.isNaN(Number(limit)) && Number(limit) > 0) {
      query = query.limit(Number(limit)); // Apply limit only if it's a valid number
    }

    const orders = await query;
    // .populate({ path: "store", model: Store })
    // .populate({ path: "items.itemId", model: CateringMenu });

    return success200({ orders });
  } catch (error) {
    if (error instanceof Error) {
      return error500({ error: error.message });
    }
    return error500({ error: 'An unknown error occurred' });
  }
}

export const POST = withDbConnectAndAuth(postHandler);
export const GET = withDbConnectAndAuth(getHandler);
