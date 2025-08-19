import type { AddressDocument } from '@/models/types/address';
import type { CustomerDocument } from '@/models/types/customer';

export type CustomerSearchResult = CustomerDocument & {
  address: AddressDocument;
};
