import type mongoose from 'mongoose';

export type DeliveryImageDocument = {
  order: mongoose.Schema.Types.ObjectId;
  store: mongoose.Schema.Types.ObjectId;
  user: string;
  deliveryDate: Date;
  messageStatus: string;
  image: string;
  publicId: string;
};
