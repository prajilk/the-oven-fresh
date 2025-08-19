import { model, models, Schema } from 'mongoose';
import type { SettingsDocument } from './types/setting';

const SettingsSchema = new Schema<SettingsDocument>(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
      unique: true,
    },
    disable_sending_proof: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

const Setting =
  models?.Setting || model<SettingsDocument>('Setting', SettingsSchema);
export default Setting;
