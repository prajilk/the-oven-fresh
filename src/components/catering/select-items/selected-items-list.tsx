"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ImageIcon, Trash2 } from "lucide-react";
import { Divider } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useDispatch } from "react-redux";
import { removeItem } from "@/store/slices/cateringItemSlice";
import { PaymentDetailsDrawer } from "@/components/drawer/catering/payment-details-drawer";
import { OrderListDrawer } from "@/components/drawer/catering/order-list-drawer";
import Image from "next/image";
import { removeCustomItem } from "@/store/slices/cateringCustomItemSlice";

export function SelectedItemsList() {
    const cateringOrder = useSelector((state: RootState) => state.cateringItem);
    const cateringCustomItem = useSelector(
        (state: RootState) => state.cateringCustomItem
    );
    const dispatch = useDispatch();

    const total =
        cateringOrder.reduce(
            (acc, item) => acc + item.priceAtOrder * item.quantity,
            0
        ) +
        cateringCustomItem.reduce((acc, item) => acc + item.priceAtOrder, 0);
    const tax = (total * Number(process.env.NEXT_PUBLIC_TAX_AMOUNT || 0)) / 100;
    const totalPayment = total + tax;

    const handleRemoveItem = (id: string, size: string) => {
        dispatch(removeItem({ _id: id, size }));
    };
    const handleRemoveCustomItem = (name: string) => {
        dispatch(removeCustomItem({ name }));
    };

    return (
        <>
            <Card className="sticky top-4 hidden lg:block">
                <CardHeader className="py-4 px-4">
                    <CardTitle className="text-lg">Selected Items</CardTitle>
                    <CardDescription>
                        Items added to the current order
                    </CardDescription>
                </CardHeader>
                <CardContent className="w-full px-4">
                    {cateringOrder.length === 0 &&
                    cateringCustomItem.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No items selected yet. Please select items from the
                            menu.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cateringOrder.map((item, index) => (
                                <div
                                    className="flex flex-col p-3 pb-2 border rounded-md"
                                    key={index}
                                >
                                    <div className="flex items-start mb-1 gap-2">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            className="rounded-md"
                                            width={56}
                                            height={56}
                                        />
                                        <div>
                                            <div className="font-medium flex items-center gap-1">
                                                {item.name}
                                                <div className="text-xs text-muted-foreground">
                                                    &#040;x{item.quantity}&#041;
                                                </div>
                                            </div>
                                            <div className="text-xs">
                                                {item.variant}
                                            </div>
                                            <div className="text-xs text-muted-foreground capitalize">
                                                {item.size} - ${" "}
                                                {item.priceAtOrder.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="font-medium">
                                            ${" "}
                                            {(
                                                item.priceAtOrder *
                                                item.quantity
                                            ).toFixed(2)}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() =>
                                                handleRemoveItem(
                                                    item._id,
                                                    item.size
                                                )
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {cateringCustomItem.map((item, index) => (
                                <div
                                    className="flex flex-col p-3 pb-2 border rounded-md"
                                    key={index + item.name}
                                >
                                    <div className="flex items-start mb-1 gap-2">
                                        <div className="rounded-md size-14 bg-gray-200 flex justify-center items-center">
                                            <ImageIcon size={15} />
                                        </div>
                                        <div>
                                            <div className="font-medium flex items-center gap-1">
                                                {item.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground capitalize">
                                                {item.size} - ${" "}
                                                {item.priceAtOrder.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="font-medium">
                                            $ {item.priceAtOrder.toFixed(2)}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() =>
                                                handleRemoveCustomItem(
                                                    item.name
                                                )
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <Divider />
                            <div className="lg:bg-gray-100 lg:rounded-md lg:p-2 mt-1 sm:mt-2 lg:mt-4">
                                <h2 className="mb-4">Payment Summary</h2>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">
                                            Sub Total
                                        </span>
                                        <span className="font-medium">
                                            ${total}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">
                                            Tax
                                        </span>
                                        <span className="font-medium">
                                            ${tax.toFixed(2)}
                                        </span>
                                    </div>
                                    <hr />
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">
                                            Total Payment
                                        </span>
                                        <span className="font-medium">
                                            ${totalPayment.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            <div className="fixed lg:hidden right-0 left-0 bottom-0 p-4 px-3 z-10">
                <div className="w-full bg-white rounded-lg shadow p-3.5 border">
                    <div className="flex justify-between items-center lg:hidden">
                        <span>
                            {cateringOrder.length + cateringCustomItem.length}{" "}
                            items in the list
                        </span>
                        <OrderListDrawer />
                    </div>
                    <div className="flex justify-between items-center lg:hidden">
                        <span>
                            Total:{" "}
                            <b className="font-medium">
                                ${totalPayment.toFixed(2)}
                            </b>
                        </span>
                        <PaymentDetailsDrawer />
                    </div>
                </div>
            </div>
        </>
    );
}
