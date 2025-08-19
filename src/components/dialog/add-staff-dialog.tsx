import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { addStaffAction } from '@/actions/add-staff-action';
import { ZodUserSchemaWithPassword } from '@/lib/zod-schema/schema';
import type { StoreDocument } from '@/models/types/store';
import RoleSelect from '../select/role-select';
import StoreSelectStaff from '../select/store-select-staff';
import { Button } from '../ui/button';
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

const AddStaffDialog = ({ stores }: { stores: StoreDocument[] }) => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string>('');
  const [store, setStore] = useState<string>('');

  function handleSubmit(formData: FormData) {
    setLoading(true);

    const data = Object.fromEntries(formData);
    const result = ZodUserSchemaWithPassword.safeParse(data);
    if (!result.success || result.data.password?.trim() === '') {
      toast.error('Invalid data format.');
      setLoading(false);
      return;
    }

    const promise = async () => {
      const result = await addStaffAction(formData);
      setLoading(false);
      setRole('');
      setStore('');
      if (result.success) {
        return result;
      }
      throw result;
    };

    toast.promise(promise(), {
      loading: 'Creating staff...',
      success: () => 'Staff created successfully.',
      error: ({ error }) => (error ? error : 'Failed to create staff.'),
    });
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2" size={'sm'}>
          <Plus />
          Add staff
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new staff</DialogTitle>
        </DialogHeader>
        <form
          action={handleSubmit}
          className="y-4 grid gap-4"
          id="add-staff-form"
        >
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right" htmlFor="username">
              Username
            </Label>
            <Input
              className="col-span-3"
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
            form="add-staff-form"
            isLoading={loading}
            size={'sm'}
            type="submit"
          >
            Create
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffDialog;
