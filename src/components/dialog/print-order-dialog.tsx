"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Printer, ChevronRight, MessageSquarePlus } from "lucide-react";
import { CateringDocumentPopulate } from "@/models/types/catering";
import { objectToQuery } from "@/lib/utils";

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    category?: string;
}

export interface Order {
    id: string;
    tableNumber?: string;
    customerName?: string;
    createdAt: string;
    items: OrderItem[];
}

interface PrintOrderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: CateringDocumentPopulate | null;
}

export function PrintOrderDialog({
    open,
    onOpenChange,
    order,
}: PrintOrderDialogProps) {
    const [remarks, setRemarks] = useState<Record<string, string>>({});
    const [step, setStep] = useState<"confirm" | "remarks">("confirm");

    const handleRemarkChange = (itemId: string, value: string) => {
        setRemarks((prev) => ({ ...prev, [itemId]: value }));
    };

    const handleConfirm = (orderId: string) => {
        const query = objectToQuery(remarks);

        const url = `/sticker/catering?orderId=${orderId}&${query}`;
        window.open(url, "_blank");
        // Reset state
        setRemarks({});
        setStep("confirm");
        onOpenChange(false);
    };

    const handleClose = () => {
        setRemarks({});
        setStep("confirm");
        onOpenChange(false);
    };

    if (!order) return null;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl p-0">
                {step === "confirm" ? (
                    <>
                        {/* Header */}
                        <DialogHeader className="px-6 pt-6 pb-4">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                                    <Printer className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <DialogTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)]">
                                        Print Order
                                    </DialogTitle>
                                    <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400 mt-0">
                                        Order #{order.orderId}
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <Separator className="bg-zinc-100 dark:bg-zinc-800" />

                        {/* Order Summary */}
                        <div className="px-6 py-4">
                            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
                                Items (
                                {order.items.length + order.customItems.length})
                            </p>

                            <div className="space-y-2">
                                {order.items.map((item) => (
                                    <OrderListItem
                                        item={{
                                            id: item.itemId._id,
                                            name: item.itemId.name,
                                            quantity: item.quantity,
                                            t: item.size,
                                        }}
                                        key={item.itemId._id.toString()}
                                    />
                                ))}
                                {order.customItems.map((item) => (
                                    <OrderListItem
                                        item={{
                                            id: item._id.toString(),
                                            name: item.itemDescription,
                                            quantity: item.quantity,
                                            t: item.unit,
                                        }}
                                        key={item._id.toString()}
                                    />
                                ))}
                            </div>
                        </div>

                        <Separator className="bg-zinc-100 dark:bg-zinc-800" />

                        <DialogFooter className="px-6 py-4 flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleClose}
                                className="flex-1 border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => setStep("remarks")}
                                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold shadow-md shadow-amber-500/20 flex items-center gap-2"
                            >
                                Add Remarks
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        {/* Remarks Step Header */}
                        <DialogHeader className="px-6 pt-6 pb-4">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                    <MessageSquarePlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <DialogTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                        Add Remarks
                                    </DialogTitle>
                                    <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400 mt-0">
                                        Optional notes for each item. Leave
                                        blank to skip.
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <Separator className="bg-zinc-100 dark:bg-zinc-800" />

                        {/* Remarks Form */}
                        <div className="px-6 py-4 space-y-4">
                            {order.items.map((item) => (
                                <RemarkItem
                                    item={{
                                        id: item.itemId._id,
                                        name: item.itemId.name,
                                        quantity: item.quantity,
                                    }}
                                    remarks={remarks}
                                    handleRemarkChange={handleRemarkChange}
                                    key={item.itemId._id.toString()}
                                />
                            ))}
                            {order.customItems.map((item) => (
                                <RemarkItem
                                    item={{
                                        id: item._id.toString(),
                                        name: item.itemDescription,
                                        quantity: item.quantity,
                                    }}
                                    remarks={remarks}
                                    handleRemarkChange={handleRemarkChange}
                                    key={item._id.toString()}
                                />
                            ))}
                        </div>

                        <Separator className="bg-zinc-100 dark:bg-zinc-800" />

                        <DialogFooter className="px-6 py-4 flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setStep("confirm")}
                                className="flex-1 border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={() => handleConfirm(order.orderId)}
                                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold shadow-md shadow-emerald-500/20 flex items-center gap-2"
                            >
                                <Printer className="w-4 h-4" />
                                Generate PDF
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

function OrderListItem({
    item,
}: {
    item: { id: string; name: string; quantity: number; t: string };
}) {
    return (
        <div
            key={item.id}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60"
        >
            <div className="flex items-center gap-3">
                <div>
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {item.name}
                    </p>
                    <p className="text-xs text-zinc-400">
                        {item.quantity} x {item.t}
                    </p>
                </div>
            </div>
        </div>
    );
}

function RemarkItem({
    item,
    remarks,
    handleRemarkChange,
}: {
    item: { id: string; name: string; quantity: number };
    remarks: Record<string, string>;
    handleRemarkChange: (itemId: string, value: string) => void;
}) {
    return (
        <div key={item.id} className="space-y-2">
            <div className="flex items-center justify-between">
                <Label
                    htmlFor={`remark-${item.id}`}
                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2"
                >
                    {item.name}
                </Label>
                {remarks[item.id] && (
                    <Badge className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-0">
                        Note added
                    </Badge>
                )}
            </div>
            <Textarea
                id={`remark-${item.id}`}
                placeholder={`Remark for ${item.name}… (optional)`}
                value={remarks[item.id] || ""}
                onChange={(e) => handleRemarkChange(item.id, e.target.value)}
                className="resize-none h-16 text-sm bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 focus-visible:ring-amber-400 rounded-xl placeholder:text-zinc-400"
            />
        </div>
    );
}
