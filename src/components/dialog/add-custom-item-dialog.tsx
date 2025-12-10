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

const AddCustomItemDialog2 = () => {
    const [formData, setFormData] = useState({
        itemDescription: "",
        quantity: "",
        rate: "",
        unit: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const dispatch = useDispatch();

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

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const submitData: CateringCustomItemState = {
            itemDescription: formData.itemDescription,
            quantity: Number(formData.quantity),
            rate: Number(formData.rate),
            unit: formData.unit,
        };

        dispatch(
            addItem({
                itemDescription: submitData.itemDescription,
                quantity: Number(submitData.quantity),
                rate: Number(submitData.rate),
                unit: submitData.unit,
            })
        );
        setFormData({
            itemDescription: "",
            rate: "",
            quantity: "",
            unit: "",
        });
    };

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
        // onOpenChange(newOpen)
    };

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
                        Customer Item Entry Form
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
                        setFormData={setFormData}
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddCustomItemDialog2;
