import { cn } from "@heroui/theme";
import type { QueryClient } from "@tanstack/react-query";
import {
    ArrowLeft,
    ArrowRight,
    Loader2,
    SquareArrowOutUpRight,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { useSwapTrip } from "@/api-hooks/scheduled/swap-trip";
import { Show } from "../show";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";

const OrderCard = ({
    mid,
    orderId,
    address,
    status,
    orderType,
    storeId,
    trip,
}: {
    mid: string;
    orderId: string;
    address: string;
    status: string;
    orderType: "tiffin" | "catering";
    storeId: string;
    trip: number;
}) => {
    function onSuccess(queryClient: QueryClient) {
        queryClient.invalidateQueries({
            queryKey: ["order", "scheduled", storeId, "delivery"],
        });
        toast.success(`Order has been moved to Trip ${trip === 1 ? 2 : 1}!`);
    }
    const mutation = useSwapTrip(onSuccess);
    return (
        <div className="flex w-full items-center justify-between rounded-md border p-3 shadow-sm">
            <div>
                <h2 className="font-medium text-sm">
                    Order ID: {orderId} <CustomChip>{status}</CustomChip>
                </h2>
                <p className="text-xs">Address: {address}</p>
            </div>
            <div className="flex items-center gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href={`/dashboard/orders/${orderType}-${orderId}?mid=${mid}`}
                                target="_blank"
                            >
                                <button
                                    className="flex size-8 items-center justify-center rounded-md border bg-white shadow"
                                    type="button"
                                >
                                    <SquareArrowOutUpRight size={20} />
                                </button>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>View order details</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                className="flex size-8 items-center justify-center rounded-md border bg-white shadow disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={mutation.isPending}
                                onClick={() =>
                                    mutation.mutate({
                                        orderType,
                                        orderId: mid,
                                        trip: trip === 1 ? 2 : 1,
                                    })
                                }
                                type="button"
                            >
                                <Show>
                                    <Show.When isTrue={trip === 1}>
                                        <Show>
                                            <Show.When
                                                isTrue={mutation.isPending}
                                            >
                                                <Loader2 size={20} />
                                            </Show.When>
                                            <Show.Else>
                                                <ArrowRight size={20} />
                                            </Show.Else>
                                        </Show>
                                    </Show.When>
                                    <Show.Else>
                                        <Show>
                                            <Show.When
                                                isTrue={mutation.isPending}
                                            >
                                                <Loader2 size={20} />
                                            </Show.When>
                                            <Show.Else>
                                                <ArrowLeft size={20} />
                                            </Show.Else>
                                        </Show>
                                    </Show.Else>
                                </Show>
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Move to trip {trip === 1 ? 2 : 1}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
};

export default OrderCard;

function CustomChip({ children }: { children: ReactNode }) {
    const colorMap: Record<string, string> = {
        DELIVERED: "bg-success",
        PICKUP: "bg-success",
        ONGOING: "bg-warning",
        PENDING: "bg-primary",
    };
    return (
        <span
            className={cn(
                "rounded-md px-2 py-0.5 text-primary-foreground text-xs",
                colorMap[children as string]
            )}
        >
            {children}
        </span>
    );
}
