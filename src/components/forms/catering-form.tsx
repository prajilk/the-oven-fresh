'use client';

import type { PlaceAutocompleteResult } from '@googlemaps/google-maps-services-js';
import { Typography } from '@mui/material';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import type * as z from 'zod';
import { useSearchAddress } from '@/api-hooks/use-search-address';
import { useSearchCustomer } from '@/api-hooks/use-search-customer';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useClickOutside } from '@/hooks/use-click-outside';
import { useDebounce } from '@/hooks/use-debounce';
import type { CustomerSearchResult } from '@/lib/types/customer';
import { cn } from '@/lib/utils';
import type { ZodCateringSchema } from '@/lib/zod-schema/schema';
import type { RootState } from '@/store';
import {
  setCustomerDetails,
  setDeliveryDate,
  setOrderType,
} from '@/store/slices/catering-order-slice';
import AddressAutocomplete from '../address-autocomplete';
import AddressCommand from '../commands/address-command';
import OrderTypeSelect from '../select/order-type-select';
import PaymentSelect from '../select/payment-select';
import { Textarea } from '../ui/textarea';

export default function CateringForm({
  form,
}: {
  form: UseFormReturn<z.infer<typeof ZodCateringSchema>>;
}) {
  const clickOutsideRef = useRef(null);
  const [phone, setPhone] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const dispatch = useDispatch();
  const orderDetail = useSelector((state: RootState) => state.cateringOrder);

  const debouncedPhone = useDebounce(phone, 300);
  const debouncedAddress = useDebounce(
    orderDetail.customerDetails.address.address,
    500
  );

  // React queries
  const { data: customers } = useSearchCustomer(debouncedPhone);
  const { data: addressPredictions } = useSearchAddress({
    address: debouncedAddress,
    key: orderDetail.customerDetails.address.key,
  });

  // Automatically toggle showAutocomplete when customers update
  useEffect(() => {
    setShowAutocomplete((customers?.length ?? 0) > 0);
  }, [customers]);

  useClickOutside(clickOutsideRef, () => setShowAutocomplete(false));

  function setSelectedAddress(address: PlaceAutocompleteResult) {
    dispatch(
      setCustomerDetails({
        address: { address: address.description, key: 0 },
        placeId: address.place_id,
      })
    );
    form.setValue('customerDetails.address', address.description || '');
    form.setValue('customerDetails.lat', 0);
    form.setValue('customerDetails.lng', 0);
  }

  function setSelectedCustomer(customer: CustomerSearchResult) {
    dispatch(
      setCustomerDetails({
        phone: customer.phone || '',
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        address: { address: customer.address.address || '', key: 0 },
        placeId: customer.address.placeId,
        aptSuiteUnit: customer.address.aptSuiteUnit || '',
      })
    );

    form.setValue('customerDetails.phone', customer.phone || '');
    form.setValue('customerDetails.firstName', customer.firstName || '');
    form.setValue('customerDetails.lastName', customer.lastName || '');
    form.setValue('customerDetails.address', customer.address.address || '');
    form.setValue('customerDetails.lat', customer.address.lat);
    form.setValue('customerDetails.lng', customer.address.lng);
    form.setValue(
      'customerDetails.aptSuiteUnit',
      customer.address.aptSuiteUnit
    );
  }

  function resetForm() {
    form.reset();
    setPhone('');
  }

  return (
    <div className="mx-auto w-full rounded-md border p-5 shadow md:w-fit md:p-10">
      <Form {...form}>
        <div className="flex items-center justify-between">
          <Typography variant="h6">Enter Address</Typography>
          <Button onClick={resetForm} size="sm" type="button" variant={'ghost'}>
            Reset
          </Button>
        </div>
        <form className="mx-auto max-w-3xl space-y-4 py-7 lg:py-10">
          <div>
            <FormField
              control={form.control}
              name="customerDetails.phone"
              render={({ field }) => (
                <FormItem className="flex h-full flex-col items-start justify-between">
                  <FormLabel>Phone number</FormLabel>
                  <FormControl className="w-full">
                    <div className="relative" ref={clickOutsideRef}>
                      <PhoneInput
                        placeholder="phone"
                        {...field}
                        defaultCountry="CA"
                        onChange={(e) => {
                          field.onChange(e);
                          setPhone(e);
                          dispatch(
                            setCustomerDetails({
                              phone: e,
                            })
                          );
                        }}
                      />
                      {showAutocomplete && (
                        <AddressCommand
                          customers={customers}
                          setSelectedCustomer={setSelectedCustomer}
                          setShowAutocomplete={setShowAutocomplete}
                        />
                      )}
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <FormField
                control={form.control}
                name="customerDetails.firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="first name"
                        type="text"
                        {...field}
                        onChange={(e) => {
                          dispatch(
                            setCustomerDetails({
                              firstName: e.target.value,
                            })
                          );
                          form.setValue(
                            'customerDetails.firstName',
                            e.target.value
                          );
                        }}
                        value={orderDetail.customerDetails.firstName}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="customerDetails.lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="last name"
                        type="text"
                        {...field}
                        onChange={(e) => {
                          dispatch(
                            setCustomerDetails({
                              lastName: e.target.value,
                            })
                          );
                          form.setValue(
                            'customerDetails.lastName',
                            e.target.value
                          );
                        }}
                        value={orderDetail.customerDetails.lastName}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="customerDetails.address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <AddressAutocomplete
                    addresses={addressPredictions ?? []}
                    setSelectedAddress={setSelectedAddress}
                  >
                    <Textarea
                      placeholder="address"
                      {...field}
                      onChange={(e) => {
                        dispatch(
                          setCustomerDetails({
                            address: {
                              address: e.target.value,
                              key: 1,
                            },
                          })
                        );
                        form.setValue(
                          'customerDetails.address',
                          e.target.value
                        );
                      }}
                      value={orderDetail.customerDetails.address.address}
                    />
                  </AddressAutocomplete>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerDetails.aptSuiteUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apt, suite or unit</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Apt, suite or unit"
                    type="text"
                    {...field}
                    onChange={(e) => {
                      dispatch(
                        setCustomerDetails({
                          aptSuiteUnit: e.target.value,
                        })
                      );
                      form.setValue(
                        'customerDetails.aptSuiteUnit',
                        e.target.value
                      );
                    }}
                    value={orderDetail.customerDetails.aptSuiteUnit}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deliveryDate"
            render={({ field }) => (
              <FormItem className="flex h-full flex-col justify-between">
                <FormLabel>Delivery date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                        variant={'outline'}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      disabled={{ before: new Date() }}
                      initialFocus
                      mode="single"
                      onSelect={(e) => {
                        field.onChange(e);
                        dispatch(
                          setDeliveryDate(format(e as Date, 'yyyy-MM-dd'))
                        );
                      }}
                      selected={field.value}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payment_method"
            render={() => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <PaymentSelect form={form} />
                <FormDescription>Select a payment method</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="order_type"
            render={() => (
              <FormItem>
                <FormLabel>Order Type</FormLabel>
                <OrderTypeSelect
                  onValueChange={(val: 'pickup' | 'delivery') => {
                    dispatch(setOrderType(val));
                    form.setValue('order_type', val);
                  }}
                  value={form.watch('order_type')}
                />
                <FormDescription>Select a order type</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
