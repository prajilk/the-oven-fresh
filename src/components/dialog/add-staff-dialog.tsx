import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import StoreSelectStaff from "../select/store-select-staff";
import RoleSelect from "../select/role-select";
import LoadingButton from "../ui/loading-button";
import { ZodUserSchemaWithPassword } from "@/lib/zod-schema/schema";
import { toast } from "sonner";
import { useState } from "react";
import { addStaffAction } from "@/actions/add-staff-action";
import { StoreDocument } from "@/models/types/store";

const AddStaffDialog = ({ stores }: { stores: StoreDocument[] }) => {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState<string>("");
    const [store, setStore] = useState<string>("");

    function handleSubmit(formData: FormData) {
        setLoading(true);

        const data = Object.fromEntries(formData);
        const result = ZodUserSchemaWithPassword.safeParse(data);
        if (!result.success) {
            toast.error("Invalid data format.");
            setLoading(false);
            return;
        }

        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await addStaffAction(formData);
                setLoading(false);
                setRole("");
                setStore("");
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Creating staff...",
            success: () => "Staff created successfully.",
            error: ({ error }) => (error ? error : "Failed to create staff."),
        });
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={"sm"} className="flex items-center gap-2">
                    <Plus />
                    Add staff
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add new staff</DialogTitle>
                </DialogHeader>
                <form
                    id="add-staff-form"
                    action={handleSubmit}
                    className="grid gap-4 py-4"
                >
                    <div className="grid grid-cols-4 gap-2 items-center">
                        <Label htmlFor="username" className="text-right">
                            Username
                        </Label>
                        <Input
                            placeholder="Username"
                            name="username"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center">
                        <Label htmlFor="role" className="text-right">
                            Role
                        </Label>
                        <RoleSelect value={role} setValue={setRole} />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center">
                        <Label htmlFor="password" className="text-right">
                            Password
                        </Label>
                        <Input
                            placeholder="Password"
                            name="password"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center">
                        <Label htmlFor="store" className="text-right">
                            Store
                        </Label>
                        <StoreSelectStaff
                            stores={stores}
                            value={store}
                            setValue={setStore}
                        />
                    </div>
                </form>
                <DialogFooter className="flex justify-end">
                    <LoadingButton
                        isLoading={loading}
                        size={"sm"}
                        type="submit"
                        form="add-staff-form"
                    >
                        Create
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddStaffDialog;
