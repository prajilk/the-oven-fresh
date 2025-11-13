import { Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { addItem } from "@/store/slices/catering-custom-item-slice";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { type FormEvent, useState } from "react";
import { CateringCustomItemState } from "@/lib/types/catering/catering-order-state";
import CustomFormContent from "./custom-form-content";

const AddCustomItemDialog = () => {
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
    const dispatch = useDispatch();

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

    const handleSubmit = (e: FormEvent) => {
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

        dispatch(
            addItem({
                itemDescription: submitData.itemDescription,
                numberOfPersons: Number(submitData.numberOfPersons),
                rate: Number(submitData.rate),
                numberOfPieces: submitData.numberOfPieces,
                numberOfTrays: submitData.numberOfTrays,
                traySize: submitData.traySize,
            })
        );
        setFormData({
            itemDescription: "",
            numberOfPersons: "",
            selectedType: "tray",
            traySize: "",
            numberOfTrays: "",
            numberOfPieces: "",
            rate: "",
        });
    };

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
        // onOpenChange(newOpen)
    };

    const rateLabel =
        formData.selectedType === "tray" ? "Rate per Tray" : "Rate per Piece";

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2" size={"sm"}>
                    <Plus />
                    Add custom items
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Customer Entry Form
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the details below to create a item
                    </DialogDescription>
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

export default AddCustomItemDialog;
