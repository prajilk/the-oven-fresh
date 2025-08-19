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
import { ListFilter, Loader2, Pencil, Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { deleteStoreAction } from '@/actions/delete-store-action';
import { useStores } from '@/api-hooks/stores/get-stores';
import type { StoreDocument } from '@/models/types/store';
import DeleteDialog from '../dialog/delete-dialog';
import { Button } from '../ui/button';

export const columns = [
  // { name: "ID", uid: "_id" },
  { name: 'NAME', uid: 'name' },
  { name: 'ADDRESS', uid: 'address' },
  { name: 'PHONE', uid: 'phone' },
  { name: 'LOCATION', uid: 'location' },
  { name: 'ACTIONS', uid: 'actions' },
];

export default function StoresTable() {
  const [filterValue, setFilterValue] = React.useState('');

  const { data: stores, isPending } = useStores();

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filteredStores = stores ? [...stores] : [];

    if (hasSearchFilter) {
      filteredStores = filteredStores.filter((order) =>
        order.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredStores;
  }, [stores, filterValue, hasSearchFilter]);

  const renderCell = React.useCallback(
    (store: StoreDocument, columnKey: React.Key) => {
      const cellValue = store[columnKey as keyof StoreDocument];

      // biome-ignore lint/nursery/noUnnecessaryConditions: <Ignore>
      switch (columnKey) {
        case 'actions':
          return (
            <div className="flex items-center justify-center gap-2.5">
              <Link href={`/dashboard/stores/edit?id=${store._id}`}>
                <button type="button">
                  <Pencil
                    className="stroke-2 text-muted-foreground"
                    size={18}
                  />
                </button>
              </Link>
              <DeleteDialog
                action={deleteStoreAction}
                errorMsg="Failed to delete store."
                id={store._id}
                loadingMsg="Deleting store..."
                successMsg="Store deleted successfully."
                title="store"
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
            placeholder="Search by name or location"
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
            <Link href={'/dashboard/stores/add'}>
              <Button className="flex items-center gap-2" size={'sm'}>
                <Plus />
                Add store
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-default-400 text-small">
            Total {stores?.length} stores
          </span>
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, stores?.length, onClear]);

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
        {(item: StoreDocument) => (
          <TableRow key={item._id}>
            {(columnKey) => (
              // @ts-expect-error: item contain lat, lng, divideLine
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
