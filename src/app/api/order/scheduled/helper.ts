import { addMinutes, endOfDay, startOfDay } from 'date-fns';
import mongoose from 'mongoose';
import Address from '@/models/addressModel';
import CateringMenu from '@/models/cateringMenuModel';
import Catering from '@/models/cateringModel';
import Store from '@/models/storeModel';
import Tiffin from '@/models/tiffinModel';
import TiffinOrderStatus from '@/models/tiffinOrderStatusModel';
import type { CateringDocumentPopulate } from '@/models/types/catering';

async function getScheduledCateringOrders(
  date: Date | string,
  store: string
): Promise<CateringDocumentPopulate[]> {
  // Convert local date to UTC range
  const localDate = new Date(date); // '2025-10-13'
  const startIST = startOfDay(localDate);
  const endIST = endOfDay(localDate);

  // Convert Local to UTC
  const startUTC = addMinutes(startIST, -330);
  const endUTC = addMinutes(endIST, -330);

  return await Catering.find(
    {
      deliveryDate: { $gte: startUTC, $lte: endUTC },
      status: { $in: ['PENDING', 'ONGOING'] },
      store: mongoose.Types.ObjectId.createFromHexString(store),
    },
    '_id orderId customerName customerPhone status store order_type items'
  )
    .populate({ path: 'address', model: Address, select: 'address' })
    .populate({
      path: 'items.itemId',
      model: CateringMenu,
    })
    .populate({
      path: 'store',
      model: Store,
      select: '_id location',
    });
}

async function getScheduledTiffinOrders(date: Date | string) {
  return await TiffinOrderStatus.find({
    date: new Date(date),
    status: { $in: ['PENDING', 'ONGOING', 'DELIVERED'] },
  }).populate({
    path: 'orderId',
    model: Tiffin,
    select: '_id orderId customerName customerPhone store order_type',
    populate: [
      {
        path: 'address',
        model: Address,
        select: 'address',
      },
      {
        path: 'store',
        model: Store,
        select: '_id location',
      },
    ],
  });
}

export { getScheduledCateringOrders, getScheduledTiffinOrders };
