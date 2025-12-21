"use client";

import { Input } from "@heroui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/table";
import {
    BadgeCheckIcon,
    CircleAlert,
    Eye,
    ListFilter,
    Loader2,
    Plus,
} from "lucide-react";
import { Key, useCallback, useMemo, useState } from "react";
import { useQuotations } from "@/api-hooks/quotations/get-quotations";
import type { QuotationDocument } from "@/models/types/quotation";
import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import DeleteDialog from "../dialog/delete-dialog";
import { deleteQuotationAction } from "@/actions/delete-quotation-action";
import Whatsapp from "../icons/whatsapp";
import QuotationSentDialog from "../dialog/quotation-sent-dialog";
import { sendQuotationAction } from "@/actions/send-quotation-action";
import { toast } from "sonner";
import getQueryClient from "@/lib/query-utils/get-query-client";

export const columns = [
    { name: "QUOTATION ID", uid: "quotationId" },
    { name: "QUOTATION TYPE", uid: "quotationType" },
    { name: "SENT TO WHATSAPP", uid: "sentToWhatsApp" },
    { name: "ACTIONS", uid: "actions" },
];

export default function QuotationsTable() {
    const [filterValue, setFilterValue] = useState("");
    const [loading, setLoading] = useState(false);

    const { data: quotations, isPending } = useQuotations();

    const hasSearchFilter = Boolean(filterValue);

    const queryClient = getQueryClient();

    async function onSubmit(quotationId: string, phoneNumber: string) {
        if (!phoneNumber || phoneNumber === "" || phoneNumber.length < 10) {
            toast.error("Invalid whatsapp number provided.");
            return;
        }
        setLoading(true);
        const promise = async () => {
            const res = await sendQuotationAction(phoneNumber, quotationId);
            setLoading(false);
            if (res.success) {
                queryClient.invalidateQueries({
                    queryKey: ["quotation"],
                });
                return res;
            }
            throw res;
        };

        toast.promise(promise(), {
            loading: "Sending quotation...",
            success: () => "Quotation sent successfully.",
            error: ({ error }) => (error ? error : "Failed to send quotation."),
        });
    }

    const filteredItems = useMemo(() => {
        let filteredQuotations = quotations ? [...quotations] : [];

        if (hasSearchFilter) {
            filteredQuotations = filteredQuotations.filter((quotation) =>
                quotation.quotationId
                    .toLowerCase()
                    .includes(filterValue.toLowerCase())
            );
        }

        return filteredQuotations;
    }, [quotations, filterValue, hasSearchFilter]);

    const renderCell = useCallback(
        (quotation: QuotationDocument, columnKey: Key) => {
            const cellValue = quotation[columnKey as keyof QuotationDocument];

            switch (columnKey) {
                case "sentToWhatsApp":
                    return cellValue ? (
                        <Badge
                            variant="secondary"
                            className="bg-green-500 text-white dark:bg-green-600  rounded-full px-1.5 gap-1 hover:bg-green-500 hover:text-white"
                        >
                            <BadgeCheckIcon size={15} /> Yes
                        </Badge>
                    ) : (
                        <Badge
                            variant="secondary"
                            className="bg-warning-500 text-white dark:bg-warning-600 rounded-full px-1.5 gap-1 hover:bg-warning-500 hover:text-white"
                        >
                            <CircleAlert size={15} />
                            No
                        </Badge>
                    );
                case "actions":
                    return (
                        <div className="flex items-center justify-center gap-2.5">
                            <WhatsappAction
                                quotationId={quotation._id}
                                onSubmit={onSubmit}
                                loading={loading}
                            />
                            <Link
                                href={`/quotations?quotationId=${quotation._id}`}
                                target="_blank"
                            >
                                <Eye size={18} />
                            </Link>
                            <DeleteDialog
                                action={deleteQuotationAction}
                                errorMsg="Failed to delete quotation."
                                id={quotation._id}
                                loadingMsg="Deleting quotation..."
                                successMsg="Quotation deleted successfully."
                                title="Quotation"
                            />
                        </div>
                    );
                default:
                    return cellValue;
            }
        },
        []
    );

    const onSearchChange = useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = useCallback(() => {
        setFilterValue("");
    }, []);

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-end gap-3">
                    <Input
                        className="md:max-w-80"
                        classNames={{
                            inputWrapper: "rounded-md bg-white border h-9",
                        }}
                        isClearable
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                        placeholder="Search by Quotation id"
                        size="sm"
                        startContent={
                            <ListFilter
                                aria-hidden="true"
                                className="text-muted-foreground"
                                size={16}
                                strokeWidth={2}
                            />
                        }
                        value={filterValue}
                    />
                    <div className="flex flex-1 justify-end gap-2">
                        <Link href="/dashboard/quotations/add">
                            <Button
                                className="flex items-center gap-2"
                                size={"sm"}
                            >
                                <Plus />
                                Create new quotation
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-default-400 text-small">
                        Total {quotations?.length} quotations
                    </span>
                </div>
            </div>
        );
    }, [filterValue, onSearchChange, quotations?.length, onClear]);

    return (
        <Table
            aria-label="Example table with custom cells, pagination and sorting"
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "max-h-[382px] scrollbar-none border shadow-md px-3",
            }}
            isHeaderSticky
            topContent={topContent}
            topContentPlacement="outside"
        >
            <TableHeader columns={columns}>
                {(column: {
                    uid: string;
                    sortable?: boolean;
                    name: string;
                }) => (
                    <TableColumn
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={column.sortable}
                        key={column.uid}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                emptyContent={"No Quotations found"}
                isLoading={isPending}
                items={filteredItems}
                loadingContent={<Loader2 className="animate-spin" />}
            >
                {(item: QuotationDocument) => (
                    <TableRow key={item._id}>
                        {(columnKey) => (
                            // @ts-expect-error: cellValue is of type StoreDocument
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

const WhatsappAction = ({
    quotationId,
    onSubmit,
    loading,
}: {
    quotationId: string;
    onSubmit: (id: string, phone: string) => void;
    loading: boolean;
}) => {
    // Each row now has its own state, so typing in one won't affect others
    const [localNumber, setLocalNumber] = useState("");

    return (
        <QuotationSentDialog
            whatsappNumber={localNumber}
            onChange={(v) => setLocalNumber(v || "")}
            onSubmit={() => onSubmit(quotationId, localNumber)}
        >
            <button disabled={loading}>
                <Whatsapp />
            </button>
        </QuotationSentDialog>
    );
};
