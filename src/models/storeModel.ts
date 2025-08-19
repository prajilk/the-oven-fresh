import { model, models, Schema } from 'mongoose';
import type { StoreDocument } from './types/store';

const StoreSchema = new Schema<StoreDocument>(
  {
    name: {
      type: String,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    placeId: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    dividerLine: {
      type: {
        start: {
          lat: Number,
          lng: Number,
        },
        end: {
          lat: Number,
          lng: Number,
        },
      },
      required: true,
    },
    phone: String,
  },
  { versionKey: false }
);

const Store = models?.Store || model<StoreDocument>('Store', StoreSchema);
export default Store;
