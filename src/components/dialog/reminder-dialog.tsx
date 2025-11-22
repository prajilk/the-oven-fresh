"use client";

import { Badge } from "@heroui/badge";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import { addDays, format } from "date-fns";
import { CircleAlert, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { useOrderReminder } from "@/api-hooks/order-reminder";
import { Skeleton } from "../ui/skeleton";
import { Show } from "../show";

const today = new Date();

const links = [
    { label: "View today's orders", date: today },
    { label: "View tomorrow's orders", date: addDays(today, 1) },
    { label: "View day-after orders", date: addDays(today, 2) },
];

const ReminderDialog = () => {
    const [open, setOpen] = useState(false);
    const { data, isPending, isError } = useOrderReminder();

    useEffect(() => {
        const lastShown = localStorage.getItem("dialogShownDate");
        const today = new Date().toDateString();

        if (lastShown !== today) {
            setOpen(true); // show the dialog
            localStorage.setItem("dialogShownDate", today);
        }
    }, []);

    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild>
                <button className="flex items-center px-1" type="button">
                    <Badge
                        classNames={{
                            badge: "border-none min-h-2 min-w-2 w-2.5 h-2.5",
                        }}
                        color="danger"
                        content=""
                        placement="top-right"
                        shape="circle"
                    >
                        <NotificationsRoundedIcon className="text-primary-foreground" />
                    </Badge>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[70%]">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        Order Reminder
                    </DialogTitle>
                    <DialogDescription>
                        Overview of tiffins and catering orders.
                    </DialogDescription>
                </DialogHeader>
                <Show>
                    <Show.When isTrue={!isError}>
                        {/* Overview Section */}
                        <div className="grid grid-cols-3 gap-3">
                            {/* Today */}
                            <div className="rounded-lg border border-border bg-card p-4">
                                <div className="mb-3 font-semibold text-muted-foreground text-sm">
                                    Today
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Show>
                                            <Show.When isTrue={isPending}>
                                                <Skeleton className="h-5 w-20 rounded-md" />
                                                <Skeleton className="h-5 w-10 rounded-md" />
                                            </Show.When>
                                            <Show.Else>
                                                <span className="text-sm">
                                                    Tiffins:
                                                </span>
                                                <span className="font-bold text-lg text-primary">
                                                    {data?.today.tiffin}
                                                </span>
                                            </Show.Else>
                                        </Show>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Show>
                                            <Show.When isTrue={isPending}>
                                                <Skeleton className="h-5 w-24 rounded-md" />
                                                <Skeleton className="h-5 w-10 rounded-md" />
                                            </Show.When>
                                            <Show.Else>
                                                <span className="text-sm">
                                                    Catering:
                                                </span>
                                                <span className="font-bold text-lg text-primary">
                                                    {data?.today.catering}
                                                </span>
                                            </Show.Else>
                                        </Show>
                                    </div>
                                    <div className="border-border border-t pt-2">
                                        <div className="flex items-center justify-between">
                                            <Show>
                                                <Show.When isTrue={isPending}>
                                                    <Skeleton className="h-6 w-20 rounded-md" />
                                                    <Skeleton className="h-5 w-10 rounded-md" />
                                                </Show.When>
                                                <Show.Else>
                                                    <span className="font-semibold text-sm">
                                                        Total:
                                                    </span>
                                                    <span className="font-bold text-lg">
                                                        {(data?.today.tiffin ||
                                                            0) +
                                                            (data?.today
                                                                .catering || 0)}
                                                    </span>
                                                </Show.Else>
                                            </Show>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tomorrow */}
                            <div className="rounded-lg border border-border bg-card p-4">
                                <div className="mb-3 font-semibold text-muted-foreground text-sm">
                                    Tomorrow
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Show>
                                            <Show.When isTrue={isPending}>
                                                <Skeleton className="h-5 w-20 rounded-md" />
                                                <Skeleton className="h-5 w-10 rounded-md" />
                                            </Show.When>
                                            <Show.Else>
                                                <span className="text-sm">
                                                    Tiffins:
                                                </span>
                                                <span className="font-bold text-lg text-primary">
                                                    {data?.tomorrow.tiffin}
                                                </span>
                                            </Show.Else>
                                        </Show>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Show>
                                            <Show.When isTrue={isPending}>
                                                <Skeleton className="h-5 w-24 rounded-md" />
                                                <Skeleton className="h-5 w-10 rounded-md" />
                                            </Show.When>
                                            <Show.Else>
                                                <span className="text-sm">
                                                    Catering:
                                                </span>
                                                <span className="font-bold text-lg text-primary">
                                                    {data?.tomorrow.catering}
                                                </span>
                                            </Show.Else>
                                        </Show>
                                    </div>
                                    <div className="border-border border-t pt-2">
                                        <div className="flex items-center justify-between">
                                            <Show>
                                                <Show.When isTrue={isPending}>
                                                    <Skeleton className="h-6 w-20 rounded-md" />
                                                    <Skeleton className="h-5 w-10 rounded-md" />
                                                </Show.When>
                                                <Show.Else>
                                                    <span className="font-semibold text-sm">
                                                        Total:
                                                    </span>
                                                    <span className="font-bold text-lg">
                                                        {(data?.tomorrow
                                                            .tiffin || 0) +
                                                            (data?.tomorrow
                                                                .catering || 0)}
                                                    </span>
                                                </Show.Else>
                                            </Show>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Day After Tomorrow */}
                            <div className="rounded-lg border border-border bg-card p-4">
                                <div className="mb-3 font-semibold text-muted-foreground text-sm">
                                    Day After
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Show>
                                            <Show.When isTrue={isPending}>
                                                <Skeleton className="h-5 w-20 rounded-md" />
                                                <Skeleton className="h-5 w-10 rounded-md" />
                                            </Show.When>
                                            <Show.Else>
                                                <span className="text-sm">
                                                    Tiffins:
                                                </span>
                                                <span className="font-bold text-lg text-primary">
                                                    {data?.dayAfter.tiffin}
                                                </span>
                                            </Show.Else>
                                        </Show>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Show>
                                            <Show.When isTrue={isPending}>
                                                <Skeleton className="h-5 w-24 rounded-md" />
                                                <Skeleton className="h-5 w-10 rounded-md" />
                                            </Show.When>
                                            <Show.Else>
                                                <span className="text-sm">
                                                    Catering:
                                                </span>
                                                <span className="font-bold text-lg text-primary">
                                                    {data?.dayAfter.catering}
                                                </span>
                                            </Show.Else>
                                        </Show>
                                    </div>
                                    <div className="border-border border-t pt-2">
                                        <div className="flex items-center justify-between">
                                            <Show>
                                                <Show.When isTrue={isPending}>
                                                    <Skeleton className="h-6 w-20 rounded-md" />
                                                    <Skeleton className="h-5 w-10 rounded-md" />
                                                </Show.When>
                                                <Show.Else>
                                                    <span className="font-semibold text-sm">
                                                        Total:
                                                    </span>
                                                    <span className="font-bold text-lg">
                                                        {(data?.dayAfter
                                                            .tiffin || 0) +
                                                            (data?.dayAfter
                                                                .catering || 0)}
                                                    </span>
                                                </Show.Else>
                                            </Show>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {links.map(({ label, date }) => (
                                <Link
                                    className="w-full"
                                    href={`/dashboard/scheduled?date=${format(
                                        date,
                                        "MM-dd-yyyy"
                                    )}`}
                                    key={label}
                                >
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                    >
                                        {label} <SquareArrowOutUpRight />
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </Show.When>
                    <Show.Else>
                        <div className="flex w-full items-center justify-center gap-2 py-10 text-danger">
                            <CircleAlert size={20} /> Failed to fetch data!
                        </div>
                    </Show.Else>
                </Show>
            </DialogContent>
        </Dialog>
    );
};

export default ReminderDialog;
