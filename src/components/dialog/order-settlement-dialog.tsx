import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const OrderSettlementDialog = ({
  open,
  setOpen,
  updateOrderStatus,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateOrderStatus: (newStatus: 'DELIVERED', settlement?: boolean) => void;
}) => {
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Are you want to settle the payment for this order?
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Do you want to finalize the payment details for this order, mark it as
          fully paid, and clear any pending balance.
        </DialogDescription>
        <DialogFooter>
          <Button
            onClick={() => updateOrderStatus('DELIVERED')}
            variant={'outline'}
          >
            No
          </Button>
          <Button onClick={() => updateOrderStatus('DELIVERED', true)}>
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSettlementDialog;
