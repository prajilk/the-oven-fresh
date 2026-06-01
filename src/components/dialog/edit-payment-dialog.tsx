"use client";

import { Button } from "@heroui/button";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { editPaymentAction } from "@/actions/edit-payment-action";
import { Button as ShadButton } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import PaymentBlock from "../order/payment-block";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

type PaymentDetailsProps = {
    subtotal: number;
    tax: number;
    deliveryCharge: number;
    paymentMethod: string;
    advancePaid: number;
    pendingBalance: number;
    discount: number;
    fullyPaid: boolean;
};

function setDefaultValue(paymentDetails: PaymentDetailsProps) {
    return {
        subtotal: paymentDetails.subtotal,
        deliveryCharge: paymentDetails.deliveryCharge,
        discount: paymentDetails.discount,
        tax: paymentDetails.tax,
        total:
            paymentDetails.subtotal -
            paymentDetails.discount +
            paymentDetails.tax +
            (paymentDetails.deliveryCharge || 0),
        advancePaid: paymentDetails.advancePaid,
        pendingBalance: paymentDetails.pendingBalance,
        paymentMethod: paymentDetails.paymentMethod,
        fullyPaid: paymentDetails.fullyPaid,
    };
}

const EditPaymentDialog = ({
    orderId,
    paymentDetails,
    orderType,
}: {
    orderId: string;
    paymentDetails: PaymentDetailsProps;
    orderType: "catering" | "tiffin";
}) => {
    const [editState, setEditState] = useState({
        subtotal: false,
        deliveryCharge: false,
        discount: false,
        tax: false,
        total: false,
        advancePaid: false,
        pendingBalance: false,
        paymentMethod: false,
        fullyPaid: false,
    });
    const [valueState, setValueState] = useState(
        setDefaultValue(paymentDetails)
    );

    useEffect(() => {
        setValueState(setDefaultValue(paymentDetails));
    }, [paymentDetails]);

    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        setLoading(true);

        const promise = async () => {
            const result = await editPaymentAction({
                ...valueState,
                orderId,
                orderType,
            });
            setLoading(false);
            if (result.success) {
                return result;
            }
            throw result;
        };

        toast.promise(promise(), {
            loading: "Updating payment details...",
            success: () => {
                return "Payment details updated successfully.";
            },
            error: (err) => {
                if (err.error === "Unauthorized")
                    return "Forbidden: You are not authorized to perform this action!";
                else return "Failed to update payment details.";
            },
        });
    };

    function calculateTax() {
        const subtotal = Number(valueState.subtotal);
        const dFee = Number(valueState.deliveryCharge) || 0;
        const discount = Number(valueState.discount) || 0;
        const tax =
            ((subtotal + dFee - discount) *
                Number(process.env.NEXT_PUBLIC_TAX_AMOUNT || 0)) /
            100;
        return tax;
    }

    function resetPayments() {
        setValueState({
            subtotal: paymentDetails.subtotal,
            deliveryCharge: paymentDetails.deliveryCharge,
            discount: paymentDetails.discount,
            tax: paymentDetails.tax,
            total:
                paymentDetails.subtotal +
                paymentDetails.tax +
                (paymentDetails.deliveryCharge || 0),
            advancePaid: paymentDetails.advancePaid,
            pendingBalance: paymentDetails.pendingBalance,
            paymentMethod: paymentDetails.paymentMethod,
            fullyPaid: paymentDetails.fullyPaid,
        });
        setEditState({
            subtotal: false,
            deliveryCharge: false,
            discount: false,
            tax: false,
            total: false,
            advancePaid: false,
            pendingBalance: false,
            paymentMethod: false,
            fullyPaid: false,
        });
    }

    function manageSubtotalChange() {
        const subtotal = Number(valueState.subtotal);
        setEditState((prev) => ({
            ...prev,
            subtotal: false,
        }));

        const dFee = Number(valueState.deliveryCharge) || 0;
        const discount = Number(valueState.discount) || 0;
        const advance = Number(valueState.advancePaid) || 0;

        if (valueState.tax > 0) {
            const total = subtotal + dFee;
            const afterTax =
                (total * Number(process.env.NEXT_PUBLIC_TAX_AMOUNT || 0)) / 100;
            const pending = Number(
                (total + afterTax - advance - discount).toFixed(2)
            );

            setValueState((prev) => ({
                ...prev,
                total: Number(total.toFixed(2)) + Number(afterTax.toFixed(2)),
                tax: Number(afterTax.toFixed(2)),
                pendingBalance: pending,
                fullyPaid: pending <= 0,
            }));

            return;
        }

        const pending = subtotal + dFee - discount - advance;

        setValueState((prev) => ({
            ...prev,
            total: subtotal + dFee,
            pendingBalance: pending,
            fullyPaid: pending <= 0,
        }));
    }

    function manageDeliveryFeeChange() {
        setEditState((prev) => ({
            ...prev,
            deliveryCharge: false,
        }));

        const dFee = Number(valueState.deliveryCharge) || 0;
        const subtotal = Number(valueState.subtotal) || 0;
        const discount = Number(valueState.discount) || 0;
        const advancePaid = Number(valueState.advancePaid) || 0;
        const total = subtotal + dFee;
        const pending = total - advancePaid - discount;

        if (valueState.tax > 0) {
            const afterTax =
                (total * Number(process.env.NEXT_PUBLIC_TAX_AMOUNT || 0)) / 100;
            const afterTotal = total + afterTax;
            const pending = Number(
                (afterTotal - advancePaid - discount).toFixed(2)
            );
            setValueState((prev) => ({
                ...prev,
                total: Number(afterTotal.toFixed(2)),
                pendingBalance: pending,
                tax: Number(afterTax.toFixed(2)),
                fullyPaid: pending <= 0,
            }));
            return;
        }

        setValueState((prev) => ({
            ...prev,
            total,
            pendingBalance: pending,
            fullyPaid: pending <= 0,
        }));
    }

    function manageTaxChange() {
        setEditState((prev) => ({
            ...prev,
            tax: false,
        }));

        const subtotal = Number(valueState.subtotal);
        const dFee = Number(valueState.deliveryCharge) || 0;
        const tax = Number(valueState.tax);
        const total = Number((subtotal + dFee + tax).toFixed(2));
        const pending = Number(
            (total - valueState.advancePaid - valueState.discount).toFixed(2)
        );

        setValueState((prev) => ({
            ...prev,
            total,
            pendingBalance: pending,
            fullyPaid: pending <= 0,
        }));
    }

    function manageDiscountChange() {
        setEditState((prev) => ({
            ...prev,
            discount: false,
        }));

        const subtotal = Number(valueState.subtotal);
        const discount = Number(valueState.discount);
        const advancePaid = Number(valueState.advancePaid) || 0;
        const dFee = Number(valueState.deliveryCharge) || 0;
        const tax =
            ((subtotal + dFee - discount) *
                Number(process.env.NEXT_PUBLIC_TAX_AMOUNT || 0)) /
            100;
        const total = subtotal + dFee + tax - discount;
        const pending = Number((total - advancePaid).toFixed(2));

        setValueState((prev) => ({
            ...prev,
            pendingBalance: pending,
            tax,
            total,
            fullyPaid: pending <= 0,
        }));
    }

    function manageAdvancePaidChange() {
        setEditState((prev) => ({
            ...prev,
            advancePaid: false,
        }));

        const total = Number(valueState.total);
        const advancePaid = Number(valueState.advancePaid) || 0;
        const pending = Number((total - advancePaid).toFixed(2));

        setValueState((prev) => ({
            ...prev,
            pendingBalance: pending,
            fullyPaid: pending <= 0,
        }));
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button isIconOnly radius="full" size="sm" variant="flat">
                    <Pencil size={15} />
                </Button>
            </DialogTrigger>
            <DialogContent className="scrollbar-thin max-h-[calc(100vh-50px)] overflow-y-scroll sm:max-w-[60%]">
                <DialogHeader>
                    <DialogTitle>Edit payment details</DialogTitle>
                </DialogHeader>
                <div className="mt-5 grid grid-cols-2 bg-gray-50 md:grid-cols-4 [&>div]:border [&>div]:border-gray-200 [&>div]:p-3 [&_input]:bg-white">
                    <PaymentBlock
                        defaultValue={paymentDetails.subtotal}
                        editState={editState.subtotal}
                        itemKey="subtotal"
                        itemLabel="Subtotal"
                        onCheck={manageSubtotalChange}
                        setEditState={setEditState}
                        setValueState={setValueState}
                        valueState={valueState.subtotal}
                    />
                    <PaymentBlock
                        defaultValue={paymentDetails.deliveryCharge}
                        editState={editState.deliveryCharge}
                        itemKey="deliveryCharge"
                        itemLabel="Delivery Fee"
                        onCheck={manageDeliveryFeeChange}
                        setEditState={setEditState}
                        setValueState={setValueState}
                        valueState={valueState.deliveryCharge}
                    />
                    <PaymentBlock
                        calculateTax={calculateTax}
                        defaultValue={paymentDetails.tax}
                        editState={editState.tax}
                        itemKey="tax"
                        itemLabel="Tax"
                        onCheck={manageTaxChange}
                        setEditState={setEditState}
                        setValueState={setValueState}
                        valueState={valueState.tax}
                    />
                    <PaymentBlock
                        defaultValue={
                            paymentDetails.subtotal -
                            paymentDetails.discount +
                            paymentDetails.tax +
                            (paymentDetails.deliveryCharge || 0)
                        }
                        editState={editState.total}
                        itemKey="total"
                        itemLabel="Total (incl. tax)"
                        onCheck={() => ({})}
                        setEditState={setEditState}
                        setValueState={setValueState}
                        valueState={valueState.total}
                    />
                    <PaymentBlock
                        defaultValue={paymentDetails.discount}
                        editState={editState.discount}
                        itemKey="discount"
                        itemLabel="Discount"
                        onCheck={manageDiscountChange}
                        setEditState={setEditState}
                        setValueState={setValueState}
                        valueState={valueState.discount}
                    />
                    <PaymentBlock
                        defaultValue={paymentDetails.advancePaid}
                        editState={editState.advancePaid}
                        itemKey="advancePaid"
                        itemLabel="Advance Paid"
                        onCheck={manageAdvancePaidChange}
                        setEditState={setEditState}
                        setValueState={setValueState}
                        valueState={valueState.advancePaid}
                    />
                    <PaymentBlock
                        defaultValue={paymentDetails.pendingBalance}
                        editState={editState.pendingBalance}
                        itemKey="pendingBalance"
                        itemLabel="Pending Balance"
                        onCheck={() => ({})}
                        setEditState={setEditState}
                        setValueState={setValueState}
                        valueState={valueState.pendingBalance}
                    />
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <Label>Payment Method</Label>
                        </div>
                        <Select
                            name="paymentMethod"
                            onValueChange={(value) =>
                                setValueState((prev) => ({
                                    ...prev,
                                    paymentMethod: value,
                                }))
                            }
                            value={valueState.paymentMethod}
                        >
                            <SelectTrigger
                                className="col-span-2"
                                id="paymentMethod"
                            >
                                <SelectValue placeholder="payment" />
                            </SelectTrigger>
                            <SelectContent className="z-[1560]">
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="card">Card</SelectItem>
                                <SelectItem value="e-transfer">
                                    E-Transfer
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <Label>Fully Paid</Label>
                        </div>
                        <Select
                            name="fullyPaid"
                            onValueChange={(value) =>
                                setValueState((prev) => ({
                                    ...prev,
                                    fullyPaid: value === "true",
                                    pendingBalance:
                                        value === "true"
                                            ? 0
                                            : valueState.pendingBalance,
                                }))
                            }
                            value={String(valueState.fullyPaid)}
                        >
                            <SelectTrigger
                                className="col-span-2"
                                id="fullyPaid"
                            >
                                <SelectValue placeholder="fully paid" />
                            </SelectTrigger>
                            <SelectContent className="z-[1560]">
                                <SelectItem value="true">Yes</SelectItem>
                                <SelectItem value="false">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <ShadButton
                            disabled={loading}
                            onClick={resetPayments}
                            type="button"
                            variant="outline"
                        >
                            Cancel
                        </ShadButton>
                    </DialogClose>
                    <ShadButton
                        disabled={loading}
                        onClick={handleSubmit}
                        type="button"
                    >
                        Save changes
                    </ShadButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditPaymentDialog;
