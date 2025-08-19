'use server';

import { Client } from '@googlemaps/google-maps-services-js';

const client = new Client();
export const autocomplete = async (input: string) => {
  if (input.length < 3) {
    return [];
  }

  try {
    const response = await client.placeAutocomplete({
      params: {
        input,
        key: process.env.GOOGLE_API_KEY || '',
      },
    });

    return response.data.predictions;
  } catch {
    return null;
  }
};

type AddressComponents = {
  street_number?: string;
  street?: string;
  city?: string;
  province?: string;
  zipCode?: string;
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <Ignore>
export const getPlaceDetails = async (placeID: string) => {
  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeID,
        key: process.env.GOOGLE_API_KEY || '',
      },
    });

    const result = response.data.result;
    if (!(result?.geometry && result.address_components)) {
      return null;
    }

    // Extract the required information
    const lat = result.geometry.location.lat;
    const lng = result.geometry.location.lng;

    const addressComponents: AddressComponents = {};

    // Loop through address components to find the relevant fields
    for (const component of result.address_components) {
      // TypeScript needs type assertion here
      const types = component.types as string[];

      if (types.includes('street_number')) {
        addressComponents.street_number = component.long_name;
      }
      if (types.includes('route')) {
        addressComponents.street =
          (addressComponents.street_number
            ? `${addressComponents.street_number} `
            : '') + component.long_name;
      }
      if (types.includes('locality')) {
        addressComponents.city = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        addressComponents.province = component.long_name;
      }
      if (types.includes('postal_code')) {
        addressComponents.zipCode = component.long_name;
      }
    }

    return {
      lat,
      lng,
      ...addressComponents,
    };
  } catch {
    return null;
  }
};
