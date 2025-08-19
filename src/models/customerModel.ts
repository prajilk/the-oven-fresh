import { model, models, Schema } from 'mongoose';
import type { CustomerDocument } from './types/customer';

const CustomerSchema = new Schema<CustomerDocument>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const Customer =
  models?.Customer || model<CustomerDocument>('Customer', CustomerSchema);
export default Customer;
