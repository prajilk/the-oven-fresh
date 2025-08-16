import { Info, Pencil } from "lucide-react";
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
import { UserDocumentPopulate } from "@/models/types/user";
import { StoreDocument } from "@/models/types/store";
import { editStaffAction } from "@/actions/edit-staff-action";

const EditStaffDialog = ({
    stores,
    staff,
}: {
    stores: StoreDocument[];
    staff: UserDocumentPopulate;
}) => {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState<string>(staff.role);
    const [store, setStore] = useState<string>(staff.storeId._id);

    function handleSubmit(formData: FormData) {
        setLoading(true);

        const data = Object.fromEntries(formData);

        const result = ZodUserSchemaWithPassword.safeParse(data);
        if (!result.success) {
            toast.error("Invalid data format.");
            setLoading(false);
            return;
        }

        formData.set("id", staff._id);

        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await editStaffAction(formData);
                setLoading(false);
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Updating staff...",
            success: () => "Staff updated successfully.",
            error: ({ error }) => (error ? error : "Failed to update staff."),
        });
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button>
                    <Pencil
                        size={18}
                        className="stroke-2 text-muted-foreground"
                    />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit staff</DialogTitle>
                </DialogHeader>
                <form
                    id="edit-staff-form"
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
                            defaultValue={staff.username}
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
                            defaultValue={staff.password}
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
                <div className="flex items-center gap-1">
                    <Info className="size-4" />
                    <span className="text-xs">
                        Staff need to log out and log back in to see the
                        changes.
                    </span>
                </div>
                <DialogFooter className="flex justify-end">
                    <LoadingButton
                        isLoading={loading}
                        size={"sm"}
                        type="submit"
                        form="edit-staff-form"
                    >
                        Update
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditStaffDialog;
