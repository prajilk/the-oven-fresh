import type mongoose from 'mongoose';

export type GroceryDocument = {
  _id: string;
  store: mongoose.Types.ObjectId;
  item: string;
  quantity: number;
  unit: 'l' | 'kg' | 'g' | 'lbs' | 'Pcs' | 'Nos' | 'none' | 'Box';
  price: number;
  tax: number;
  total: number;
  purchasedFrom: string;
  date: Date;
};
