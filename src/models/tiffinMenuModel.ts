import { model, models, Schema } from 'mongoose';
import type { TiffinMenuDocument } from './types/tiffin-menu';

const TiffinMenuSchema = new Schema<TiffinMenuDocument>(
  {
    // store: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Store",
    //     required: true,
    //     unique: true,
    // },
    pickup: {
      '2_weeks': Number,
      '3_weeks': Number,
      '4_weeks': Number,
    },
    delivery: {
      '2_weeks': Number,
      '3_weeks': Number,
      '4_weeks': Number,
    },
  },
  { versionKey: false, timestamps: true }
);

const TiffinMenu =
  models?.TiffinMenu ||
  model<TiffinMenuDocument>('TiffinMenu', TiffinMenuSchema);
export default TiffinMenu;
