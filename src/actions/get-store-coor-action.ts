'use server';

import { getPlaceDetails } from '@/lib/google';
import { withDbConnectAndActionAuth } from '@/lib/with-db-connect-and-auth';

export async function getStoreCoordinatesAction(placeId: string) {
  try {
    // Authorize the user
    await withDbConnectAndActionAuth();

    const location = await getPlaceDetails(placeId);
    if (!location) {
      return { error: 'Unable to get coordinates.' };
    }

    return { success: true, lat: location.lat, lng: location.lng };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unknown error occurred' };
  }
}
