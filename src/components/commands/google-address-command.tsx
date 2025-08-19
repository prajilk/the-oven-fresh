import type { PlaceAutocompleteResult } from '@googlemaps/google-maps-services-js';
import { MapPin } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '../ui/command';

type GoogleAddressCommandProps = {
  addresses: PlaceAutocompleteResult[];
  setSelectedAddress: (address: PlaceAutocompleteResult) => void;
};

const GoogleAddressCommand = ({
  addresses,
  setSelectedAddress,
}: GoogleAddressCommandProps) => {
  return (
    <Command className="absolute top-full left-0 z-50 mt-1 h-fit max-h-56 w-full rounded-md border bg-white shadow-md">
      <CommandList>
        <CommandEmpty>No address found.</CommandEmpty>
        <CommandGroup>
          {addresses?.map((address) => (
            <CommandItem
              className="items-center justify-start gap-2 py-2.5"
              key={address.place_id}
              onSelect={() => setSelectedAddress(address)}
            >
              <MapPin className="size-4 text-primary/40" />
              <span>{address.description}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default GoogleAddressCommand;
