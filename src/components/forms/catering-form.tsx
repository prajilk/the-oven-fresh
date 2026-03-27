"use client";

import type { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import { Typography } from "@mui/material";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type * as z from "zod";
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
import { cn } from "@/lib/utils";
import type { ZodCateringSchema } from "@/lib/zod-schema/schema";
import type { RootState } from "@/store";
import {
    setCustomerDetails,
    setDeliveryDate,
    setOrderTakenBy,
    setOrderType,
} from "@/store/slices/catering-order-slice";
import AddressAutocomplete from "../address-autocomplete";
import AddressCommand from "../commands/address-command";
import OrderTypeSelect from "../select/order-type-select";
import PaymentSelect from "../select/payment-select";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";

export default function CateringForm({
    form,
}: {
    form: UseFormReturn<z.infer<typeof ZodCateringSchema>>;
}) {
    const clickOutsideRef = useRef(null);
    const [phone, setPhone] = useState("");
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
        form.setValue("customerDetails.address", address.description || "");
        form.setValue("customerDetails.lat", 0);
        form.setValue("customerDetails.lng", 0);
    }

    function setSelectedCustomer(customer: CustomerSearchResult) {
        dispatch(
            setCustomerDetails({
                phone: customer.phone || "",
                firstName: customer.firstName || "",
                lastName: customer.lastName || "",
                address: { address: customer.address.address || "", key: 0 },
                placeId: customer.address.placeId,
                aptSuiteUnit: customer.address.aptSuiteUnit || "",
            })
        );

        form.setValue("customerDetails.phone", customer.phone || "");
        form.setValue("customerDetails.firstName", customer.firstName || "");
        form.setValue("customerDetails.lastName", customer.lastName || "");
        form.setValue(
            "customerDetails.address",
            customer.address.address || ""
        );
        form.setValue("customerDetails.lat", customer.address.lat);
        form.setValue("customerDetails.lng", customer.address.lng);
        form.setValue(
            "customerDetails.aptSuiteUnit",
            customer.address.aptSuiteUnit
        );
    }

    function handleDateSelect(date: Date | undefined) {
        if (date) {
            form.setValue("deliveryDate", date);
            dispatch(setDeliveryDate(date.toISOString()));
        }
    }

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <Ignore>
    function handleTimeChange(type: "hour" | "minute" | "ampm", value: string) {
        const currentDate = form.getValues("deliveryDate") || new Date();
        const newDate = new Date(currentDate);

        if (type === "hour") {
            const hour = Number.parseInt(value, 10);
            newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
        } else if (type === "minute") {
            newDate.setMinutes(Number.parseInt(value, 10));
        } else if (type === "ampm") {
            const hours = newDate.getHours();
            if (value === "AM" && hours >= 12) {
                newDate.setHours(hours - 12);
            } else if (value === "PM" && hours < 12) {
                newDate.setHours(hours + 12);
            }
        }

        form.setValue("deliveryDate", newDate);
        dispatch(setDeliveryDate(newDate.toISOString()));
    }

    function resetForm() {
        form.reset();
        setPhone("");
    }

    return (
        <div className="mx-auto w-full rounded-md border p-5 shadow md:w-fit md:p-10">
            <Form {...form}>
                <div className="flex items-center justify-between">
                    <Typography variant="h6">Enter Address</Typography>
                    <Button
                        onClick={resetForm}
                        size="sm"
                        type="button"
                        variant={"ghost"}
                    >
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
                                        <div
                                            className="relative"
                                            ref={clickOutsideRef}
                                        >
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
                                                    setSelectedCustomer={
                                                        setSelectedCustomer
                                                    }
                                                    setShowAutocomplete={
                                                        setShowAutocomplete
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
                                                            firstName:
                                                                e.target.value,
                                                        })
                                                    );
                                                    form.setValue(
                                                        "customerDetails.firstName",
                                                        e.target.value
                                                    );
                                                }}
                                                value={
                                                    orderDetail.customerDetails
                                                        .firstName
                                                }
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
                                                            lastName:
                                                                e.target.value,
                                                        })
                                                    );
                                                    form.setValue(
                                                        "customerDetails.lastName",
                                                        e.target.value
                                                    );
                                                }}
                                                value={
                                                    orderDetail.customerDetails
                                                        .lastName
                                                }
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
                                                            address:
                                                                e.target.value,
                                                            key: 1,
                                                        },
                                                    })
                                                );
                                                form.setValue(
                                                    "customerDetails.address",
                                                    e.target.value
                                                );
                                            }}
                                            value={
                                                orderDetail.customerDetails
                                                    .address.address
                                            }
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
                                                    aptSuiteUnit:
                                                        e.target.value,
                                                })
                                            );
                                            form.setValue(
                                                "customerDetails.aptSuiteUnit",
                                                e.target.value
                                            );
                                        }}
                                        value={
                                            orderDetail.customerDetails
                                                .aptSuiteUnit
                                        }
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
                            <FormItem className="flex flex-col">
                                <FormLabel>Enter date & time</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value &&
                                                        "text-muted-foreground"
                                                )}
                                                variant={"outline"}
                                            >
                                                {field.value ? (
                                                    format(
                                                        field.value,
                                                        "PPP hh:mm aa"
                                                    )
                                                ) : (
                                                    <span>
                                                        MM/DD/YYYY hh:mm aa
                                                    </span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <div className="sm:flex">
                                            <Calendar
                                                initialFocus
                                                mode="single"
                                                onSelect={handleDateSelect}
                                                selected={field.value}
                                            />
                                            <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
                                                <ScrollArea className="w-64 sm:w-auto">
                                                    <div className="flex p-2 sm:flex-col">
                                                        {Array.from(
                                                            { length: 12 },
                                                            (_, i) => i + 1
                                                        )
                                                            .reverse()
                                                            .map((hour) => (
                                                                <Button
                                                                    className="aspect-square shrink-0 sm:w-full"
                                                                    key={hour}
                                                                    onClick={() =>
                                                                        handleTimeChange(
                                                                            "hour",
                                                                            hour.toString()
                                                                        )
                                                                    }
                                                                    size="icon"
                                                                    variant={
                                                                        field.value &&
                                                                        field.value.getHours() %
                                                                            12 ===
                                                                            hour %
                                                                                12
                                                                            ? "default"
                                                                            : "ghost"
                                                                    }
                                                                >
                                                                    {hour}
                                                                </Button>
                                                            ))}
                                                    </div>
                                                    <ScrollBar
                                                        className="sm:hidden"
                                                        orientation="horizontal"
                                                    />
                                                </ScrollArea>
                                                <ScrollArea className="w-64 sm:w-auto">
                                                    <div className="flex p-2 sm:flex-col">
                                                        {Array.from(
                                                            { length: 12 },
                                                            (_, i) => i * 5
                                                        ).map((minute) => (
                                                            <Button
                                                                className="aspect-square shrink-0 sm:w-full"
                                                                key={minute}
                                                                onClick={() =>
                                                                    handleTimeChange(
                                                                        "minute",
                                                                        minute.toString()
                                                                    )
                                                                }
                                                                size="icon"
                                                                variant={
                                                                    field.value &&
                                                                    field.value.getMinutes() ===
                                                                        minute
                                                                        ? "default"
                                                                        : "ghost"
                                                                }
                                                            >
                                                                {minute
                                                                    .toString()
                                                                    .padStart(
                                                                        2,
                                                                        "0"
                                                                    )}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                    <ScrollBar
                                                        className="sm:hidden"
                                                        orientation="horizontal"
                                                    />
                                                </ScrollArea>
                                                <ScrollArea className="">
                                                    <div className="flex p-2 sm:flex-col">
                                                        {["AM", "PM"].map(
                                                            (ampm) => (
                                                                <Button
                                                                    className="aspect-square shrink-0 sm:w-full"
                                                                    key={ampm}
                                                                    onClick={() =>
                                                                        handleTimeChange(
                                                                            "ampm",
                                                                            ampm
                                                                        )
                                                                    }
                                                                    size="icon"
                                                                    variant={
                                                                        field.value &&
                                                                        ((ampm ===
                                                                            "AM" &&
                                                                            field.value.getHours() <
                                                                                12) ||
                                                                            (ampm ===
                                                                                "PM" &&
                                                                                field.value.getHours() >=
                                                                                    12))
                                                                            ? "default"
                                                                            : "ghost"
                                                                    }
                                                                >
                                                                    {ampm}
                                                                </Button>
                                                            )
                                                        )}
                                                    </div>
                                                </ScrollArea>
                                            </div>
                                        </div>
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
                                        dispatch(setOrderType(val));
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
                                        onChange={(e) => {
                                            dispatch(
                                                setOrderTakenBy(e.target.value)
                                            );
                                            form.setValue(
                                                "order_taken_by",
                                                e.target.value
                                            );
                                        }}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    );
}
