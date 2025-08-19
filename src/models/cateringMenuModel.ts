import mongoose, { model, models, Schema } from 'mongoose';
import type { CateringMenuDocument } from './types/catering-menu';

const CateringMenuSchema = new Schema<CateringMenuDocument>(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CateringCategory',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    smallPrice: {
      type: Number,
      default: null,
    },
    smallServingSize: {
      type: String,
      default: null,
    },
    mediumPrice: {
      type: Number,
      default: null,
    },
    mediumServingSize: {
      type: String,
      default: null,
    },
    largePrice: {
      type: Number,
      default: null,
    },
    largeServingSize: {
      type: String,
      default: null,
    },
    variant: {
      type: String,
    },
    image: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    publicId: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

const CateringMenu =
  models?.CateringMenu ||
  model<CateringMenuDocument>('CateringMenu', CateringMenuSchema);
export default CateringMenu;
