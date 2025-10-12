import type mongoose from 'mongoose';
import type { AddressDocument } from './address';
import type { CateringMenuDocument } from './catering-menu';
import type { CustomerDocument } from './customer';
import type { StoreDocument } from './store';

export type CateringDocument = {
  _id: mongoose.Schema.Types.ObjectId;
  orderId: string;
  store: mongoose.Schema.Types.ObjectId;
  customer: mongoose.Schema.Types.ObjectId | CustomerDocument;
  address: mongoose.Schema.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  deliveryDate: Date;
  deliveryDateLocal: Date;
  items: {
    itemId: string;
    priceAtOrder: number;
    quantity: number;
    size: string;
  }[];
  customItems: {
    name: string;
    size: string;
    priceAtOrder: number;
  }[];
  advancePaid: number;
  pendingBalance: number;
  fullyPaid: boolean;
  paymentMethod: string;
  discount: number;
  order_type: 'pickup' | 'delivery';
  totalPrice: number;
  tax: number;
  deliveryCharge: number;
  note: string;
  status: 'PENDING' | 'ONGOING' | 'DELIVERED' | 'CANCELLED';
};

// Use Omit<> to avoid repetition and improve maintainability
export interface CateringDocumentPopulate
  extends Omit<CateringDocument, 'store' | 'customer' | 'address' | 'items'> {
  store: StoreDocument;
  customer: CustomerDocument;
  address: AddressDocument;
  items: {
    itemId: CateringMenuDocument;
    priceAtOrder: number;
    quantity: number;
    size: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
