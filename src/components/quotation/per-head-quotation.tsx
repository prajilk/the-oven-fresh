"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, FileText, Send, Pencil } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import PrintableQuotation from "./printable-quotation";
import { toast } from "sonner";
import { ZodPerHeadQuotationSchema } from "@/lib/zod-schema/schema";
import { addQuotationAction } from "@/actions/add-quotation-action";
import LoadingButton from "../ui/loading-button";
import QuotationSentDialog from "../dialog/quotation-sent-dialog";
import getQueryClient from "@/lib/query-utils/get-query-client";

const defaultPerHead = {
    shopAddress: "",
    billTo: "",
    attendedBy: "",
    title: "Live Station",
    items: "",
    costPerHead: "",
    numberOfHeads: "1",
    discount: "",
    includeTax: false,
    note: "",
    whatsappNumber: "",
};

export default function PerHeadQuotation() {
    const [perHead, setPerHead] = useState(defaultPerHead);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [showPrintDialog, setShowPrintDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    // Load shop address from localStorage on mount
    useEffect(() => {
        const savedAddress = localStorage.getItem("shopAddress");
        if (savedAddress) {
            setPerHead((prev) => ({
                ...prev,
                shopAddress: savedAddress,
            }));
        } else {
            setIsEditingAddress(true);
        }
    }, []);

    // Save shop address to localStorage
    const saveShopAddress = () => {
        localStorage.setItem("shopAddress", perHead.shopAddress);
        setIsEditingAddress(false);
    };

    // Calculate totals
    const subtotal =
        Number.parseFloat(perHead.costPerHead || "0") *
        Number.parseFloat(perHead.numberOfHeads || "0");
    const discountAmount = Number.parseFloat(perHead.discount || "0");
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = perHead.includeTax
        ? (afterDiscount * Number(process.env.NEXT_PUBLIC_TAX_AMOUNT)) / 100
        : 0;
    const total = afterDiscount + taxAmount;

    const queryClient = getQueryClient();

    function handleSave(sentToWhatsApp = false) {
        const result = ZodPerHeadQuotationSchema.safeParse({
            ...perHead,
            discount: Number(discountAmount),
            costPerHead: Number(perHead.costPerHead),
            numberOfHeads: Number(perHead.numberOfHeads),
            tax: Number(taxAmount.toFixed(2)),
            total: Number(total.toFixed(2)),
            quotationType: "per-head",
        });

        if (!result.success) {
            toast.error("Invalid data format.");
            return;
        }
        setLoading(true);

        const promise = async () => {
            const res = await addQuotationAction(result.data, sentToWhatsApp);
            setLoading(false);
            console.log(res);

            if (res.success) {
                if (res.messageSent === false) {
                    return "Error sending whatsapp message.";
                } else if (res.messageSent === true) {
                    return "Order details sent to customer.";
                }
                setPerHead(defaultPerHead);
                queryClient.invalidateQueries({
                    queryKey: ["quotation"],
                });
                return res;
            }
            throw res;
        };

        toast.promise(promise(), {
            loading: "Creating quotation...",
            success: () => "Quotation created successfully.",
            error: ({ error }) =>
                error ? error : "Failed to create quotation.",
        });
    }

    return (
        <div className="space-y-6">
            {/* Shop Address Section */}
            <Card className="border-primary/30">
                <CardHeader className="p-3 bg-primary/5">
                    <CardTitle className="flex items-center justify-between text-lg">
                        Shop Address
                        {!isEditingAddress && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditingAddress(true)}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    {isEditingAddress ? (
                        <div className="space-y-2">
                            <Textarea
                                value={perHead.shopAddress}
                                onChange={(e) =>
                                    setPerHead((prev) => ({
                                        ...prev,
                                        shopAddress: e.target.value,
                                    }))
                                }
                                placeholder="Enter your shop address..."
                                className="min-h-[100px]"
                            />
                            <Button
                                onClick={saveShopAddress}
                                className="w-full"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                Save Address
                            </Button>
                        </div>
                    ) : (
                        <p className="whitespace-pre-wrap text-sm">
                            {perHead.shopAddress || "No address saved"}
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Customer Details Section */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-primary/30">
                    <CardHeader className="p-3 bg-primary/5">
                        <CardTitle className="text-lg">Bill To</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <Textarea
                            value={perHead.billTo}
                            onChange={(e) =>
                                setPerHead((prev) => ({
                                    ...prev,
                                    billTo: e.target.value,
                                }))
                            }
                            placeholder="Enter customer details..."
                            className="min-h-[100px]"
                        />
                    </CardContent>
                </Card>

                <Card className="border-primary/30">
                    <CardHeader className="p-3 bg-primary/5">
                        <CardTitle className="text-lg">Attended By</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <Input
                            value={perHead.attendedBy}
                            onChange={(e) =>
                                setPerHead((prev) => ({
                                    ...prev,
                                    attendedBy: e.target.value,
                                }))
                            }
                            placeholder="Enter your name..."
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Quotation Details Section */}
            <Card className="border-accent/50 border-2">
                <CardHeader className="p-3 bg-accent/10">
                    <CardTitle className="text-xl">Quotation Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={perHead.title}
                            onChange={(e) =>
                                setPerHead((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                }))
                            }
                            className="font-semibold"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="items">Items</Label>
                        <Textarea
                            id="items"
                            value={perHead.items}
                            onChange={(e) =>
                                setPerHead((prev) => ({
                                    ...prev,
                                    items: e.target.value,
                                }))
                            }
                            placeholder={`Enter items (one per line)
Example:
    • Appetizers
    • Main Course
    • Desserts`}
                            className="min-h-[150px]"
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="numberOfHeads">
                                Number of Heads
                            </Label>
                            <Input
                                id="numberOfHeads"
                                type="number"
                                value={perHead.numberOfHeads}
                                onChange={(e) =>
                                    setPerHead((prev) => ({
                                        ...prev,
                                        numberOfHeads: e.target.value,
                                    }))
                                }
                                placeholder="0"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="costPerHead">Cost Per Head</Label>
                            <Input
                                id="costPerHead"
                                type="number"
                                step="0.01"
                                value={perHead.costPerHead}
                                onChange={(e) =>
                                    setPerHead((prev) => ({
                                        ...prev,
                                        costPerHead: e.target.value,
                                    }))
                                }
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={perHead.note}
                            onChange={(e) =>
                                setPerHead((prev) => ({
                                    ...prev,
                                    note: e.target.value,
                                }))
                            }
                            placeholder="Add any additional notes or instructions..."
                            className="min-h-[80px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="discount">Discount Amount</Label>
                        <Input
                            id="discount"
                            type="number"
                            step="0.01"
                            value={perHead.discount}
                            onChange={(e) =>
                                setPerHead((prev) => ({
                                    ...prev,
                                    discount: e.target.value,
                                }))
                            }
                            placeholder="0.00"
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                        <Label htmlFor="tax" className="text-base">
                            Include 13% Tax
                        </Label>
                        <Switch
                            id="tax"
                            checked={perHead.includeTax}
                            onCheckedChange={(value) =>
                                setPerHead((prev) => ({
                                    ...prev,
                                    includeTax: value,
                                }))
                            }
                        />
                    </div>

                    {/* Total Summary */}
                    <Card className="bg-primary/5 border-primary">
                        <CardContent className="space-y-3 pt-6">
                            <div className="flex justify-between text-lg">
                                <span className="font-medium">Subtotal:</span>
                                <span className="font-semibold">
                                    ${subtotal.toFixed(2)}
                                </span>
                            </div>
                            {discountAmount > 0 && (
                                <>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Discount:</span>
                                        <span>
                                            -${discountAmount.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-base">
                                        <span className="font-medium">
                                            After Discount:
                                        </span>
                                        <span className="font-semibold">
                                            ${afterDiscount.toFixed(2)}
                                        </span>
                                    </div>
                                </>
                            )}
                            {perHead.includeTax && (
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Tax (13%):</span>
                                    <span>${taxAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between border-t border-primary/30 pt-3 text-2xl font-bold">
                                <span>Total:</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-3 md:grid-cols-3">
                        <Button
                            variant="outline"
                            className="w-full border-primary text-primary hover:bg-primary/10 bg-transparent"
                            size="lg"
                            onClick={() => setShowPrintDialog(true)}
                        >
                            <FileText className="mr-2 h-5 w-5" />
                            View Quotation
                        </Button>
                        <LoadingButton
                            isLoading={loading}
                            size="lg"
                            onClick={() => handleSave()}
                        >
                            <Save className="mr-2 h-5 w-5" />
                            Save Quotation
                        </LoadingButton>
                        <QuotationSentDialog
                            whatsappNumber={perHead.whatsappNumber}
                            onChange={(value) =>
                                setPerHead((prev) => ({
                                    ...prev,
                                    whatsappNumber: value,
                                }))
                            }
                            onSubmit={() => handleSave(true)}
                        >
                            <LoadingButton
                                isLoading={loading}
                                size="lg"
                                className="w-full"
                            >
                                <Send className="mr-2 h-5 w-5" />
                                Send via WhatsApp
                            </LoadingButton>
                        </QuotationSentDialog>
                    </div>
                </CardContent>
            </Card>

            {/* PrintableQuotation Dialog */}
            <Dialog open={showPrintDialog} onOpenChange={setShowPrintDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Quotation Preview</DialogTitle>
                        <DialogDescription>
                            Review your quotation before printing or sharing
                        </DialogDescription>
                    </DialogHeader>
                    <PrintableQuotation
                        type="per-head"
                        shopAddress={perHead.shopAddress}
                        billTo={perHead.billTo}
                        attendedBy={perHead.attendedBy}
                        title={perHead.title}
                        items={perHead.items}
                        costPerHead={perHead.costPerHead}
                        numberOfHeads={perHead.numberOfHeads}
                        notes={perHead.note}
                        discount={discountAmount}
                        includeTax={perHead.includeTax}
                        subtotal={subtotal}
                        afterDiscount={afterDiscount}
                        taxAmount={taxAmount}
                        total={total}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
