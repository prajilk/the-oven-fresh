'use client';

import type { PlaceAutocompleteResult } from '@googlemaps/google-maps-services-js';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { editStoreAction } from '@/actions/edit-store-action';
import { getStoreCoordinatesAction } from '@/actions/get-store-coor-action';
import { useSearchAddress } from '@/api-hooks/use-search-address';
import { useDebounce } from '@/hooks/use-debounce';
import { ZodStoreSchema } from '@/lib/zod-schema/schema';
import type { StoreDocument } from '@/models/types/store';
import AddressAutocomplete from '../address-autocomplete';
import { CardContent, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import LoadingButton from '../ui/loading-button';
import { Textarea } from '../ui/textarea';

const RenderMap = dynamic(() => import('../store/render-map'), {
  ssr: false,
});

const EditStoreForm = ({ store }: { store: StoreDocument }) => {
  const [loading, setLoading] = useState(false);
  const [placeId, setPlaceId] = useState(store.placeId);
  const [addressInput, setAddressInput] = useState({
    address: store.address,
    key: 0,
  });
  const [mapReady, setMapReady] = useState(false);
  const [position, setPosition] = useState<number[] | null>([
    store.lat,
    store.lng,
  ]);
  const [points, setPoints] = useState<L.LatLngExpression[]>([
    [store.dividerLine.start.lat, store.dividerLine.start.lng],
    [store.dividerLine.end.lat, store.dividerLine.end.lng],
  ]);
  const [lines, setLines] = useState<
    { start: number[]; end: number[] } | undefined
  >({
    start: [store.dividerLine.start.lat, store.dividerLine.start.lng],
    end: [store.dividerLine.end.lat, store.dividerLine.end.lng],
  });

  // Initialize map with default position
  useEffect(() => {
    // This ensures the map component is only rendered on the client
    setMapReady(true);
  }, []);

  const debouncedAddress = useDebounce(addressInput.address, 500);

  const { data: addressPredictions } = useSearchAddress({
    address: debouncedAddress,
    key: addressInput.key,
  });

  function handleSubmit(formData: FormData) {
    setLoading(true);

    const data = Object.fromEntries(formData);
    const dividerLine = {
      start: {
        lat: lines?.start[0],
        lng: lines?.start[1],
      },
      end: {
        lat: lines?.end[0],
        lng: lines?.end[1],
      },
    };

    const result = ZodStoreSchema.safeParse({
      ...data,
      dividerLine,
      lat: position?.[0],
      lng: position?.[1],
      placeId,
    });

    if (!result.success) {
      toast.error('Invalid data format.');
      setLoading(false);
      return;
    }

    formData.set('placeId', placeId);
    formData.set('dividerLine', JSON.stringify(dividerLine));
    if (position) {
      formData.set('lat', position?.[0].toString());
      formData.set('lng', position?.[1].toString());
    }
    formData.set('id', store._id);

    const promise = async () => {
      const result = await editStoreAction(formData);
      setLoading(false);
      if (result.success) {
        return result;
      }
      throw result;
    };

    toast.promise(promise(), {
      loading: 'Creating store...',
      success: () => 'Store created successfully.',
      error: ({ error }) => (error ? error : 'Failed to create store.'),
    });
  }

  function setSelectedAddress(selectedAddress: PlaceAutocompleteResult) {
    setAddressInput({ address: selectedAddress.description, key: 0 });
    setPlaceId(selectedAddress.place_id);
    setLoading(true);

    // Call api to get coordinates
    const promise = async () => {
      const result = await getStoreCoordinatesAction(selectedAddress.place_id);
      setLoading(false);
      if (result.success) {
        setPoints([]);
        setLines(undefined);
        setPosition([result.lat, result.lng]);
        return result;
      }
      throw result;
    };

    toast.promise(promise(), {
      loading: 'Fetching store coordinates...',
      success: () => 'Store coordinates fetched successfully.',
      error: ({ error }) =>
        error ? error : 'Failed to fetch store coordinates.',
    });
  }

  function onLineSet({
    start,
    end,
  }: {
    start: [number, number];
    end: [number, number];
  }) {
    setLines({ start, end });
  }

  return (
    <form action={handleSubmit} id="edit-store-form">
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Store Name</Label>
            <Input
              defaultValue={store.name}
              name="name"
              placeholder="Enter store name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <AddressAutocomplete
              addresses={addressPredictions || []}
              setSelectedAddress={setSelectedAddress}
            >
              <Textarea
                name="address"
                onChange={(e) =>
                  setAddressInput({
                    address: e.target.value,
                    key: 1,
                  })
                }
                placeholder="Address"
                value={addressInput.address}
              />
            </AddressAutocomplete>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              defaultValue={store.phone}
              name="phone"
              placeholder="Phone (Optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              defaultValue={store.location}
              name="location"
              placeholder="eg: Scarborough"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Map</Label>
          <div className="h-[400px] w-full rounded-md border">
            {mapReady && (
              <RenderMap
                onLineSet={onLineSet}
                points={points}
                position={position}
                setPoints={setPoints}
              />
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <LoadingButton
          className="w-full"
          disabled={loading || !position || points.length < 2}
          isLoading={loading}
          type="submit"
        >
          Create Store
        </LoadingButton>
      </CardFooter>
    </form>
  );
};

export default EditStoreForm;
