import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const OrderSettlementDialog = ({
    open,
    setOpen,
    updateOrderStatus,
    deliveryOrPickup,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    updateOrderStatus: (
        newStatus: "DELIVERED" | "PICKUP",
        settlement?: boolean
    ) => void;
    deliveryOrPickup: "DELIVERED" | "PICKUP";
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
                    Do you want to finalize the payment details for this order,
                    mark it as fully paid, and clear any pending balance.
                </DialogDescription>
                <DialogFooter>
                    <Button
                        onClick={() => updateOrderStatus(deliveryOrPickup)}
                        variant={"outline"}
                    >
                        No
                    </Button>
                    <Button
                        onClick={() =>
                            updateOrderStatus(deliveryOrPickup, true)
                        }
                    >
                        Yes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default OrderSettlementDialog;
