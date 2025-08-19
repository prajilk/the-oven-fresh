import mongoose, { model, models, Schema } from 'mongoose';
import type { TiffinOrderStatusDocument } from './types/tiffin-order-status';

const TiffinOrderStatusSchema = new Schema<TiffinOrderStatusDocument>(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tiffin',
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ONGOING', 'DELIVERED'],
      default: 'PENDING',
    },
  },
  { versionKey: false, timestamps: true }
);

const TiffinOrderStatus =
  models['Tiffin-Order-Status'] ||
  model<TiffinOrderStatusDocument>(
    'Tiffin-Order-Status',
    TiffinOrderStatusSchema
  );
export default TiffinOrderStatus;
