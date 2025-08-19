import type mongoose from 'mongoose';
import type { StoreDocument } from './store';

export type UserDocument = {
  _id: string;
  username: string;
  displayUsername: string;
  role: 'admin' | 'manager' | 'delivery';
  storeId: mongoose.Schema.Types.ObjectId | null;
  zone?: number;
};

export interface UserDocumentPopulate
  extends Omit<UserDocument, 'storeId' | 'password'> {
  store: StoreDocument;
}
