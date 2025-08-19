'use client';

import { Input } from '@heroui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table';
import { format } from 'date-fns';
import { ListFilter, Loader2, X } from 'lucide-react';
import React from 'react';
import { deleteGroceryAction } from '@/actions/delete-grocery-action';
import { useGroceries } from '@/api-hooks/grocery/get-groceries';
import type { GroceryDocument } from '@/models/types/grocery';
import AddGroceryDialog from '../dialog/add-grocery-dialog';
import DeleteDialog from '../dialog/delete-dialog';
import EditGroceryDialog from '../dialog/edit-grocery-dialog';
import DateFilter from '../scheduled-orders/date-filter';
import { Button } from '../ui/button';

export const columns = [
  { name: 'DATE', uid: 'date' },
  { name: 'ITEM', uid: 'item' },
  { name: 'QUANTITY', uid: 'quantity' },
  { name: 'PURCHASED FROM', uid: 'purchasedFrom' },
  { name: 'PRICE', uid: 'price' },
  { name: 'TAX', uid: 'tax' },
  { name: 'TOTAL', uid: 'total' },
  { name: 'ACTIONS', uid: 'actions' },
];

export default function GroceriesTable() {
  const [filterValue, setFilterValue] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState<Date | 'all'>('all');

  const { data: groceries, isPending } = useGroceries(selectedDate);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filteredGroceries = groceries ? [...groceries] : [];

    if (hasSearchFilter) {
      filteredGroceries = filteredGroceries.filter((grocery) =>
        grocery.item.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredGroceries;
  }, [groceries, filterValue, hasSearchFilter]);

  const renderCell = React.useCallback(
    (grocery: GroceryDocument, columnKey: React.Key) => {
      const cellValue = grocery[columnKey as keyof GroceryDocument];

      // biome-ignore lint/nursery/noUnnecessaryConditions: <Ignore>
      switch (columnKey) {
        case 'date':
          return format(cellValue as Date, 'PPP');
        case 'quantity':
          return `${cellValue ?? ''} ${
            grocery.unit === 'none' ? '' : grocery.unit
          }`;
        case 'price':
          return `$${cellValue}`;
        case 'tax':
          return `$${cellValue}`;
        case 'total':
          return `$${cellValue}`;
        case 'actions':
          return (
            <div className="flex items-center justify-center gap-2.5">
              <EditGroceryDialog grocery={grocery} />
              <DeleteDialog
                action={deleteGroceryAction}
                errorMsg="Failed to delete item."
                id={grocery._id}
                loadingMsg="Deleting category..."
                successMsg="Grocery item deleted successfully."
                title="grocery item"
              />
            </div>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue('');
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue('');
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <Input
            className="md:max-w-80"
            classNames={{
              inputWrapper: 'rounded-md bg-white border h-9',
            }}
            isClearable
            onClear={() => onClear()}
            onValueChange={onSearchChange}
            placeholder="Search by items"
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
          {/* Date Filter */}
          <DateFilter
            date={selectedDate === 'all' ? new Date() : selectedDate}
            footer="Groceries bought on"
            onSelect={setSelectedDate}
          />
          {selectedDate !== 'all' && (
            <Button
              className="rounded-full"
              onClick={() => setSelectedDate('all')}
              size={'icon'}
              variant={'outline'}
            >
              <X size={15} />
            </Button>
          )}
          <div className="flex flex-1 justify-end gap-2">
            <AddGroceryDialog />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-default-400 text-small">
            Total {groceries?.length} grocery items
          </span>
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, groceries?.length, onClear, selectedDate]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      bottomContentPlacement="outside"
      classNames={{
        wrapper: 'max-h-[382px] scrollbar-none border shadow-md px-3',
      }}
      isHeaderSticky
      topContent={topContent}
      topContentPlacement="outside"
    >
      <TableHeader columns={columns}>
        {(column: { uid: string; sortable?: boolean; name: string }) => (
          <TableColumn
            align={column.uid === 'actions' ? 'center' : 'start'}
            allowsSorting={column.sortable}
            key={column.uid}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={'No orders found'}
        isLoading={isPending}
        items={filteredItems}
        loadingContent={<Loader2 className="animate-spin" />}
      >
        {(item: GroceryDocument) => (
          <TableRow key={item._id}>
            {(columnKey) => (
              // @ts-expect-error: columnKey is of type keyof GroceryDocument
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
