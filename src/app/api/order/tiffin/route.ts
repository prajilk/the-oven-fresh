import { formatDate } from 'date-fns';
import mongoose from 'mongoose';
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
import { ZodTiffinSchema } from '@/lib/zod-schema/schema';
import Address from '@/models/addressModel';
import Customer from '@/models/customerModel';
import Store from '@/models/storeModel';
import Tiffin from '@/models/tiffinModel';
import { createOrderStatus } from './helper';

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <Ignore>
async function postHandler(req: AuthenticatedRequest) {
  try {
    if (isRestricted(req.user, ['admin', 'manager'])) {
      return error403();
    }

    const storeId = req.user?.storeId.toString();

    if (!storeId) {
      return error403();
    }

    const data = await req.json();
    if (!data) {
      return error400('Invalid data format.', {});
    }

    const result = ZodTiffinSchema.safeParse(data);

    if (result.success) {
      const {
        customerDetails,
        start_date,
        end_date,
        number_of_weeks,
        payment_method,
        advancePaid,
        pendingAmount,
        discount,
        totalAmount,
        tax,
        order_type,
        note,
      } = result.data;

      if (!data.googleAddress.placeId && order_type === 'delivery') {
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

      if (data.googleAddress.placeId && !(placeData.lat && placeData.lng)) {
        // Get lat and lng of the address
        const place = await getPlaceDetails(data.googleAddress.placeId);
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
      if (data.googleAddress.address && data.googleAddress.placeId) {
        // 2️⃣ Find or Create Address (Atomic)
        customerAddress = await Address.findOneAndUpdate(
          {
            customerId: customer._id,
            address: data.googleAddress.address.trim(),
            placeId: data.googleAddress.placeId,
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

      // Generate a new ObjectId for the address
      const tiffinId = new mongoose.Types.ObjectId();

      const [order] = await Promise.all([
        // 3️⃣ Create Order
        Tiffin.create({
          _id: tiffinId,
          orderId: generateOrderId(),
          store: storeId,
          startDate: formatDate(new Date(start_date), 'yyyy-MM-dd'),
          endDate: formatDate(new Date(end_date), 'yyyy-MM-dd'),
          numberOfWeeks: number_of_weeks,
          paymentMethod: payment_method,
          advancePaid: advancePaid || 0,
          discount: discount || 0,
          pendingBalance: Number(pendingAmount)?.toFixed(2),
          totalPrice: Number(totalAmount)?.toFixed(2),
          tax: Number(tax)?.toFixed(2),
          order_type,
          note,
          customer: customer._id,
          customerName: `${customer.firstName} ${customer.lastName}`,
          customerPhone: customer.phone,
          address: customerAddress
            ? (customerAddress as { _id: string })._id
            : null,
        }),
        // 4️⃣ Create Order Status
        await createOrderStatus(
          tiffinId,
          formatDate(new Date(start_date), 'yyyy-MM-dd'),
          formatDate(new Date(end_date), 'yyyy-MM-dd'),
          storeId
        ),
      ]);

      if (data.sentToWhatsapp) {
        if (!process.env.TWILIO_ORDER_CONFIRM_ID) {
          throw new Error('TWILIO_ORDER_CONFIRM_ID is not set.');
        }
        try {
          await sendWhatsappMessage(
            customer.phone,
            {
              1: `${customer.firstName} ${customer.lastName}`,
              2: `tiffin/${order._id.toString()}`,
            },
            process.env.TWILIO_ORDER_CONFIRM_ID
          );

          return success201({ messageSent: true });
        } catch {
          return success201({
            messageSent: false,
          });
        }
      }

      return success201({});
    }

    if (result.error) {
      return error400('Invalid data format.', {});
    }
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

    // Build the query object dynamically based on the presence of storeId
    const filter = storeId ? { store: storeId } : {};

    let query = Tiffin.find(filter)
      .populate({ path: 'store', model: Store, select: 'location' })
      .populate({ path: 'address', model: Address, select: 'address' })
      .sort({ createdAt: -1 });

    if (limit && !Number.isNaN(Number(limit)) && Number(limit) > 0) {
      query = query.limit(Number(limit)); // Apply limit only if it's a valid number
    }

    const orders = await query;
    // .populate({ path: "store", model: Store })
    // .populate({ path: "customer", model: Customer })

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
