import { DateInput } from "@heroui/date-input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { addSupplierAction } from "@/actions/supplier-action";
import { ZodSupplierSchema } from "@/lib/zod-schema/schema";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import LoadingButton from "../ui/loading-button";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../ui/sheet";

const AddSupplierSheet = () => {
    const [loading, setLoading] = useState(false);

    function handleSubmit(formData: FormData) {
        setLoading(true);

        const data = Object.fromEntries(formData);
        const result = ZodSupplierSchema.safeParse(data);

        if (!result.success) {
            toast.error("Invalid data format.");
            setLoading(false);
            return;
        }

        const promise = async () => {
            const result = await addSupplierAction(formData);
            setLoading(false);
            if (result.success) {
                return result;
            }
            throw result;
        };

        toast.promise(promise(), {
            loading: "Adding supplier invoice...",
            success: () => "Supplier invoice added successfully.",
            error: ({ error }) => (error ? error : "Failed to add supplier."),
        });
    }
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className="flex items-center gap-2" size={"sm"}>
                    <Plus />
                    Add supplier
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[90%] sm:max-w-[35%]">
                <SheetHeader>
                    <SheetTitle>Add supplier</SheetTitle>
                </SheetHeader>
                <form
                    action={handleSubmit}
                    className="mt-5 space-y-3"
                    id="add-supplier-form"
                >
                    <div className="space-y-1.5">
                        <Label className="text-right" htmlFor="invoice">
                            Invoice Number
                        </Label>
                        <Input
                            name="invoice"
                            placeholder="Invoice Number"
                            type="text"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-right" htmlFor="name">
                            Name
                        </Label>
                        <Input
                            name="name"
                            placeholder="Name (Optional)"
                            type="text"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-right" htmlFor="totalAmount">
                            Total Amount
                        </Label>
                        <Input
                            min={0}
                            name="totalAmount"
                            placeholder="Total Amount"
                            step={0.01}
                            type="number"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-right" htmlFor="date">
                            Date
                        </Label>
                        <DateInput
                            classNames={{
                                inputWrapper: "rounded-md bg-white border h-9",
                            }}
                            name="date"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-right" htmlFor="paid">
                            Paid Amount
                        </Label>
                        <Input
                            defaultValue={0}
                            min={0}
                            name="paid"
                            placeholder="Paid Amount"
                            step={0.01}
                            type="number"
                        />
                    </div>
                </form>
                <SheetFooter className="mt-7 flex justify-end">
                    <LoadingButton
                        form="add-supplier-form"
                        isLoading={loading}
                        size={"sm"}
                        type="submit"
                    >
                        Add
                    </LoadingButton>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default AddSupplierSheet;
