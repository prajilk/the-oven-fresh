import { Trash2 } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { toast } from 'sonner';
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

const DeleteDialog = ({
  id,
  action,
  loadingMsg,
  successMsg,
  errorMsg,
  title,
  children,
}: {
  id: string;
  action: (id: string) => Promise<
    | {
        error: string;
        success?: undefined;
      }
    | {
        success: boolean;
        error?: undefined;
      }
  >;
  loadingMsg: string;
  successMsg: string;
  errorMsg: string;
  title: string;
  children?: ReactNode;
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  function handleSubmit() {
    setLoading(true);

    const promise = async () => {
      const result = await action(id);
      setLoading(false);
      setOpen(false);
      if (result.success) {
        return result;
      }
      throw result;
    };

    toast.promise(promise(), {
      loading: loadingMsg,
      success: () => successMsg,
      error: ({ error }) => (error ? error : errorMsg),
    });
  }
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <button type="button">
            <Trash2 className="stroke-2 text-danger" size={18} />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription className="text-sm">
            This action cannot be undone. This will permanently delete this{' '}
            {title} from the server.
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

export default DeleteDialog;
