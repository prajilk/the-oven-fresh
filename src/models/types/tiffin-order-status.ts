import type mongoose from 'mongoose';
import type { TiffinDocumentPopulate } from './tiffin';

export type TiffinOrderStatusDocument = {
  _id: string;
  orderId: mongoose.Schema.Types.ObjectId;
  store: mongoose.Schema.Types.ObjectId;
  date: Date;
  status: 'PENDING' | 'ONGOING' | 'DELIVERED';
};

export interface TiffinOrderStatusDocumentPopulate
  extends Omit<TiffinOrderStatusDocument, 'orderId'> {
  orderId: TiffinDocumentPopulate;
}
