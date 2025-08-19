'use client';

import { Chip } from '@heroui/chip';
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
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { deleteCateringMenuAction } from '@/actions/delete-catering-menu-action';
import { useCateringMenu } from '@/api-hooks/catering/get-catering-menu';
import DeleteDialog from '@/components/dialog/delete-dialog';
import { Button } from '@/components/ui/button';
import { appendBracket } from '@/lib/utils';
import type { CateringMenuDocumentPopulate } from '@/models/types/catering-menu';

export const columns = [
  { name: 'IMAGE', uid: 'image' },
  { name: 'NAME', uid: 'name' },
  { name: 'CATEGORY', uid: 'category' },
  { name: 'SMALL', uid: 'smallPrice' },
  { name: 'MEDIUM', uid: 'mediumPrice' },
  { name: 'LARGE', uid: 'largePrice' },
  { name: 'DISABLED', uid: 'disabled' },
  { name: 'ACTIONS', uid: 'actions' },
];

export default function CateringMenuTable() {
  const [filterValue, setFilterValue] = React.useState('');

  const { data: menus, isPending } = useCateringMenu();

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filteredMenus = menus ? [...menus] : [];

    if (hasSearchFilter) {
      filteredMenus = filteredMenus.filter((grocery) =>
        grocery.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredMenus;
  }, [menus, filterValue, hasSearchFilter]);

  const renderCell = React.useCallback(
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <Ignore>
    (menu: CateringMenuDocumentPopulate, columnKey: React.Key) => {
      const cellValue = menu[columnKey as keyof CateringMenuDocumentPopulate];

      // biome-ignore lint/nursery/noUnnecessaryConditions: <Ignore>
      switch (columnKey) {
        case 'category':
          // @ts-expect-error: cellValue is of type CateringMenuDocumentPopulate
          return cellValue?.name;
        case 'name':
          return appendBracket(cellValue as string, menu.variant);
        case 'smallPrice':
          return cellValue
            ? appendBracket(cellValue as string, menu.smallServingSize, true)
            : '--';
        case 'mediumPrice':
          return cellValue
            ? appendBracket(cellValue as string, menu.mediumServingSize, true)
            : '--';
        case 'largePrice':
          return cellValue
            ? appendBracket(cellValue as string, menu.largeServingSize, true)
            : '--';
        case 'image':
          return (
            <Image
              alt="menu"
              className="rounded-md"
              height={40}
              src={(cellValue as string) || '/fsr-placeholder.webp'}
              width={40}
            />
          );
        case 'disabled':
          return (
            <Chip color={cellValue ? 'primary' : 'secondary'} size="sm">
              {cellValue ? 'Yes' : 'No'}
            </Chip>
          );
        case 'actions':
          return (
            <div className="flex items-center justify-center gap-2.5">
              <Button asChild size="sm" variant="ghost">
                <Link href={`/dashboard/menus/edit?id=${menu._id}`}>
                  <Pencil size={15} />
                </Link>
              </Button>
              <DeleteDialog
                action={deleteCateringMenuAction}
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
            <Button asChild className="flex items-center gap-2" size={'sm'}>
              <Link href={'/dashboard/menus/add'}>
                <Plus />
                Add catering menu
              </Link>
            </Button>
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
        emptyContent={'No menus found'}
        isLoading={isPending}
        items={filteredItems}
        loadingContent={<Loader2 className="animate-spin" />}
      >
        {(item: CateringMenuDocumentPopulate) => (
          <TableRow key={item._id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
