import { ImageIcon, Trash2, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import type { CateringCustomItemState } from "@/lib/types/catering/catering-order-state";
import { removeCustomItem } from "@/store/slices/catering-custom-item-slice";
import { setAdvancePaid } from "@/store/slices/catering-order-slice";
import { getPieceTotalAmount, getTrayTotalAmount } from "@/lib/utils";

const FinalCustomItemCard = ({ item }: { item: CateringCustomItemState }) => {
    const dispatch = useDispatch();

    function handleRemoveItem(name: string) {
        dispatch(removeCustomItem({ itemDescription: name }));
        dispatch(setAdvancePaid(0));
    }

    return (
        <div className="mb-2 flex space-x-4 rounded-md border p-3 shadow">
            <div className="flex size-[70px] items-center justify-center rounded-md shadow">
                <ImageIcon size={15} />
            </div>
            <div className="flex-1">
                <h3 className="flex items-center gap-1 font-medium">
                    {item.itemDescription}{" "}
                </h3>
                <p className="text-gray-500 text-xs capitalize flex items-center gap-1">
                    {item.numberOfPieces
                        ? item.numberOfPieces + " pieces"
                        : `${item.numberOfTrays} ${item.traySize}  trays`}{" "}
                    <X className="size-2.5" /> ${item.rate.toFixed(2)}
                </p>
            </div>
            <div className="flex flex-col items-end justify-between">
                <p className="font-medium">
                    $
                    {item.numberOfTrays
                        ? getTrayTotalAmount(item.rate, item.numberOfTrays)
                        : getPieceTotalAmount(item.rate, item.numberOfPieces)}
                </p>
                <Button
                    className="bg-transparent text-red-500 hover:bg-red-200"
                    onClick={() => handleRemoveItem(item.itemDescription)}
                    size={"icon"}
                >
                    <Trash2 size={17} />
                </Button>
            </div>
        </div>
    );
};

export default FinalCustomItemCard;
