"use client";

import {
    type FormEvent,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import { generateOrderId } from "@/lib/utils";
import type { CateringDocument } from "@/models/types/catering";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import CustomFormContent from "./custom-form-content";
import { CateringCustomItemState } from "@/lib/types/catering/catering-order-state";
import type { ObjectId } from "mongoose";

const AddCustomItemDirectDialog = ({
    children,
    setCustomItems,
    enableSaveButton,
}: {
    children: React.ReactNode;
    setCustomItems: Dispatch<SetStateAction<CateringDocument["customItems"]>>;
    enableSaveButton: Dispatch<SetStateAction<boolean>>;
}) => {
    const [formData, setFormData] = useState({
        itemDescription: "",
        rate: "",
        quantity: "",
        unit: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.itemDescription.trim()) {
            newErrors.itemDescription = "Item description is required";
        }
        if (!formData.quantity || Number(formData.quantity) <= 0) {
            newErrors.quantity = "Quantity must be greater than 0";
        }

        if (!formData.rate || Number(formData.rate) <= 0) {
            newErrors.rate = "Rate must be greater than 0";
        }
        if (!formData.unit) {
            newErrors.unit = "Unit is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const submitData: CateringCustomItemState = {
            itemDescription: formData.itemDescription,
            rate: Number(formData.rate),
            quantity: Number(formData.quantity),
            unit: formData.unit,
        };

        setCustomItems((prev) => [
            ...prev,
            {
                _id: generateOrderId() as unknown as ObjectId,
                ...submitData,
            },
        ]);
        setFormData({
            itemDescription: "",
            rate: "",
            quantity: "",
            unit: "",
        });

        enableSaveButton(true);
    }

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setFormData({
                itemDescription: "",
                rate: "",
                quantity: "",
                unit: "",
            });
            setErrors({});
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Add custom item</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-2 gap-5"
                >
                    <CustomFormContent
                        errors={errors}
                        formData={formData}
                        handleOpenChange={handleOpenChange}
                        setFormData={setFormData}
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddCustomItemDirectDialog;
