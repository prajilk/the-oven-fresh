import { useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import LoadingButton from '../ui/loading-button';

const DeleteStaffDialog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  function handleSubmit() {
    setLoading(true);

    const promise = async () => {
      const result = await authClient.admin.removeUser({
        userId: id,
      });
      setLoading(false);
      setOpen(false);
      if (result.data?.success) {
        queryClient.invalidateQueries({
          queryKey: ['staffs'],
        });
        return result;
      }
      throw result;
    };

    toast.promise(promise(), {
      loading: 'Deleting staff...',
      success: () => 'Staff deleted successfully.',
      error: ({ error }) => (error ? error : 'Failed to delete staff.'),
    });
  }
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <button type="button">
          <Trash2 className="stroke-2 text-danger" size={18} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription className="text-sm">
            This action cannot be undone. This will permanently delete this
            staff from the server.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button
              className="bg-destructive/10 text-destructive hover:bg-destructive/30 hover:text-destructive"
              variant="ghost"
            >
              Cancel
            </Button>
          </DialogClose>
          <LoadingButton isLoading={loading} onClick={handleSubmit}>
            Continue
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStaffDialog;
