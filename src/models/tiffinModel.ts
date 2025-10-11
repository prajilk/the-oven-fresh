import mongoose, { model, models, Schema } from 'mongoose';
import type { TiffinDocument } from './types/tiffin';

const TiffinSchema = new Schema<TiffinDocument>(
  {
    orderId: {
      type: String,
      require: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    numberOfWeeks: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    advancePaid: {
      type: Number,
      required: true,
    },
    pendingBalance: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    fullyPaid: {
      type: Boolean,
      default: false,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
    },
    order_type: {
      type: String,
      enum: ['pickup', 'delivery'],
      required: true,
    },
    note: String,
    extended: {
      type: Boolean,
      default: false,
    },
    extendedFrom: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['PENDING', 'ONGOING', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING',
    },
  },
  { versionKey: false, timestamps: true }
);

// Create a unique index for orderId
TiffinSchema.index({ orderId: 1 }, { unique: true });

const Tiffin = models?.Tiffin || model<TiffinDocument>('Tiffin', TiffinSchema);
export default Tiffin;
