export type CateringOrderState = {
  store: string;
  deliveryDate: string;
  customerDetails: {
    firstName: string;
    lastName: string;
    phone: string;
    address: { address: string; key: number };
    placeId: string;
    aptSuiteUnit: string;
    lat: string;
    lng: string;
  };
  payment_method: 'cash' | 'card' | 'e-transfer';
  note?: string;
  totalPrice: number;
  tax: number;
  deliveryCharge: number;
  advancePaid: number;
  pendingBalance: number;
  discount: number;
  fullyPaid: boolean;
  order_type: 'pickup' | 'delivery';
};

export type CateringItemsState = {
  _id: string;
  category: string;
  name: string;
  size: string;
  image: string;
  quantity: number;
  priceAtOrder: number;
  variant?: string;
};

export type CateringCustomItemState = {
  name: string;
  size: string;
  priceAtOrder: number;
};
