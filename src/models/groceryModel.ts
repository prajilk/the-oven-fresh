import mongoose, { model, models, Schema } from 'mongoose';
import type { GroceryDocument } from './types/grocery';

const GrocerySchema = new Schema<GroceryDocument>(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    item: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
    },
    unit: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    purchasedFrom: String,
    date: {
      type: Date,
      required: true,
    },
  },
  { versionKey: false }
);

const Grocery =
  models?.Grocery || model<GroceryDocument>('Grocery', GrocerySchema);
export default Grocery;
