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
import { ListFilter, Loader2 } from 'lucide-react';
import React from 'react';
import { deleteCategoryAction } from '@/actions/delete-category-action';
import { useCategories } from '@/api-hooks/get-catering-categories';
import type { CateringCategoryDocument } from '@/models/types/catering-category';
import AddCategoryDialog from '../dialog/add-category-dialog';
import DeleteDialog from '../dialog/delete-dialog';
import EditCategoryDialog from '../dialog/edit-category-dialog';

export const columns = [
  { name: 'NAME', uid: 'name' },
  { name: 'ACTIONS', uid: 'actions' },
];

export default function CateringCategoryTable() {
  const [filterValue, setFilterValue] = React.useState('');

  const { data: categories, isPending } = useCategories();

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filteredCategories = categories ? [...categories] : [];

    if (hasSearchFilter) {
      filteredCategories = filteredCategories.filter((category) =>
        category.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredCategories;
  }, [categories, filterValue, hasSearchFilter]);

  const renderCell = React.useCallback(
    (category: CateringCategoryDocument, columnKey: React.Key) => {
      const cellValue = category[columnKey as keyof CateringCategoryDocument];

      // biome-ignore lint/nursery/noUnnecessaryConditions: <Ignore>
      switch (columnKey) {
        case 'actions':
          return (
            <div className="flex items-center justify-center gap-2.5">
              <EditCategoryDialog id={category._id} name={category.name} />
              <DeleteDialog
                action={deleteCategoryAction}
                errorMsg="Failed to delete category."
                id={category._id}
                loadingMsg="Deleting category..."
                successMsg="Category deleted successfully."
                title="category"
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
          <div className="flex flex-1 justify-end gap-2">
            <AddCategoryDialog />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-default-400 text-small">
            Total {categories?.length} categories
          </span>
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, categories?.length, onClear]);

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
        {(item: CateringCategoryDocument) => (
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
