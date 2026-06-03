"use client";

import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { CateringCustomMenuDocument } from "@/models/types/catering-menu";
import type { RootState } from "@/store";
import {
    decrementQuantity,
    incrementQuantity,
} from "@/store/slices/catering-custom-item-slice";

type CustomItemCardProps = {
    item: CateringCustomMenuDocument;
};

const CustomItemCard = ({ item }: CustomItemCardProps) => {
    const cateringOrder = useSelector(
        (state: RootState) => state.cateringCustomItem
    );
    const dispatch = useDispatch();

    const handleIncrement = () => {
        dispatch(
            incrementQuantity({
                _id: item._id,
                itemDescription: item.itemDescription,
                quantity: item.quantity,
                rate: item.rate,
                unit: item.unit,
            })
        );
    };

    const handleDecrement = () => {
        dispatch(
            decrementQuantity({
                _id: item._id,
                itemDescription: item.itemDescription,
                rate: item.rate,
                quantity: item.quantity,
                unit: item.unit,
            })
        );
    };

    const quantity =
        cateringOrder.find((orderItem) => orderItem._id === item._id)
            ?.quantity || 0;

    return (
        <Card key={item._id}>
            <div className="flex items-center border-b p-3">
                <div className="relative mr-3 h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                        alt={"image"}
                        className="h-full w-full object-cover"
                        fill
                        src={"/fsr-placeholder.webp"}
                    />
                </div>
                <div>
                    <h3 className="font-medium">{item.itemDescription}</h3>
                    <p className="text-xs tracking-wide text-gray-500 mt-0.5">
                        {item.quantity} {item.unit}
                    </p>
                </div>
            </div>
            <CardContent className="p-3"></CardContent>
            <CardFooter className="p-3 pt-0">
                <span className="text-lg font-medium">${item.rate}</span>
                <div className="ms-auto flex items-center rounded-full bg-gray-200 p-0.5">
                    <Button
                        className="flex size-9 items-center justify-center rounded-full bg-white text-black shadow-sm hover:bg-white/50"
                        disabled={quantity === 0}
                        onClick={handleDecrement}
                        size={"icon"}
                        type="button"
                    >
                        <Minus size={15} />
                    </Button>
                    <div className="w-6 select-none text-center">
                        {quantity}
                    </div>
                    <Button
                        className="flex size-9 items-center justify-center rounded-full bg-primary shadow-sm"
                        onClick={handleIncrement}
                        size={"icon"}
                        type="button"
                    >
                        <Plus size={15} />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export default CustomItemCard;
