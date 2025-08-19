export type ScheduledOrderProps = {
  _id: string;
  store: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  order: string;
  order_type: string;
  status: string;
};

export type ScheduledTiffinDelivery = {
  orders: {
    _id: string;
    statusId: string;
    orderId: string;
    customerName: string;
    customerPhone: string;
    status: string;
    fullyPaid: boolean;
    pendingBalance: number;
    totalPrice: number;
    advancePaid: number;
    date: string;
    address: {
      address: string;
      lat: number;
      lng: number;
    };
  }[];
  stats: {
    total: number;
    delivered: number;
    pending: number;
  };
};

export type ScheduledCateringDelivery = {
  orders: {
    _id: string;
    orderId: string;
    customerName: string;
    customerPhone: string;
    status: string;
    fullyPaid: boolean;
    pendingBalance: number;
    totalPrice: number;
    advancePaid: number;
    address: {
      address: string;
      lat: number;
      lng: number;
    };
    date: Date;
    items: {
      name: string;
      quantity: number;
    }[];
    customItems: {
      name: string;
      size: string;
    }[];
  }[];
  stats: {
    total: number;
    delivered: number;
    pending: number;
  };
};

export type ScheduledDeliveryProps = {
  tiffins: {
    zone1: ScheduledTiffinDelivery['orders'];
    zone2: ScheduledTiffinDelivery['orders'];
  };
  caterings: {
    zone1: ScheduledCateringDelivery['orders'];
    zone2: ScheduledCateringDelivery['orders'];
  };
};
