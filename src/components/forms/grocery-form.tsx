import { Checkbox } from "@heroui/checkbox";
import { DateInput } from "@heroui/date-input";
import { CalendarDate } from "@internationalized/date";
import { useState } from "react";
import { toast } from "sonner";
import { addGroceryAction } from "@/actions/add-grocery-action";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ZodGrocerySchema } from "@/lib/zod-schema/schema";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const GroceryForm = ({
    setLoading,
}: {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [box, setBox] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [fields, setFields] = useState({
        item: "",
        quantity: "",
        unit: "",
        price: "",
        tax: "",
        total: "",
        purchasedFrom: "",
        date: null as CalendarDate | null,
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setFieldErrors({});

        const data = {
            ...fields,
            ...(box && { box: true, quantity: "0", unit: "none" }),
            date: fields.date?.toString(),
        };

        const result = ZodGrocerySchema.safeParse(data);

        if (!result.success) {
            const errors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                const field = err.path[0] as string;
                if (!errors[field]) errors[field] = err.message;
            });
            setFieldErrors(errors);
            toast.error("Please fix the errors below.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.set(key, String(value));
            }
        });

        const promise = async () => {
            const res = await addGroceryAction(formData);
            setLoading(false);
            if (res.success) {
                setFields({
                    item: "",
                    quantity: "",
                    unit: "",
                    price: "",
                    tax: "",
                    total: "",
                    purchasedFrom: "",
                    date: null,
                });
                setBox(false);
                return res;
            }
            throw res;
        };

        toast.promise(promise(), {
            loading: "Adding grocery...",
            success: () => "Grocery item added successfully.",
            error: ({ error }) => (error ? error : "Fail3ed to add grocery."),
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="grid gap-4 py-4"
            id="add-grocery-form"
        >
            <div className="grid grid-cols-4 items-center gap-2">
                <Label className="text-right" htmlFor="item">
                    Item
                </Label>
                <Input
                    className="col-span-3"
                    name="item"
                    placeholder="Item"
                    value={fields.item}
                    onChange={(e) =>
                        setFields((p) => ({ ...p, item: e.target.value }))
                    }
                />
                {fieldErrors.item && (
                    <p className="col-span-3 col-start-2 text-sm text-red-500">
                        {fieldErrors.item}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-4 items-center gap-2">
                <Label className="text-right" htmlFor="quantity">
                    Quantity
                </Label>
                <Input
                    className="col-span-1"
                    disabled={box}
                    name="quantity"
                    placeholder="Quantity"
                    value={fields.quantity}
                    onChange={(e) =>
                        setFields((p) => ({ ...p, quantity: e.target.value }))
                    }
                />
                <Select
                    disabled={box}
                    name="unit"
                    value={fields.unit}
                    onValueChange={(val) =>
                        setFields((p) => ({ ...p, unit: val }))
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent className="z-[1550]">
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="Kg">Kg</SelectItem>
                        <SelectItem value="g">g</SelectItem>
                        <SelectItem value="lbs">lbs</SelectItem>
                        <SelectItem value="Pcs">Pcs</SelectItem>
                        <SelectItem value="Nos">Nos</SelectItem>
                        <SelectItem value="none">none</SelectItem>
                    </SelectContent>
                </Select>
                <Checkbox isSelected={box} onValueChange={setBox} size="sm">
                    Box
                </Checkbox>
                {fieldErrors.quantity && (
                    <p className="col-span-3 col-start-2 text-sm text-red-500">
                        {fieldErrors.quantity}
                    </p>
                )}
                {fieldErrors.unit && (
                    <p className="col-span-3 col-start-2 text-sm text-red-500">
                        {fieldErrors.unit}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-4 items-center gap-2">
                <Label className="text-right" htmlFor="price">
                    Price
                </Label>
                <Input
                    className="col-span-3"
                    min="0"
                    name="price"
                    placeholder="Price"
                    step="0.01"
                    type="number"
                    value={fields.price}
                    onChange={(e) =>
                        setFields((p) => ({ ...p, price: e.target.value }))
                    }
                />
                {fieldErrors.price && (
                    <p className="col-span-3 col-start-2 text-sm text-red-500">
                        {fieldErrors.price}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-4 items-center gap-2">
                <Label className="text-right" htmlFor="tax">
                    Tax
                </Label>
                <Input
                    className="col-span-3"
                    min="0"
                    name="tax"
                    placeholder="Tax"
                    step="0.01"
                    type="number"
                    value={fields.tax}
                    onChange={(e) =>
                        setFields((p) => ({ ...p, tax: e.target.value }))
                    }
                />
                {fieldErrors.tax && (
                    <p className="col-span-3 col-start-2 text-sm text-red-500">
                        {fieldErrors.tax}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-4 items-center gap-2">
                <Label className="text-right" htmlFor="total">
                    Total amount
                </Label>
                <Input
                    className="col-span-3"
                    min="0"
                    name="total"
                    placeholder="Total Amount"
                    step="0.01"
                    type="number"
                    value={fields.total}
                    onChange={(e) =>
                        setFields((p) => ({ ...p, total: e.target.value }))
                    }
                />
                {fieldErrors.total && (
                    <p className="col-span-3 col-start-2 text-sm text-red-500">
                        {fieldErrors.total}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-4 items-center gap-2">
                <Label className="text-right" htmlFor="purchasedFrom">
                    Purchased from
                </Label>
                <Input
                    className="col-span-3"
                    name="purchasedFrom"
                    placeholder="Store name"
                    type="text"
                    value={fields.purchasedFrom}
                    onChange={(e) =>
                        setFields((p) => ({
                            ...p,
                            purchasedFrom: e.target.value,
                        }))
                    }
                />
                {fieldErrors.purchasedFrom && (
                    <p className="col-span-3 col-start-2 text-sm text-red-500">
                        {fieldErrors.purchasedFrom}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-4 items-center gap-2">
                <Label className="text-right" htmlFor="date">
                    Date
                </Label>
                <DateInput
                    aria-label="Date"
                    className="col-span-3"
                    name="date"
                    placeholderValue={new CalendarDate(1995, 11, 6)}
                    value={fields.date}
                    onChange={(val) => setFields((p) => ({ ...p, date: val }))}
                />
                {fieldErrors.date && (
                    <p className="col-span-3 col-start-2 text-sm text-red-500">
                        {fieldErrors.date}
                    </p>
                )}
            </div>
        </form>
    );
};

export default GroceryForm;
