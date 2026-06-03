"use client";

import { type FormEvent, type ReactNode, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import CustomFormContent from "./custom-form-content";
import { CateringCustomItemState } from "@/lib/types/catering/catering-order-state";
import { saveCustomItemAction } from "@/actions/save-custom-item-action";
import { toast } from "sonner";
import { editCustomMenuAction } from "@/actions/edit-custom-menu-action";

const SaveCustomItemDialog = ({
    children,
    action = "add",
    defaultItem,
}: {
    children: ReactNode;
    defaultItem?: CateringCustomItemState & { _id: string };
    action?: "edit" | "add";
}) => {
    const [formData, setFormData] = useState(
        action === "add"
            ? {
                  itemDescription: "",
                  rate: "",
                  quantity: "",
                  unit: "",
              }
            : {
                  itemDescription: defaultItem?.itemDescription || "",
                  rate: String(defaultItem?.rate) || "",
                  quantity: String(defaultItem?.quantity) || "",
                  unit: defaultItem?.unit || "",
              }
    );
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

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
        setLoading(true);

        if (!validateForm()) {
            return;
        }

        const submitData: CateringCustomItemState = {
            itemDescription: formData.itemDescription,
            rate: Number(formData.rate),
            quantity: Number(formData.quantity),
            unit: formData.unit,
        };

        // Call server action here to save
        const promise = async () => {
            const result =
                action === "add"
                    ? await saveCustomItemAction(submitData)
                    : await editCustomMenuAction(defaultItem?._id!, submitData);
            setLoading(false);
            if (result.success) {
                if (action === "add") {
                    setFormData({
                        itemDescription: "",
                        rate: "",
                        quantity: "",
                        unit: "",
                    });
                }
                return result;
            }
            throw result;
        };

        toast.promise(promise(), {
            loading:
                action === "add"
                    ? "Saving menu item..."
                    : "Updating menu item...",
            success: () =>
                action === "add"
                    ? "Menu item saved successfully."
                    : "Menu item updated successfully.",
            error: ({ error }) =>
                error
                    ? error
                    : action === "add"
                    ? "Failed to save menu item."
                    : "Failed to update menu item.",
        });
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
                        disabled={loading}
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default SaveCustomItemDialog;
