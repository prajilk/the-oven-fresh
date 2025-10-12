import { format } from 'date-fns';
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
  return await Catering.find(
    {
      deliveryDateLocal: format(new Date(date), 'yyyy-MM-dd'),
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
