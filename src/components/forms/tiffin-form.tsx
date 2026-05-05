"use client";

import type { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import { zodResolver } from "@hookform/resolvers/zod";
import { Typography } from "@mui/material";
import type { QueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";
import { useCreateTiffinOrder } from "@/api-hooks/tiffin/create-order";
import { useTiffinMenu } from "@/api-hooks/tiffin/get-tiffin-menu";
import { useSearchAddress } from "@/api-hooks/use-search-address";
import { useSearchCustomer } from "@/api-hooks/use-search-customer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useDebounce } from "@/hooks/use-debounce";
import type { CustomerSearchResult } from "@/lib/types/customer";
import { calculateEndDate, calculateTotalAmount, cn } from "@/lib/utils";
import { ZodTiffinSchema } from "@/lib/zod-schema/schema";
import AddressAutocomplete from "../address-autocomplete";
import AddressCommand from "../commands/address-command";
import { TiffinConfirmDrawer } from "../drawer/tiffin/tiffin-confirm-drawer";
import OrderTypeSelect from "../select/order-type-select";
import PaymentSelect from "../select/payment-select";
import TiffinWeeksSelect from "../select/tiffin-weeks-select";
import { Textarea } from "../ui/textarea";

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
            start_date: new Date(
                new Date().setDate(new Date().getDate() + 1)
            ).toDateString(),
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
            order_taken_by: "",
        },
    });

    function onSuccess(queryClient: QueryClient) {
        queryClient.invalidateQueries({ queryKey: ["order", "tiffin"] });
        queryClient.invalidateQueries({
            queryKey: ["order", "stats", "reminder"],
        });
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

        if (!address.placeId && values.order_type === "delivery") {
            return toast.error("Address is required for delivery orders");
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

    // biome-ignore lint/correctness/useExhaustiveDependencies: <Ignore>
    useEffect(() => {
        const { tax, total } = calculateTotalAmount(form, "0", tiffinMenu);

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
        const { total } = calculateTotalAmount(form, "0", tiffinMenu);
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

    if (isPending) {
        return (
            <div className="flex h-96 flex-col items-center justify-center gap-2">
                <Loader2 className="animate-spin text-primary" />
                <span>Loading...</span>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full rounded-md border p-5 shadow md:w-fit md:p-10">
            <Form {...form}>
                <div className="flex items-center justify-between">
                    <Typography variant="h6">Tiffin Booking</Typography>
                    <Button
                        onClick={resetForm}
                        size="sm"
                        type="button"
                        variant={"ghost"}
                    >
                        Reset
                    </Button>
                </div>
                <form
                    className="mx-auto max-w-3xl space-y-4 py-7 lg:py-10"
                    id="tiffin-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div>
                        <FormField
                            control={form.control}
                            name="customerDetails.phone"
                            render={({ field }) => (
                                <FormItem className="flex h-full flex-col items-start justify-between">
                                    <FormLabel>Phone number</FormLabel>
                                    <FormControl className="w-full">
                                        <div
                                            className="relative"
                                            ref={clickOutsidePhoneRef}
                                        >
                                            <PhoneInput
                                                placeholder="phone"
                                                {...field}
                                                defaultCountry="CA"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setPhone(e);
                                                }}
                                            />
                                            {showPhoneAutocomplete && (
                                                <AddressCommand
                                                    customers={customers}
                                                    setSelectedCustomer={
                                                        setSelectedCustomer
                                                    }
                                                    setShowAutocomplete={
                                                        setShowPhoneAutocomplete
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setAddressInput({
                                                    address: e.target.value,
                                                    key: 1,
                                                });
                                            }}
                                            value={addressInput.address}
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

                    <div className="!mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-auto">
                        <div>
                            <FormField
                                control={form.control}
                                name="start_date"
                                render={({ field }) => (
                                    <FormItem className="flex h-full flex-col justify-between">
                                        <FormLabel>Start date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        className={cn(
                                                            "pl-3 text-left font-normal",
                                                            !field.value &&
                                                                "text-muted-foreground"
                                                        )}
                                                        variant={"outline"}
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
                                                align="start"
                                                className="w-auto p-0"
                                            >
                                                <Calendar
                                                    disabled={[
                                                        { dayOfWeek: [0, 6] },
                                                    ]}
                                                    initialFocus
                                                    mode="single"
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
                                                    selected={
                                                        new Date(field.value)
                                                    }
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
                                        <span className="absolute mt-1 text-muted-foreground text-xs">
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
                                    onValueChange={(
                                        val: "pickup" | "delivery"
                                    ) => {
                                        form.setValue("order_type", val);
                                    }}
                                    value={form.watch("order_type")}
                                />
                                <FormDescription>
                                    Select a order type
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="order_taken_by"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Order taken by</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Name of staff who took the order"
                                        type="text"
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <TiffinConfirmDrawer
                        form={form}
                        // @ts-expect-error: mutation type doesn't match UseMutationResult type
                        mutation={mutation}
                        open={confirmOrderOpen}
                        setOpen={setConfirmOrderOpen}
                        setSentToWhatsapp={setSentToWhatsapp}
                        tiffinMenu={tiffinMenu}
                    />
                </form>
            </Form>
        </div>
    );
}
