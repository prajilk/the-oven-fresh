import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import ItemCardSummary from "@/components/catering/select-items/item-card-summary";
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

export function OrderListDrawer() {
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
                        type="button"
                        disabled={!cateringOrder.length}
                    >
                        View order list
                    </Button>
                </DialogTrigger>
                <DialogContent className="flex flex-col max-w-xl z-[1550]">
                    <DialogHeader>
                        <DialogTitle>Order list</DialogTitle>
                    </DialogHeader>
                    <OrderListDialogContent
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
                    disabled={!cateringOrder.length}
                    type="button"
                >
                    View order list
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Order list</DrawerTitle>
                    </DrawerHeader>
                    <OrderListDialogContent
                        cateringOrder={cateringOrder}
                        cateringCustomItem={cateringCustomItem}
                    />
                    <DrawerFooter />
                </div>
            </DrawerContent>
        </Drawer>
    );
}

function OrderListDialogContent({
    cateringOrder,
    cateringCustomItem,
}: {
    cateringOrder: CateringItemsState[];
    cateringCustomItem: CateringCustomItemState[];
}) {
    return (
        <>
            {cateringOrder.map((item) => (
                <ItemCardSummary item={item} key={item._id} />
            ))}
            {cateringCustomItem.map((item, i) => (
                <ItemCardSummary
                    item={{
                        name: item.name,
                        size: item.size,
                        priceAtOrder: item.priceAtOrder,
                        quantity: 1,
                    }}
                    key={item.name + i}
                />
            ))}
        </>
    );
}
