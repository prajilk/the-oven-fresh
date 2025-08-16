import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
    CateringCustomItemState,
    CateringItemsState,
} from "@/lib/types/catering/catering-order-state";
import { useMediaQuery } from "@mui/material";
import { useState } from "react";

export function PaymentDetailsDrawer() {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const cateringOrder = useSelector((state: RootState) => state.cateringItem);
    const cateringCustomItem = useSelector(
        (state: RootState) => state.cateringCustomItem
    );

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant={"link"}
                        size={"sm"}
                        className="underline"
                        disabled={!cateringOrder.length}
                        type="button"
                    >
                        View payment details
                    </Button>
                </DialogTrigger>
                <DialogContent className="flex flex-col max-w-xl z-[1550]">
                    <DialogHeader>
                        <DialogTitle>Payment details</DialogTitle>
                    </DialogHeader>
                    <PaymentDialogContent
                        cateringOrder={cateringOrder}
                        cateringCustomItem={cateringCustomItem}
                    />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button
                    variant={"link"}
                    size={"sm"}
                    className="underline"
                    type="button"
                >
                    View payment details
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Payment details</DrawerTitle>
                </DrawerHeader>
                <div className="px-4">
                    <PaymentDialogContent
                        cateringOrder={cateringOrder}
                        cateringCustomItem={cateringCustomItem}
                    />
                </div>
                <DrawerFooter />
            </DrawerContent>
        </Drawer>
    );
}

function PaymentDialogContent({
    cateringOrder,
    cateringCustomItem,
}: {
    cateringOrder: CateringItemsState[];
    cateringCustomItem: CateringCustomItemState[];
}) {
    const total = cateringOrder.reduce(
        (acc, item) => acc + item.priceAtOrder * item.quantity,
        0
    );
    const totalCustomItem = cateringCustomItem.reduce(
        (acc, item) => acc + item.priceAtOrder,
        0
    );

    const tax =
        ((total + totalCustomItem) *
            Number(process.env.NEXT_PUBLIC_TAX_AMOUNT || 0)) /
        100;
    const totalPayment = total + tax;
    return (
        <div className="bg-gray-100 rounded-md p-2 mt-1">
            <h2 className="text-xl mb-4">Payment Summary</h2>

            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Sub Total</span>
                    <span className="font-medium">
                        ${total + totalCustomItem}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Payment</span>
                    <span className="font-medium">
                        ${totalPayment.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}
