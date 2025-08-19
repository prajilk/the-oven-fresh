'use client';

import type { PlaceAutocompleteResult } from '@googlemaps/google-maps-services-js';
import { Button } from '@heroui/button';
import { Alert } from '@mui/material';
import { format } from 'date-fns';
import { CalendarIcon, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { editAddressAction } from '@/actions/edit-address-action';
import { useSearchAddress } from '@/api-hooks/use-search-address';
import { Button as ShadButton } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import type { AddressDocument } from '@/models/types/address';
import AddressAutocomplete from '../address-autocomplete';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';

function isGapInWeeks(
  startDate: Date,
  endDate: Date,
  numberOfWeeks: number
): boolean {
  // Calculate the difference in milliseconds
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const actualGapInMilliseconds =
    new Date(format(endDate, 'yyyy-MM-dd')).getTime() -
    new Date(format(startDate, 'yyyy-MM-dd')).getTime();

  // Calculate the actual number of days between the two dates
  const actualGapInDays = actualGapInMilliseconds / millisecondsInDay;

  // Check if the gap in days is exactly the expected number of weeks (numberOfWeeks * 7 days)
  return actualGapInDays === numberOfWeeks * 7 - 3;
}

const EditAddressDialog = ({
  orderId,
  orderType,
  address,
  deliveryDate,
  startDate,
  endDate,
  numberOfWeeks,
  type,
}: {
  orderId: string;
  orderType: 'catering' | 'tiffin';
  address: AddressDocument;
  numberOfWeeks?: number;
  deliveryDate?: Date;
  startDate?: Date;
  endDate?: Date;
  type?: 'pickup' | 'delivery';
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <Ignore>
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addressInput, setAddressInput] = useState({
    address: address.address,
    key: 0,
  });
  const [placeId, setPlaceId] = useState<string>(address.placeId);
  const [order_type, setOrder_Type] = useState(type);
  const [dDate, setDDate] = useState<Date | undefined>(deliveryDate);
  const [sDate, setSDate] = useState<Date | undefined>(startDate);
  const [eDate, setEDate] = useState<Date | undefined>(new Date(endDate || ''));

  useEffect(() => {
    setEDate(endDate);
  }, [endDate]);

  const debouncedAddress = useDebounce(addressInput.address, 500);

  const { data: addressPredictions } = useSearchAddress({
    address: debouncedAddress,
    key: addressInput.key,
  });

  const handleSubmit = (formData: FormData) => {
    formData.append('orderId', orderId);
    formData.append('orderType', orderType);
    formData.append('addressId', address._id.toString());
    formData.append('customerId', address.customerId.toString());
    formData.append('lat', address.lat.toString());
    formData.append('lng', address.lng.toString());

    if (dDate) {
      formData.append('deliveryDate', dDate.toString());
    }
    if (sDate) {
      formData.append('startDate', sDate.toString());
    }
    if (eDate) {
      formData.append('endDate', eDate.toString());
    }
    if (order_type) {
      formData.append('order_type', order_type);
    }

    setLoading(true);

    const promise = async () => {
      const result = await editAddressAction(formData);
      setLoading(false);
      setOpen(false);
      if (result.success) {
        return result;
      }
      throw result;
    };

    toast.promise(promise(), {
      loading: 'Updating delivery address...',
      success: () => 'Delivery address updated successfully.',
      error: () => 'Failed to update delivery address.',
    });
  };

  function resetDate() {
    setDDate(deliveryDate);
    setSDate(startDate);
    setEDate(endDate);
    setOpen(false);
  }

  function setSelectedAddress(selectedAddress: PlaceAutocompleteResult) {
    setAddressInput({ address: selectedAddress.description, key: 0 });
    setPlaceId(selectedAddress.place_id);
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button isIconOnly radius="full" size="sm" variant="flat">
          <Pencil size={15} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit delivery address</DialogTitle>
        </DialogHeader>
        <form
          action={handleSubmit}
          className="grid gap-4 py-4"
          id="edit-address-form"
        >
          <div className="grid grid-cols-4 gap-2">
            <Label htmlFor="address">Address</Label>
            <AddressAutocomplete
              addresses={addressPredictions || []}
              className="col-span-3"
              setSelectedAddress={setSelectedAddress}
            >
              <Textarea
                id="address"
                name="address"
                onChange={(e) =>
                  setAddressInput({
                    address: e.target.value,
                    key: 1,
                  })
                }
                value={addressInput.address}
              />
            </AddressAutocomplete>
          </div>
          <input hidden name="placeId" readOnly value={placeId} />
          <div className="grid grid-cols-4 gap-2">
            <Label htmlFor="aptSuiteUnit">Apt, suite or unit</Label>
            <Input
              className="col-span-3"
              defaultValue={address.aptSuiteUnit}
              id="aptSuiteUnit"
              name="aptSuiteUnit"
              placeholder="Apt, suite or unit"
            />
          </div>
          {orderType === 'catering' ? (
            <div className="grid grid-cols-4 gap-2">
              <Label htmlFor="deliveryDate">Delivery Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <ShadButton
                    className={cn(
                      'col-span-3 w-full pl-3 text-left font-normal',
                      !dDate && 'text-muted-foreground'
                    )}
                    type="button"
                    variant={'outline'}
                  >
                    {dDate ? format(dDate, 'PPP') : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </ShadButton>
                </PopoverTrigger>
                <PopoverContent align="start" className="z-[1560] w-auto p-0">
                  <Calendar
                    disabled={{ before: new Date() }}
                    id="deliveryDate"
                    initialFocus
                    mode="single"
                    onSelect={(e) => setDDate(e as Date)}
                    required
                    selected={dDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <ShadButton
                      className={cn(
                        'col-span-3 w-full pl-3 text-left font-normal',
                        !sDate && 'text-muted-foreground'
                      )}
                      type="button"
                      variant={'outline'}
                    >
                      {sDate ? format(sDate, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </ShadButton>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="z-[1560] w-auto p-0">
                    <Calendar
                      defaultMonth={
                        new Date(
                          new Date(sDate || '')?.getFullYear() ||
                            new Date().getFullYear(),
                          new Date(sDate || '')?.getMonth() ||
                            new Date().getMonth(),
                          new Date(sDate || '')?.getDate() ||
                            new Date().getDate()
                        )
                      }
                      disabled={{ dayOfWeek: [0, 6] }}
                      id="startDate"
                      initialFocus
                      mode="single"
                      onSelect={(e) => setSDate(e as Date)}
                      required
                      selected={
                        new Date(
                          new Date(sDate || '')?.getFullYear() ||
                            new Date().getFullYear(),
                          new Date(sDate || '')?.getMonth() ||
                            new Date().getMonth(),
                          new Date(sDate || '')?.getDate() ||
                            new Date().getDate()
                        )
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <ShadButton
                      className={cn(
                        'col-span-3 w-full pl-3 text-left font-normal',
                        !eDate && 'text-muted-foreground'
                      )}
                      type="button"
                      variant={'outline'}
                    >
                      {eDate ? format(eDate, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </ShadButton>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="z-[1560] w-auto p-0">
                    <Calendar
                      defaultMonth={
                        new Date(
                          new Date(eDate || '')?.getFullYear() ||
                            new Date().getFullYear(),
                          new Date(eDate || '')?.getMonth() ||
                            new Date().getMonth(),
                          new Date(eDate || '')?.getDate() ||
                            new Date().getDate()
                        )
                      }
                      footer={<p>You picker {format(eDate as Date, 'PP')}</p>}
                      id="endDate"
                      initialFocus
                      mode="single"
                      onSelect={(e) => setEDate(e)}
                      required
                      selected={
                        new Date(
                          new Date(eDate || '')?.getFullYear() ||
                            new Date().getFullYear(),
                          new Date(eDate || '')?.getMonth() ||
                            new Date().getMonth(),
                          new Date(eDate || '')?.getDate() ||
                            new Date().getDate()
                        )
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {!isGapInWeeks(
                new Date(sDate || ''),
                new Date(eDate || ''),
                numberOfWeeks || 0
              ) && (
                <Alert severity="error">
                  The dates do not match the {numberOfWeeks} weeks gap.
                </Alert>
              )}
            </>
          )}
          {orderType === 'catering' && type && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="order_type">
                Order Type
              </Label>
              <Select
                onValueChange={(value) =>
                  setOrder_Type(value as 'pickup' | 'delivery')
                }
                value={order_type}
              >
                <SelectTrigger className="col-span-3" id="order_type">
                  <SelectValue placeholder="order type" />
                </SelectTrigger>
                <SelectContent className="z-[1560]">
                  <SelectItem value="pickup">Pickup</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </form>
        <DialogFooter>
          <ShadButton
            disabled={loading}
            onClick={resetDate}
            type="button"
            variant={'ghost'}
          >
            Cancel
          </ShadButton>
          <ShadButton
            disabled={
              loading ||
              (orderType === 'tiffin' &&
                !isGapInWeeks(
                  new Date(sDate || ''),
                  new Date(eDate || ''),
                  numberOfWeeks || 0
                ))
            }
            form="edit-address-form"
            type="submit"
          >
            Save changes
          </ShadButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAddressDialog;
