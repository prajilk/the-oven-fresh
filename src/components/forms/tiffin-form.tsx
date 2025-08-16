"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { calculateEndDate, calculateTotalAmount, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { format } from "date-fns";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { TiffinConfirmDrawer } from "../drawer/tiffin/tiffin-confirm-drawer";
import { ZodTiffinSchema } from "@/lib/zod-schema/schema";
import { useCreateTiffinOrder } from "@/api-hooks/tiffin/create-order";
import { QueryClient } from "@tanstack/react-query";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useSearchCustomer } from "@/api-hooks/use-search-customer";
import { CustomerSearchResult } from "@/lib/types/customer";
import { useDebounce } from "@/hooks/use-debounce";
import { useTiffinMenu } from "@/api-hooks/tiffin/get-tiffin-menu";
import PaymentSelect from "../select/payment-select";
import TiffinWeeksSelect from "../select/tiffin-weeks-select";
import AddressCommand from "../commands/address-command";
import OrderTypeSelect from "../select/order-type-select";
import { Textarea } from "../ui/textarea";
import { useSearchAddress } from "@/api-hooks/use-search-address";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import AddressAutocomplete from "../address-autocomplete";

export default function TiffinForm() {
    const [confirmOrderOpen, setConfirmOrderOpen] = useState(false);
    const clickOutsidePhoneRef = useRef(null);
    const [phone, setPhone] = useState("");
    const [addressInput, setAddressInput] = useState({ address: "", key: 0 });
    const [address, setAddress] = useState({ address: "", placeId: "" });
    const [showPhoneAutocomplete, setShowPhoneAutocomplete] = useState(false);
    const [endDateText, setEndDateText] = useState("");
    const [sentToWhatsapp, setSentToWhatsapp] = useState(false);

    const form = useForm<z.infer<typeof ZodTiffinSchema>>({
        resolver: zodResolver(ZodTiffinSchema),
        defaultValues: {
            start_date: new Date().toDateString(),
            payment_method: "cash",
            number_of_weeks: "2",
            order_type: "pickup",
            advancePaid: "",
            pendingAmount: "",
            discount: "",
            customerDetails: {
                address: "",
                firstName: "",
                lastName: "",
                phone: "",
                aptSuiteUnit: "",
                lat: 0,
                lng: 0,
            },
            note: "",
            tax: 0,
        },
    });

    function onSuccess(queryClient: QueryClient) {
        queryClient.invalidateQueries({ queryKey: ["order", "tiffin"] });
        toast.success("Order created successfully!");
        setConfirmOrderOpen(false);
        resetForm();
    }

    const debouncedPhone = useDebounce(phone, 300);
    const debouncedAddress = useDebounce(addressInput.address, 500);

    // React queries
    const mutation = useCreateTiffinOrder(onSuccess);
    const { data: customers } = useSearchCustomer(debouncedPhone);
    const { data: addressPredictions } = useSearchAddress({
        address: debouncedAddress,
        key: addressInput.key,
    });
    const { data: tiffinMenu, error, isPending } = useTiffinMenu();

    function onSubmit(values: z.infer<typeof ZodTiffinSchema>) {
        const total = Number(form.getValues("totalAmount"));
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_AMOUNT || 0);

        const subtotal = (total * 100) / (100 + taxRate);

        if (!address.placeId) {
            return toast.error("Please select a valid address!");
        }

        mutation.mutate({
            values: {
                ...values,
                totalAmount:
                    values.tax === 0 ? subtotal.toString() : values.totalAmount,
            },
            googleAddress: address,
            sentToWhatsapp,
        });
    }

    const number_of_weeks = form.getValues("number_of_weeks");
    const order_type = form.getValues("order_type");

    useEffect(() => {
        const { tax, total } = calculateTotalAmount(form, tiffinMenu);

        form.setValue("totalAmount", total.toString());
        form.setValue("tax", tax);
    }, [form, tiffinMenu, number_of_weeks, order_type]);

    useEffect(() => {
        // set default value for end date
        calculateEndDate("2", form, setEndDateText);
    }, [form]);

    // Automatically toggle showPhoneAutocomplete when customers update
    useEffect(() => {
        setShowPhoneAutocomplete((customers?.length ?? 0) > 0);
    }, [customers]);

    function resetForm() {
        form.reset();
        calculateEndDate(
            form.getValues("number_of_weeks"),
            form,
            setEndDateText
        );
        const { total } = calculateTotalAmount(form, tiffinMenu);
        form.setValue("totalAmount", total.toString());
        setPhone("");
        setAddressInput({ address: "", key: 0 });
        setAddress({ address: "", placeId: "" });
    }

    useClickOutside(clickOutsidePhoneRef, () => {
        setShowPhoneAutocomplete(false);
    });

    function setSelectedAddress(address: PlaceAutocompleteResult) {
        setAddress({
            address: address.description,
            placeId: address.place_id,
        });
        setAddressInput({ address: address.description, key: 0 });
        form.setValue("customerDetails.lat", 0);
        form.setValue("customerDetails.lng", 0);
        form.setValue("customerDetails.address", address.description);
    }

    function setSelectedCustomer(customer: CustomerSearchResult) {
        form.setValue("customerDetails.phone", customer.phone || "");
        form.setValue("customerDetails.firstName", customer.firstName || "");
        form.setValue("customerDetails.lastName", customer.lastName || "");
        form.setValue(
            "customerDetails.address",
            customer.address.address || "",
            {
                shouldValidate: true,
            }
        );
        form.setValue("customerDetails.lat", customer.address.lat);
        form.setValue("customerDetails.lng", customer.address.lng);
        form.setValue(
            "customerDetails.aptSuiteUnit",
            customer.address.aptSuiteUnit || ""
        );
        setAddressInput({ address: customer.address.address || "", key: 0 });
        setAddress({
            address: customer.address.address || "",
            placeId: customer.address.placeId,
        });
    }

    if (error) {
        toast.error(error.message);

        return (
            <div className="flex flex-col justify-center">
                <span>Unable to fetch menu, Please try again.</span>
                <span>Error: {error.message}</span>
                {/* @ts-expect-error: error.response.data.message doesn't exist */}
                <span>Error: {error.response.data.message}</span>
            </div>
        );
    }

    if (isPending)
        return (
            <div className="flex flex-col justify-center items-center gap-2 h-96">
                <Loader2 className="text-primary animate-spin" />
                <span>Loading...</span>
            </div>
        );

    return (
        <div className="rounded-md border shadow w-full md:w-fit p-5 md:p-10 mx-auto">
            <Form {...form}>
                <div className="flex justify-between items-center">
                    <Typography variant="h6">Tiffin Booking</Typography>
                    <Button
                        onClick={resetForm}
                        type="button"
                        size="sm"
                        variant={"ghost"}
                    >
                        Reset
                    </Button>
                </div>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 max-w-3xl mx-auto py-7 lg:py-10"
                    id="tiffin-form"
                >
                    <div>
                        <FormField
                            control={form.control}
                            name="customerDetails.phone"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-start justify-between h-full">
                                    <FormLabel>Phone number</FormLabel>
                                    <FormControl className="w-full">
                                        <div
                                            className="relative"
                                            ref={clickOutsidePhoneRef}
                                        >
                                            <PhoneInput
                                                placeholder="phone"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setPhone(e);
                                                }}
                                                defaultCountry="CA"
                                            />
                                            {showPhoneAutocomplete && (
                                                <AddressCommand
                                                    customers={customers}
                                                    setShowAutocomplete={
                                                        setShowPhoneAutocomplete
                                                    }
                                                    setSelectedCustomer={
                                                        setSelectedCustomer
                                                    }
                                                />
                                            )}
                                        </div>
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="customerDetails.address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Street Address</FormLabel>
                                <FormControl>
                                    <AddressAutocomplete
                                        addresses={addressPredictions ?? []}
                                        setSelectedAddress={setSelectedAddress}
                                    >
                                        <Textarea
                                            placeholder="address"
                                            {...field}
                                            value={addressInput.address}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setAddressInput({
                                                    address: e.target.value,
                                                    key: 1,
                                                });
                                            }}
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
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 !mt-4 lg:mt-auto">
                        <div>
                            <FormField
                                control={form.control}
                                name="start_date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col h-full justify-between">
                                        <FormLabel>Start date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "pl-3 text-left font-normal",
                                                            !field.value &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(
                                                                field.value,
                                                                "PPP"
                                                            )
                                                        ) : (
                                                            <span>
                                                                Pick a date
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={
                                                        new Date(field.value)
                                                    }
                                                    disabled={[
                                                        { dayOfWeek: [0, 6] },
                                                        { before: new Date() },
                                                    ]}
                                                    onSelect={(e) => {
                                                        field.onChange(
                                                            e?.toDateString()
                                                        );
                                                        calculateEndDate(
                                                            form.getValues(
                                                                "number_of_weeks"
                                                            ),
                                                            form,
                                                            setEndDateText
                                                        );
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="number_of_weeks"
                                render={() => (
                                    <FormItem className="relative">
                                        <FormLabel>Number of weeks</FormLabel>
                                        <FormControl>
                                            <TiffinWeeksSelect
                                                form={form}
                                                setEndDateText={setEndDateText}
                                            />
                                        </FormControl>
                                        <span className="text-xs text-muted-foreground mt-1 absolute">
                                            {endDateText}
                                        </span>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <FormField
                        control={form.control}
                        name="payment_method"
                        render={() => (
                            <FormItem className="pt-3 md:pt-0">
                                <FormLabel>Payment Method</FormLabel>
                                <PaymentSelect form={form} />
                                <FormDescription>
                                    Select a payment method
                                </FormDescription>
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
                                    value={form.watch("order_type")}
                                    onValueChange={(
                                        val: "pickup" | "delivery"
                                    ) => {
                                        form.setValue("order_type", val);
                                    }}
                                />
                                <FormDescription>
                                    Select a order type
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <TiffinConfirmDrawer
                        // @ts-expect-error: mutation type doesn't match UseMutationResult type
                        mutation={mutation}
                        form={form}
                        open={confirmOrderOpen}
                        setOpen={setConfirmOrderOpen}
                        tiffinMenu={tiffinMenu}
                        setSentToWhatsapp={setSentToWhatsapp}
                    />
                </form>
            </Form>
        </div>
    );
}
