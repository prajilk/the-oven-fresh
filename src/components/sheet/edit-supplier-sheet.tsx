import { DateInput } from "@heroui/date-input";
import { parseDate } from "@internationalized/date";
import { format } from "date-fns";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { editSupplierAction } from "@/actions/supplier-action";
import { formatTimezone } from "@/lib/utils";
import { ZodSupplierSchema } from "@/lib/zod-schema/schema";
import type { SupplierDocument } from "@/models/types/supplier";
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

const EditSupplierSheet = ({ supplier }: { supplier: SupplierDocument }) => {
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

        formData.set("id", supplier._id);

        const promise = async () => {
            const result = await editSupplierAction(formData);
            setLoading(false);
            if (result.success) {
                return result;
            }
            throw result;
        };

        toast.promise(promise(), {
            loading: "Updating supplier invoice...",
            success: () => "Supplier invoice updated successfully.",
            error: ({ error }) =>
                error ? error : "Failed to update supplier invoice.",
        });
    }
    return (
        <Sheet>
            <SheetTrigger asChild>
                <button type="button">
                    <Pencil
                        className="stroke-2 text-muted-foreground"
                        size={18}
                    />
                </button>
            </SheetTrigger>
            <SheetContent className="w-[90%] sm:max-w-[35%]">
                <SheetHeader>
                    <SheetTitle>Edit supplier invoice</SheetTitle>
                </SheetHeader>
                <form
                    action={handleSubmit}
                    className="mt-5 space-y-3"
                    id="edit-supplier-form"
                >
                    <div className="space-y-1.5">
                        <Label className="text-right" htmlFor="invoice">
                            Invoice Number
                        </Label>
                        <Input
                            defaultValue={supplier.invoice}
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
                            defaultValue={supplier.name}
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
                            defaultValue={supplier.totalAmount}
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
                            defaultValue={parseDate(
                                format(
                                    formatTimezone(new Date(supplier.date)),
                                    "yyyy-MM-dd"
                                )
                            )}
                            name="date"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-right" htmlFor="paid">
                            Paid Amount
                        </Label>
                        <Input
                            defaultValue={supplier.paid}
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
                        form="edit-supplier-form"
                        isLoading={loading}
                        size={"sm"}
                        type="submit"
                    >
                        Edit
                    </LoadingButton>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default EditSupplierSheet;
