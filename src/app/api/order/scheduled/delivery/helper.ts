import { format } from 'date-fns';
import type {
  CateringInputProps,
  Coords,
  TiffinInputProps,
} from '@/lib/types/delivery';
import Address from '@/models/addressModel';
import CateringMenu from '@/models/cateringMenuModel';
import Catering from '@/models/cateringModel';
import Tiffin from '@/models/tiffinModel';
import TiffinOrderStatus from '@/models/tiffinOrderStatusModel';

async function getTiffins(storeId: string, date: string) {
  return await TiffinOrderStatus.find({
    store: storeId,
    date,
    status: { $in: ['PENDING', 'DELIVERED'] },
  }).populate({
    path: 'orderId',
    model: Tiffin,
    populate: { path: 'address', model: Address },
  });
}

async function getCaterings(storeId: string, date: string) {
  return await Catering.find({
    store: storeId,
    deliveryDateLocal: date,
  })
    .populate({
      path: 'address',
      model: Address,
      select: 'lat lng address',
    })
    .populate({
      path: 'items.itemId',
      model: CateringMenu,
      select: 'name',
    });
}

const getSideOfLine = (lineStart: Coords, lineEnd: Coords, point: Coords) => {
  const val =
    (lineEnd.lng - lineStart.lng) * (point.lat - lineStart.lat) -
    (lineEnd.lat - lineStart.lat) * (point.lng - lineStart.lng);

  // biome-ignore lint/style/noNestedTernary: <Ignore>
  return val > 0 ? 'up' : val < 0 ? 'down' : 'on';
};

const groupByZone = (
  data: TiffinInputProps[] | CateringInputProps[],
  getCoords: (item: Coords) => Coords,
  divider: {
    start: Coords;
    end: Coords;
  }
) => {
  const zone1: TiffinInputProps[] | CateringInputProps[] = [],
    zone2: TiffinInputProps[] | CateringInputProps[] = [];

  for (const item of data) {
    const point = getCoords(item);
    const side = getSideOfLine(divider.start, divider.end, point);
    if (side === 'up') {
      zone1.push(item as TiffinInputProps & CateringInputProps);
    } else if (side === 'down') {
      zone2.push(item as TiffinInputProps & CateringInputProps);
    }
  }

  return { zone1, zone2 };
};

const formatTiffin = (order: TiffinInputProps) => ({
  _id: order.orderId._id.toString(),
  statusId: order._id.toString(),
  orderId: order.orderId.orderId,
  customerName: order.orderId.customerName,
  customerPhone: order.orderId.customerPhone,
  status: order.status,
  fullyPaid: order.orderId.fullyPaid,
  pendingBalance: order.orderId.pendingBalance,
  totalPrice: order.orderId.totalPrice,
  advancePaid: order.orderId.advancePaid,
  date: format(new Date(order.date), 'yyyy-MM-dd'),
  address: {
    address: order.orderId.address.address,
    lat: order.orderId.address.lat,
    lng: order.orderId.address.lng,
  },
});

const formatCatering = (order: CateringInputProps) => ({
  _id: order._id.toString(),
  orderId: order.orderId,
  customerName: order.customerName,
  customerPhone: order.customerPhone,
  status: order.status,
  fullyPaid: order.fullyPaid,
  pendingBalance: order.pendingBalance,
  totalPrice: order.totalPrice,
  advancePaid: order.advancePaid,
  address: {
    address: order.address.address,
    lat: order.address.lat,
    lng: order.address.lng,
  },
  date: order.deliveryDate,
  items: order.items.map((item) => ({
    name: item.itemId.name,
    quantity: item.quantity,
  })),
  customItems: order.customItems.map((item) => ({
    name: item.name,
    size: item.size,
  })),
});

export {
  getSideOfLine,
  groupByZone,
  formatTiffin,
  formatCatering,
  getTiffins,
  getCaterings,
};
