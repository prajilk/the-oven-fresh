import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { editStaffAction } from '@/actions/edit-staff-action';
import { ZodUserSchemaWithPassword } from '@/lib/zod-schema/schema';
import type { StoreDocument } from '@/models/types/store';
import type { UserDocumentPopulate } from '@/models/types/user';
import RoleSelect from '../select/role-select';
import StoreSelectStaff from '../select/store-select-staff';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import LoadingButton from '../ui/loading-button';

const EditStaffDialog = ({
  stores,
  staff,
}: {
  stores: StoreDocument[];
  staff: UserDocumentPopulate;
}) => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string>(staff.role);
  const [store, setStore] = useState<string>(staff.store._id);

  function handleSubmit(formData: FormData) {
    setLoading(true);

    formData.set('id', staff._id);
    const data = Object.fromEntries(formData);

    const result = ZodUserSchemaWithPassword.safeParse(data);

    if (!result.success) {
      toast.error('Invalid data format.');
      setLoading(false);
      return;
    }

    const promise = async () => {
      const result = await editStaffAction(formData);
      setLoading(false);
      if (result.success) {
        return result;
      }
      throw result;
    };

    toast.promise(promise(), {
      loading: 'Updating staff...',
      success: () => 'Staff updated successfully.',
      error: ({ error }) => (error ? error : 'Failed to update staff.'),
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button">
          <Pencil className="stroke-2 text-muted-foreground" size={18} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit staff</DialogTitle>
        </DialogHeader>
        <form
          action={handleSubmit}
          className="grid gap-4 py-4"
          id="edit-staff-form"
        >
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right" htmlFor="username">
              Username
            </Label>
            <Input
              className="col-span-3"
              defaultValue={staff.username}
              name="username"
              placeholder="Username"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right" htmlFor="displayUsername">
              Display Name
            </Label>
            <Input
              className="col-span-3"
              defaultValue={staff.displayUsername}
              name="displayUsername"
              placeholder="Display Name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right" htmlFor="role">
              Role
            </Label>
            <RoleSelect setValue={setRole} value={role} />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right" htmlFor="password">
              Password
            </Label>
            <Input
              className="col-span-3"
              name="password"
              placeholder="Password"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right" htmlFor="store">
              Store
            </Label>
            <StoreSelectStaff
              setValue={setStore}
              stores={stores}
              value={store}
            />
          </div>
        </form>
        <DialogFooter className="flex justify-end">
          <LoadingButton
            form="edit-staff-form"
            isLoading={loading}
            size={'sm'}
            type="submit"
          >
            Update
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditStaffDialog;
