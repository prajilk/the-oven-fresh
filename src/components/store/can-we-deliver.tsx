'use client';

import type { PlaceAutocompleteResult } from '@googlemaps/google-maps-services-js';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { getStoreCoordinatesAction } from '@/actions/get-store-coor-action';
import { useStores } from '@/api-hooks/stores/get-stores';
import { useSearchAddress } from '@/api-hooks/use-search-address';
import { useDebounce } from '@/hooks/use-debounce';
import type { RootState } from '@/store';
import AddressAutocomplete from '../address-autocomplete';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

const ReadOnlyMap = dynamic(() => import('./read-only-map'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const CanWeDeliver = () => {
  const [addressInput, setAddressInput] = useState({
    address: '',
    key: 0,
  });
  const [position, setPosition] = useState<number[] | null>(null);

  const { data: stores, isPending } = useStores();
  const currentStore = useSelector((state: RootState) => state.selectStore);
  const selectedStore = stores?.find((store) => store._id === currentStore);
  const debouncedAddress = useDebounce(addressInput.address, 500);

  const { data: addressPredictions } = useSearchAddress({
    address: debouncedAddress,
    key: addressInput.key,
  });

  function setSelectedAddress(selectedAddress: PlaceAutocompleteResult) {
    setAddressInput({ address: selectedAddress.description, key: 0 });

    // Call api to get coordinates
    const promise = async () => {
      const result = await getStoreCoordinatesAction(selectedAddress.place_id);

      if (result.success) {
        setPosition([result.lat, result.lng]);
        return result; // resolves
      }
      throw result; // rejects
    };

    toast.promise(promise(), {
      loading: 'Fetching coordinates...',
      success: () => 'Coordinates fetched successfully.',
      error: ({ error }) => (error ? error : 'Failed to fetch coordinates.'),
    });
  }

  if (!selectedStore) {
    return null;
  }

  if (isPending) {
    <div className="flex h-32 flex-col items-center justify-center">
      <Loader2 className="animate-spin" />
      <span>Loading...</span>
    </div>;
  }
  return (
    <Card>
      <CardHeader className="px-3 md:px-6">
        <CardTitle>Can We Deliver?</CardTitle>
        <CardDescription>
          Enter the delivery address to see if we can deliver.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 px-3 md:px-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="col-span-3 space-y-1">
            <Label className="text-base" htmlFor="address">
              Enter delivery Address
            </Label>
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
          <ul className="ms-auto mt-auto">
            <li className="flex items-center gap-2">
              <div className="flex w-[20px] items-center justify-center">
                <Image
                  alt="marker"
                  height={20}
                  src={'/leaflet/store.svg'}
                  width={20}
                />
              </div>
              <span className="text-xs">Store</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="flex w-[20px] items-center justify-center">
                <Image
                  alt="marker"
                  height={13}
                  src={'/leaflet/marker-icon.png'}
                  width={13}
                />
              </div>
              <span className="text-xs">Delivery Point</span>
            </li>
          </ul>
        </div>
        <div className="h-fit w-full rounded-md border">
          <ReadOnlyMap
            addressLocation={position as [number, number]}
            storeLocation={[selectedStore.lat, selectedStore.lng]}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CanWeDeliver;
