export type StoreDocument = {
  _id: string;
  name: string;
  address: string;
  placeId: string;
  location: string;
  lat: number;
  lng: number;
  phone?: string;
  dividerLine: {
    start: {
      lat: number;
      lng: number;
    };
    end: {
      lat: number;
      lng: number;
    };
  };
};
