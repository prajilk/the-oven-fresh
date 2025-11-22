"use client";

import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/table";
import { format } from "date-fns";
import { ListFilter, Loader2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { deleteSupplierAction } from "@/actions/delete-supplier-action";
import { useSuppliers } from "@/api-hooks/suppliers/get-suppliers";
import { formatTimezone } from "@/lib/utils";
import type { SupplierDocument } from "@/models/types/supplier";
import DeleteDialog from "../dialog/delete-dialog";
import AddSupplierSheet from "../sheet/add-supplier-sheet";
import EditSupplierSheet from "../sheet/edit-supplier-sheet";

export const columns = [
    { name: "INVOICE NO.", uid: "invoice" },
    { name: "NAME", uid: "name" },
    { name: "DATE", uid: "date" },
    { name: "TOTAL AMOUNT", uid: "totalAmount" },
    { name: "PAID", uid: "paid" },
    { name: "NET AMOUNT", uid: "balance" },
    { name: "STATUS", uid: "status" },
    { name: "ACTIONS", uid: "actions" },
];

export default function SupplierTable() {
    const [filterValue, setFilterValue] = useState("");

    const { data: suppliers, isPending } = useSuppliers();

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = useMemo(() => {
        let filteredSuppliers = suppliers ? [...suppliers] : [];

        if (hasSearchFilter) {
            filteredSuppliers = filteredSuppliers.filter((order) =>
                order.invoice.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filteredSuppliers;
    }, [suppliers, filterValue, hasSearchFilter]);

    const renderCell = useCallback(
        (supplier: SupplierDocument, columnKey: React.Key) => {
            const cellValue = supplier[columnKey as keyof SupplierDocument];

            switch (columnKey) {
                case "date":
                    return format(
                        formatTimezone(new Date(supplier.date)),
                        "yyyy-MM-dd"
                    );
                case "name":
                    return supplier.name !== "" ? supplier.name : "--";
                case "balance":
                    return `$${supplier.totalAmount - supplier.paid}`;
                case "paid":
                    return `$${supplier.paid}`;
                case "totalAmount":
                    return `$${supplier.totalAmount}`;
                case "status":
                    return (
                        <Chip
                            className={
                                supplier.status === "Fully Paid"
                                    ? "text-white"
                                    : "text-black"
                            }
                            color={
                                supplier.status === "Fully Paid"
                                    ? "success"
                                    : "secondary"
                            }
                            size="sm"
                        >
                            {supplier.status}
                        </Chip>
                    );
                case "actions":
                    return (
                        <div className="flex items-center justify-center gap-2.5">
                            <EditSupplierSheet supplier={supplier} />
                            <DeleteDialog
                                action={deleteSupplierAction}
                                errorMsg="Failed to delete supplier invoice."
                                id={supplier._id}
                                loadingMsg="Deleting supplier invoice..."
                                successMsg="Supplier invoice deleted successfully."
                                title="Invoice"
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
                        placeholder="Search by invoice"
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
                        <AddSupplierSheet />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-default-400 text-small">
                        Total {suppliers?.length} suppliers
                    </span>
                </div>
            </div>
        );
    }, [filterValue, onSearchChange, suppliers?.length, onClear]);

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
                emptyContent={"No data found"}
                isLoading={isPending}
                items={filteredItems}
                loadingContent={<Loader2 className="animate-spin" />}
            >
                {(item: SupplierDocument) => (
                    <TableRow key={item._id}>
                        {(columnKey) => (
                            <TableCell className="whitespace-nowrap">
                                {/* @ts-expect-error: cellValue is of type SupplierDocument */}
                                {renderCell(item, columnKey)}
                            </TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
