import { Radio, RadioGroup } from "@heroui/radio";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Dispatch, SetStateAction } from "react";

type FormData = {
    itemDescription: string;
    rate: string;
    quantity: string;
    unit: string;
};

type CustomFormContentProps = {
    formData: FormData;
    setFormData: Dispatch<SetStateAction<FormData>>;
    errors: Record<string, string>;
    handleOpenChange: (newOpen: boolean) => void;
};

const CustomFormContent = ({
    formData,
    setFormData,
    errors,
    handleOpenChange,
}: CustomFormContentProps) => {
    return (
        <>
            <div className="space-y-3">
                {/* Item Description */}
                <div className="space-y-2">
                    <Label htmlFor="itemDescription" className="font-semibold">
                        Item Description
                    </Label>
                    <Input
                        id="itemDescription"
                        placeholder="e.g., Biryanis, Cakes..."
                        value={formData.itemDescription}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                itemDescription: e.target.value,
                            })
                        }
                        className={
                            errors.itemDescription ? "border-red-500" : ""
                        }
                    />
                    {errors.itemDescription && (
                        <p className="text-xs text-red-500">
                            {errors.itemDescription}
                        </p>
                    )}
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                    <Label htmlFor="quantity" className="font-semibold">
                        Quantity
                    </Label>
                    <Input
                        id="quantity"
                        type="number"
                        placeholder="Enter quantity"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                quantity: e.target.value,
                            })
                        }
                        className={errors.quantity ? "border-red-500" : ""}
                    />
                    {errors.quantity && (
                        <p className="text-xs text-red-500">
                            {errors.quantity}
                        </p>
                    )}
                </div>

                {/* Rate */}
                <div className="space-y-2">
                    <Label htmlFor="rate" className="font-semibold">
                        Rate
                    </Label>
                    <Input
                        id="rate"
                        type="number"
                        placeholder="Enter rate"
                        min="1"
                        step="0.01"
                        value={formData.rate}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                rate: e.target.value,
                            })
                        }
                        className={errors.rate ? "border-red-500" : ""}
                    />
                    {errors.rate && (
                        <p className="text-xs text-red-500">{errors.rate}</p>
                    )}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select
                    value={formData.unit}
                    onValueChange={(value) =>
                        setFormData({
                            ...formData,
                            unit: value,
                        })
                    }
                >
                    <SelectTrigger
                        className={errors.unit ? "border-red-500" : ""}
                    >
                        <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                    <SelectContent className="z-[1560]">
                        <SelectGroup>
                            <SelectLabel>Unit</SelectLabel>
                            <SelectItem value="full-tray">Full Tray</SelectItem>
                            <SelectItem value="med-tray">Med Tray</SelectItem>
                            <SelectItem value="small-tray">
                                Small Tray
                            </SelectItem>
                            <SelectItem value="pcs">Pcs</SelectItem>
                            <SelectItem value="nos">Nos</SelectItem>
                            <SelectItem value="ounce">Ounce</SelectItem>
                            <SelectItem value="litre">Litre</SelectItem>
                            <SelectItem value="pound">Pound</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {errors.unit && (
                    <p className="text-xs text-red-500">{errors.unit}</p>
                )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 col-span-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                    className="flex-1"
                >
                    Cancel
                </Button>
                <Button type="submit" className="flex-1">
                    Add Item
                </Button>
            </div>
        </>
    );
};

export default CustomFormContent;
