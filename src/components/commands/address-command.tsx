import type { CustomerSearchResult } from '@/lib/types/customer';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '../ui/command';

type AddressCommandProps = {
  customers?: CustomerSearchResult[] | null;
  setShowAutocomplete: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCustomer: (customer: CustomerSearchResult) => void;
};

const AddressCommand = ({
  customers,
  setShowAutocomplete,
  setSelectedCustomer,
}: AddressCommandProps) => {
  return (
    <Command className="absolute top-full left-0 z-50 mt-1 h-fit max-h-40 w-full rounded-md border bg-white shadow-md">
      <CommandList>
        <CommandEmpty>No address found.</CommandEmpty>
        <CommandGroup>
          {customers?.map((customer) => (
            <CommandItem
              className="flex-col items-start justify-start gap-1"
              key={customer.address._id.toString()}
              onSelect={() => {
                setSelectedCustomer(customer);
                setShowAutocomplete(false);
              }}
            >
              <span>
                {customer.firstName} {customer.lastName}
              </span>
              <p className="text-muted-foreground text-xs">
                {customer.address.address}
              </p>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default AddressCommand;
