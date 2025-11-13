"use client";

import {
    type FormEvent,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import { generateOrderId } from "@/lib/utils";
import type { CateringDocument } from "@/models/types/catering";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import CustomFormContent from "./custom-form-content";
import { CateringCustomItemState } from "@/lib/types/catering/catering-order-state";

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
        numberOfPersons: "",
        selectedType: "tray", // 'tray' or 'pieces'
        traySize: "",
        numberOfTrays: "",
        numberOfPieces: "",
        rate: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.itemDescription.trim()) {
            newErrors.itemDescription = "Item description is required";
        }
        if (
            !formData.numberOfPersons ||
            Number(formData.numberOfPersons) <= 0
        ) {
            newErrors.numberOfPersons =
                "Number of persons must be greater than 0";
        }

        if (formData.selectedType === "tray") {
            if (!formData.traySize) {
                newErrors.traySize = "Tray size is required";
            }
            if (
                !formData.numberOfTrays ||
                Number(formData.numberOfTrays) <= 0
            ) {
                newErrors.numberOfTrays =
                    "Number of trays must be greater than 0";
            }
        } else {
            if (
                !formData.numberOfPieces ||
                Number(formData.numberOfPieces) <= 0
            ) {
                newErrors.numberOfPieces =
                    "Number of pieces must be greater than 0";
            }
        }

        if (!formData.rate || Number(formData.rate) <= 0) {
            newErrors.rate = "Rate must be greater than 0";
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
            numberOfPersons: Number(formData.numberOfPersons),
            rate: Number(formData.rate),
        };

        if (formData.selectedType === "tray") {
            submitData.traySize = formData.traySize;
            submitData.numberOfTrays = Number(formData.numberOfTrays);
        } else {
            submitData.numberOfPieces = Number(formData.numberOfPieces);
        }

        setCustomItems((prev) => [
            ...prev,
            {
                _id: generateOrderId(),
                ...submitData,
            },
        ]);
        setFormData({
            itemDescription: "",
            numberOfPersons: "",
            selectedType: "tray",
            traySize: "",
            numberOfTrays: "",
            numberOfPieces: "",
            rate: "",
        });

        enableSaveButton(true);
    }

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setFormData({
                itemDescription: "",
                numberOfPersons: "",
                selectedType: "tray",
                traySize: "",
                numberOfTrays: "",
                numberOfPieces: "",
                rate: "",
            });
            setErrors({});
        }
    };

    const rateLabel =
        formData.selectedType === "tray" ? "Rate per Tray" : "Rate per Piece";

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
                        rateLabel={rateLabel}
                        setFormData={setFormData}
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddCustomItemDirectDialog;
