import { Radio, RadioGroup } from "@heroui/radio";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Dispatch, SetStateAction } from "react";

type FormData = {
    itemDescription: string;
    numberOfPersons: string;
    selectedType: string;
    traySize: string;
    numberOfTrays: string;
    numberOfPieces: string;
    rate: string;
};

type CustomFormContentProps = {
    formData: FormData;
    setFormData: Dispatch<SetStateAction<FormData>>;
    errors: Record<string, string>;
    rateLabel: "Rate per Tray" | "Rate per Piece";
    handleOpenChange: (newOpen: boolean) => void;
};

const CustomFormContent = ({
    formData,
    setFormData,
    errors,
    rateLabel,
    handleOpenChange,
}: CustomFormContentProps) => {
    return (
        <>
            <div className="space-y-5">
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
                        <p className="text-sm text-red-500">
                            {errors.itemDescription}
                        </p>
                    )}
                </div>

                {/* Number of Persons */}
                <div className="space-y-2">
                    <Label htmlFor="numberOfPersons" className="font-semibold">
                        Number of Persons
                    </Label>
                    <Input
                        id="numberOfPersons"
                        type="number"
                        placeholder="Enter number of persons"
                        min="1"
                        value={formData.numberOfPersons}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                numberOfPersons: e.target.value,
                            })
                        }
                        className={
                            errors.numberOfPersons ? "border-red-500" : ""
                        }
                    />
                    {errors.numberOfPersons && (
                        <p className="text-sm text-red-500">
                            {errors.numberOfPersons}
                        </p>
                    )}
                </div>
            </div>
            <div className="space-y-3">
                {/* Tray vs Pieces Selection */}
                <Card className="p-4 border-2 border-slate-200 bg-slate-50">
                    <Label className="font-semibold mb-3 block">
                        Select Order Type
                    </Label>
                    <RadioGroup
                        value={formData.selectedType}
                        onValueChange={(value) =>
                            setFormData({
                                ...formData,
                                selectedType: value,
                                traySize: "",
                                numberOfTrays: "",
                                numberOfPieces: "",
                                rate: "",
                            })
                        }
                        className="space-y-3"
                    >
                        <div className="flex items-center space-x-2">
                            <Radio value="tray" id="tray" />
                            <Label
                                htmlFor="tray"
                                className="font-normal cursor-pointer"
                            >
                                By Tray Size
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Radio value="pieces" id="pieces" />
                            <Label
                                htmlFor="pieces"
                                className="font-normal cursor-pointer"
                            >
                                By Number of Pieces
                            </Label>
                        </div>
                    </RadioGroup>
                </Card>

                {/* Tray Size Fields (shown only if tray is selected) */}
                {formData.selectedType === "tray" && (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="traySize" className="font-semibold">
                                Tray Size *
                            </Label>
                            <Select
                                value={formData.traySize}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        traySize: value,
                                    })
                                }
                            >
                                <SelectTrigger
                                    id="traySize"
                                    className={
                                        errors.traySize ? "border-red-500" : ""
                                    }
                                >
                                    <SelectValue placeholder="Select tray size" />
                                </SelectTrigger>
                                <SelectContent className="z-[1560]">
                                    <SelectItem value="small">Small</SelectItem>
                                    <SelectItem value="medium">
                                        Medium
                                    </SelectItem>
                                    <SelectItem value="large">Large</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.traySize && (
                                <p className="text-sm text-red-500">
                                    {errors.traySize}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="numberOfTrays"
                                className="font-semibold"
                            >
                                Number of Trays *
                            </Label>
                            <Input
                                id="numberOfTrays"
                                type="number"
                                placeholder="Enter number of trays"
                                min="1"
                                value={formData.numberOfTrays}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        numberOfTrays: e.target.value,
                                    })
                                }
                                className={
                                    errors.numberOfTrays ? "border-red-500" : ""
                                }
                            />
                            {errors.numberOfTrays && (
                                <p className="text-sm text-red-500">
                                    {errors.numberOfTrays}
                                </p>
                            )}
                        </div>
                    </>
                )}

                {/* Number of Pieces Field (shown only if pieces is selected) */}
                {formData.selectedType === "pieces" && (
                    <div className="space-y-2">
                        <Label
                            htmlFor="numberOfPieces"
                            className="font-semibold"
                        >
                            Number of Pieces *
                        </Label>
                        <Input
                            id="numberOfPieces"
                            type="number"
                            placeholder="Enter number of pieces"
                            min="1"
                            value={formData.numberOfPieces}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    numberOfPieces: e.target.value,
                                })
                            }
                            className={
                                errors.numberOfPieces ? "border-red-500" : ""
                            }
                        />
                        {errors.numberOfPieces && (
                            <p className="text-sm text-red-500">
                                {errors.numberOfPieces}
                            </p>
                        )}
                    </div>
                )}

                {/* Rate (Dynamic label based on selection) */}
                <div className="space-y-2">
                    <Label htmlFor="rate" className="font-semibold">
                        {rateLabel} *
                    </Label>
                    <Input
                        id="rate"
                        type="number"
                        placeholder={`Enter ${rateLabel.toLowerCase()}`}
                        step="0.01"
                        min="0"
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
                        <p className="text-sm text-red-500">{errors.rate}</p>
                    )}
                </div>
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
