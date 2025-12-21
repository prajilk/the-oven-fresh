"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Edit2,
    Save,
    Plus,
    Trash2,
    ChevronRight,
    FileText,
    Send,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import PrintableQuotation from "./printable-quotation";
import LoadingButton from "../ui/loading-button";
import { ZodItemizedQuotationSchema } from "@/lib/zod-schema/schema";
import { toast } from "sonner";
import { addQuotationAction } from "@/actions/add-quotation-action";
import z from "zod";
import QuotationSentDialog from "../dialog/quotation-sent-dialog";
import getQueryClient from "@/lib/query-utils/get-query-client";

interface SubItem {
    id: string;
    name: string;
}

interface Item {
    id: string;
    name: string;
    quantity: string;
    unit: string;
    rate: string;
    subItems: SubItem[];
    showSubItems: boolean;
}

const defaultItemized = {
    shopAddress: "",
    billTo: "",
    attendedBy: "",
    discount: "",
    includeTax: false,
    note: "",
    whatsappNumber: "",
};

export default function ItemizedQuotation() {
    const [itemized, setItemized] = useState(defaultItemized);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [items, setItems] = useState<Item[]>([
        {
            id: "1",
            name: "",
            quantity: "",
            unit: "",
            rate: "",
            subItems: [],
            showSubItems: false,
        },
    ]);
    const [showPrintDialog, setShowPrintDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const queryClient = getQueryClient();

    useEffect(() => {
        const savedAddress = localStorage.getItem("shopAddress");
        if (savedAddress) {
            setItemized((prev) => ({
                ...prev,
                shopAddress: savedAddress,
            }));
        } else {
            setIsEditingAddress(true);
        }
    }, []);

    const saveShopAddress = () => {
        localStorage.setItem("shopAddress", itemized.shopAddress);
        setIsEditingAddress(false);
    };

    function handleSave(sentToWhatsApp = false) {
        const result = ZodItemizedQuotationSchema.safeParse({
            ...itemized,
            discount: Number(discountAmount),
            tax: Number(taxAmount.toFixed(2)),
            total: Number(total.toFixed(2)),
            quotationType: "itemized",
            items: items.map((item) => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                unit: item.unit,
                rate: item.rate,
                subItems: item.subItems.map((subItem) => ({
                    id: subItem.id,
                    name: subItem.name,
                })),
            })),
        });
        if (!result.success) {
            toast.error("Invalid data format.");
            return;
        }

        setLoading(true);

        const promise = async () => {
            const res = await addQuotationAction(
                result.data as z.infer<typeof ZodItemizedQuotationSchema>,
                sentToWhatsApp
            );
            setLoading(false);
            if (res.success) {
                setItemized(defaultItemized);
                setItems([]);
                queryClient.invalidateQueries({
                    queryKey: ["quotation"],
                });
                if (res.messageSent === false) {
                    toast.error("Error sending whatsapp message.");
                    return;
                } else if (res.messageSent === true) {
                    toast.success("Order details sent to customer.");
                    return;
                }
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

    const addItem = () => {
        setItems([
            ...items,
            {
                id: Date.now().toString(),
                name: "",
                quantity: "",
                unit: "",
                rate: "",
                subItems: [],
                showSubItems: false,
            },
        ]);
    };

    const removeItem = (id: string) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const updateItem = (
        id: string,
        field: keyof Item,
        value: string | boolean
    ) => {
        setItems(
            items.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const addSubItem = (itemId: string) => {
        setItems(
            items.map((item) => {
                if (item.id === itemId) {
                    return {
                        ...item,
                        subItems: [
                            ...item.subItems,
                            { id: Date.now().toString(), name: "" },
                        ],
                        showSubItems: true,
                    };
                }
                return item;
            })
        );
    };

    const removeSubItem = (itemId: string, subItemId: string) => {
        setItems(
            items.map((item) => {
                if (item.id === itemId) {
                    return {
                        ...item,
                        subItems: item.subItems.filter(
                            (sub) => sub.id !== subItemId
                        ),
                    };
                }
                return item;
            })
        );
    };

    const updateSubItem = (itemId: string, subItemId: string, name: string) => {
        setItems(
            items.map((item) => {
                if (item.id === itemId) {
                    return {
                        ...item,
                        subItems: item.subItems.map((sub) =>
                            sub.id === subItemId ? { ...sub, name } : sub
                        ),
                    };
                }
                return item;
            })
        );
    };

    const subtotal = items.reduce((sum, item) => {
        const quantity = Number.parseFloat(item.quantity || "0");
        const rate = Number.parseFloat(item.rate || "0");
        return sum + quantity * rate;
    }, 0);
    const discountAmount = Number.parseFloat(itemized.discount || "0");
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = itemized.includeTax ? afterDiscount * 0.13 : 0;
    const total = afterDiscount + taxAmount;

    return (
        <div className="space-y-6">
            {/* Shop Address Section */}
            <Card className="border-primary/30">
                <CardHeader className="bg-primary/5">
                    <CardTitle className="flex items-center justify-between text-lg">
                        Shop Address
                        {!isEditingAddress && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditingAddress(true)}
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    {isEditingAddress ? (
                        <div className="space-y-2">
                            <Textarea
                                value={itemized.shopAddress}
                                onChange={(e) => {
                                    setItemized((prev) => ({
                                        ...prev,
                                        shopAddress: e.target.value,
                                    }));
                                }}
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
                            {itemized.shopAddress || "No address saved"}
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Customer Details Section */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-primary/30">
                    <CardHeader className="bg-primary/5">
                        <CardTitle className="text-lg">Bill To</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <Textarea
                            value={itemized.billTo}
                            onChange={(e) => {
                                setItemized((prev) => ({
                                    ...prev,
                                    billTo: e.target.value,
                                }));
                            }}
                            placeholder="Enter customer details..."
                            className="min-h-[100px]"
                        />
                    </CardContent>
                </Card>

                <Card className="border-primary/30">
                    <CardHeader className="bg-primary/5">
                        <CardTitle className="text-lg">Attended By</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <Input
                            value={itemized.attendedBy}
                            onChange={(e) => {
                                setItemized((prev) => ({
                                    ...prev,
                                    attendedBy: e.target.value,
                                }));
                            }}
                            placeholder="Enter your name..."
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Items Section */}
            <Card className="border-accent/50 border-2">
                <CardHeader className="bg-accent/10">
                    <CardTitle className="text-xl">Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="space-y-4">
                        {items.map((item) => (
                            <Card
                                key={item.id}
                                className="border-border bg-card"
                            >
                                <CardContent className="space-y-4 pt-6">
                                    <div className="flex gap-2">
                                        <div className="flex-1 space-y-2">
                                            <Label
                                                htmlFor={`item-name-${item.id}`}
                                            >
                                                Item Name
                                            </Label>
                                            <Input
                                                id={`item-name-${item.id}`}
                                                value={item.name}
                                                onChange={(e) =>
                                                    updateItem(
                                                        item.id,
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter item name..."
                                            />
                                        </div>

                                        {items.length > 1 && (
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="mt-8"
                                                onClick={() =>
                                                    removeItem(item.id)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-5">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`quantity-${item.id}`}
                                            >
                                                Quantity
                                            </Label>
                                            <Input
                                                id={`quantity-${item.id}`}
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateItem(
                                                        item.id,
                                                        "quantity",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="0"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor={`unit-${item.id}`}>
                                                Unit (optional)
                                            </Label>
                                            <Select
                                                value={item.unit}
                                                onValueChange={(value) =>
                                                    updateItem(
                                                        item.id,
                                                        "unit",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    id={`unit-${item.id}`}
                                                >
                                                    <SelectValue placeholder="Select unit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Tray">
                                                        Tray
                                                    </SelectItem>
                                                    <SelectItem value="Nos">
                                                        Nos
                                                    </SelectItem>
                                                    <SelectItem value="Cups">
                                                        Cups
                                                    </SelectItem>
                                                    <SelectItem value="Plates">
                                                        Plates
                                                    </SelectItem>
                                                    <SelectItem value="Bowls">
                                                        Bowls
                                                    </SelectItem>
                                                    <SelectItem value="Packs">
                                                        Packs
                                                    </SelectItem>
                                                    <SelectItem value="Kg">
                                                        Kg
                                                    </SelectItem>
                                                    <SelectItem value="Liters">
                                                        Liters
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor={`rate-${item.id}`}>
                                                Rate
                                            </Label>
                                            <Input
                                                id={`rate-${item.id}`}
                                                type="number"
                                                step="0.01"
                                                value={item.rate}
                                                onChange={(e) =>
                                                    updateItem(
                                                        item.id,
                                                        "rate",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="0.00"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Total</Label>
                                            <div className="flex h-10 items-center rounded-md border border-border bg-muted/30 px-3 font-semibold">
                                                $
                                                {(
                                                    Number.parseFloat(
                                                        item.quantity || "0"
                                                    ) *
                                                    Number.parseFloat(
                                                        item.rate || "0"
                                                    )
                                                ).toFixed(2)}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>&nbsp;</Label>
                                            <Button
                                                variant="outline"
                                                className="w-full bg-transparent"
                                                onClick={() =>
                                                    addSubItem(item.id)
                                                }
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Sub-item
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Sub-items */}
                                    {item.subItems.length > 0 && (
                                        <div className="ml-6 space-y-2 border-l-2 border-primary/30 pl-4">
                                            <Label className="text-xs text-muted-foreground">
                                                Sub-items (no separate pricing)
                                            </Label>
                                            {item.subItems.map((subItem) => (
                                                <div
                                                    key={subItem.id}
                                                    className="flex gap-2"
                                                >
                                                    <ChevronRight className="h-5 w-5 text-muted-foreground mt-1.5 flex-shrink-0" />
                                                    <Input
                                                        value={subItem.name}
                                                        onChange={(e) =>
                                                            updateSubItem(
                                                                item.id,
                                                                subItem.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Enter sub-item name..."
                                                        className="flex-1"
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            removeSubItem(
                                                                item.id,
                                                                subItem.id
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        className="w-full border-dashed border-2 bg-transparent"
                        onClick={addItem}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                    </Button>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={itemized.note}
                            onChange={(e) => {
                                setItemized((prev) => ({
                                    ...prev,
                                    note: e.target.value,
                                }));
                            }}
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
                            value={itemized.discount}
                            onChange={(e) =>
                                setItemized((prev) => ({
                                    ...prev,
                                    discount: e.target.value,
                                }))
                            }
                            placeholder="0.00"
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                        <Label htmlFor="tax-itemized" className="text-base">
                            Include 13% Tax
                        </Label>
                        <Switch
                            id="tax-itemized"
                            checked={itemized.includeTax}
                            onCheckedChange={(value) =>
                                setItemized((prev) => ({
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
                            {itemized.includeTax && (
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
                            whatsappNumber={itemized.whatsappNumber}
                            onChange={(value) =>
                                setItemized((prev) => ({
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
                        type="itemized"
                        shopAddress={itemized.shopAddress}
                        billTo={itemized.billTo}
                        attendedBy={itemized.attendedBy}
                        items={items}
                        notes={itemized.note}
                        discount={discountAmount}
                        includeTax={itemized.includeTax}
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
