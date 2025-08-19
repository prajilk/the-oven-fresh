import type mongoose from 'mongoose';
import type { CateringCategoryDocument } from './catering-category';

export type CateringMenuDocument = {
  _id: string;
  category: mongoose.Schema.Types.ObjectId;
  name: string;
  smallPrice?: number;
  smallServingSize?: string;
  mediumPrice?: number;
  mediumServingSize?: string;
  largePrice?: number;
  largeServingSize?: string;
  variant: string | null;
  image: string | null;
  publicId: string | null;
  disabled: boolean;
};

export interface CateringMenuDocumentPopulate
  extends Omit<CateringMenuDocument, 'category'> {
  category: CateringCategoryDocument;
}
