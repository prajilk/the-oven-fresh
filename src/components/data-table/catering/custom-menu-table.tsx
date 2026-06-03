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
import { ListFilter, Loader2, Pencil, Plus } from "lucide-react";
import { type Key, useCallback, useMemo, useState } from "react";
import DeleteDialog from "@/components/dialog/delete-dialog";
import { Button } from "@/components/ui/button";
import type { CateringCustomMenuDocument } from "@/models/types/catering-menu";
import { useCateringCustomMenu } from "@/api-hooks/catering/get-catering-custom-menu";
import { deleteCateringCustomMenuAction } from "@/actions/delete-catering-custom-menu-action";
import SaveCustomItemDialog from "@/components/dialog/save-custom-item";

export const columns = [
    { name: "ITEM DESCRIPTION", uid: "itemDescription" },
    { name: "RATE", uid: "rate" },
    { name: "QUANTITY", uid: "quantity" },
    { name: "UNIT", uid: "unit" },
    { name: "ACTIONS", uid: "actions" },
];

export default function CateringCustomMenuTable() {
    const [filterValue, setFilterValue] = useState("");

    const { data: menus, isPending } = useCateringCustomMenu();

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = useMemo(() => {
        let filteredMenus = menus ? [...menus] : [];

        if (hasSearchFilter) {
            filteredMenus = filteredMenus.filter((menu) =>
                menu.itemDescription
                    .toLowerCase()
                    .includes(filterValue.toLowerCase())
            );
        }

        return filteredMenus;
    }, [menus, filterValue, hasSearchFilter]);

    const renderCell = useCallback(
        // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <Ignore>
        (menu: CateringCustomMenuDocument, columnKey: Key) => {
            const cellValue =
                menu[columnKey as keyof CateringCustomMenuDocument];

            // biome-ignore lint/nursery/noUnnecessaryConditions: <Ignore>
            switch (columnKey) {
                case "actions":
                    return (
                        <div className="flex items-center justify-center gap-2.5">
                            <SaveCustomItemDialog
                                action="edit"
                                defaultItem={menu}
                            >
                                <Button size="sm" variant="ghost">
                                    <Pencil size={15} />
                                </Button>
                            </SaveCustomItemDialog>
                            <DeleteDialog
                                action={deleteCateringCustomMenuAction}
                                errorMsg="Failed to delete item."
                                id={menu._id}
                                loadingMsg="Deleting item..."
                                successMsg="Menu item deleted successfully."
                                title="menu item"
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
                        placeholder="Search by menu items"
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
                        <SaveCustomItemDialog>
                            <Button
                                className="flex items-center gap-2"
                                size={"sm"}
                            >
                                <Plus />
                                Add menu
                            </Button>
                        </SaveCustomItemDialog>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-default-400 text-small">
                        Total {menus?.length} menu items
                    </span>
                </div>
            </div>
        );
    }, [filterValue, onSearchChange, menus?.length, onClear]);

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
                emptyContent={"No menus found"}
                isLoading={isPending}
                items={filteredItems}
                loadingContent={<Loader2 className="animate-spin" />}
            >
                {(item: CateringCustomMenuDocument) => (
                    <TableRow key={item._id}>
                        {(columnKey) => (
                            // biome-ignore lint/nursery/noUnnecessaryConditions: <Ignore>
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
