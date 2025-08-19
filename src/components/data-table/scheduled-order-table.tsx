'use client';

import { Button } from '@heroui/button';
import { Chip, type ChipProps } from '@heroui/chip';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown';
import { Input } from '@heroui/input';
import { Pagination } from '@heroui/pagination';
import {
  type Selection,
  type SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table';
import { Eye, ListFilter, Loader2, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import type { ScheduledOrderProps } from '@/lib/types/scheduled-order';
import DateFilter from '../scheduled-orders/date-filter';
// import { format } from "date-fns";

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';
}

export const columns = [
  { name: 'ID', uid: 'orderId' },
  { name: 'CUSTOMER', uid: 'customerName' },
  { name: 'PHONE', uid: 'customerPhone' },
  { name: 'ORDER', uid: 'order', sortable: true },
  { name: 'ORDER TYPE', uid: 'order_type' },
  { name: 'STATUS', uid: 'status' },
  { name: 'ACTIONS', uid: 'actions' },
];

const statusColorMap: Record<string, ChipProps['color']> = {
  DELIVERED: 'success',
  CANCELLED: 'danger',
  PENDING: 'warning',
  ONGOING: 'primary',
};

const INITIAL_VISIBLE_COLUMNS = [
  'customerName',
  'customerPhone',
  'order',
  'order_type',
  'status',
  'actions',
];

const orderOptions = [
  { name: 'Catering', uid: 'catering' },
  { name: 'Tiffin', uid: 'tiffin' },
];

export default function ScheduledOrderTable({
  orders,
  isPending,
  date,
  onDateChange,
}: {
  isPending: boolean;
  orders: ScheduledOrderProps[];
  date: Date;
  onDateChange: (date: Date) => void;
}) {
  const [orderFilter, setOrderFilter] = React.useState<Selection>('all');
  const [filterValue, setFilterValue] = React.useState('');
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'status',
    direction: 'descending',
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') {
      return columns;
    }

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredOrders = [...orders];

    if (hasSearchFilter) {
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.customerName
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          order.customerPhone.includes(filterValue)
      );
    }
    if (
      orderFilter !== 'all' &&
      Array.from(orderFilter).length !== orderOptions.length
    ) {
      filteredOrders = filteredOrders.filter((order) =>
        Array.from(orderFilter).includes(order.order.toLowerCase())
      );
    }

    return filteredOrders;
  }, [orders, filterValue, orderFilter, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(
    () =>
      [...items].sort((a: ScheduledOrderProps, b: ScheduledOrderProps) => {
        const first = a[
          sortDescriptor.column as keyof ScheduledOrderProps
        ] as unknown as number;
        const second = b[
          sortDescriptor.column as keyof ScheduledOrderProps
        ] as unknown as number;
        // biome-ignore lint/style/noNestedTernary: <Ignore>
        const cmp = first < second ? -1 : first > second ? 1 : 0;

        return sortDescriptor.direction === 'descending' ? -cmp : cmp;
      }),
    [sortDescriptor, items]
  );

  const renderCell = React.useCallback(
    (order: ScheduledOrderProps, columnKey: React.Key) => {
      const cellValue = order[columnKey as keyof ScheduledOrderProps];

      // biome-ignore lint/nursery/noUnnecessaryConditions: <Ignore>
      switch (columnKey) {
        case 'order':
          return cellValue.toUpperCase();
        case 'order_type':
          return capitalize(cellValue);
        case 'status':
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[order.status]}
              size="sm"
              variant="flat"
            >
              {cellValue?.toString()}
            </Chip>
          );
        case 'actions':
          return (
            <div className="flex items-center justify-center gap-2.5">
              <Link
                href={`orders/${order.order}-${
                  order.orderId
                }?mid=${order._id?.toString()}`}
              >
                <Eye className="stroke-2 text-muted-foreground" size={18} />
              </Link>
            </div>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue('');
    setPage(1);
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
            placeholder="Search by name or phone number..."
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
          <div className="flex items-end gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  className="h-9 rounded-md border border-dashed bg-white shadow-sm"
                  size="sm"
                  startContent={<PlusCircle className="h-4 w-4" />}
                  variant="bordered"
                >
                  Order Type
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Order Type"
                className="scrollbar-thin max-h-96 overflow-y-scroll"
                closeOnSelect={false}
                disallowEmptySelection
                onSelectionChange={setOrderFilter}
                selectedKeys={orderFilter}
                selectionMode="multiple"
              >
                {orderOptions.map((column) => (
                  <DropdownItem className="capitalize" key={column.uid}>
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  className="h-9 rounded-md border border-dashed bg-white shadow-sm"
                  size="sm"
                  startContent={<PlusCircle className="h-4 w-4" />}
                  variant="bordered"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Table Columns"
                className="scrollbar-thin max-h-96 overflow-y-scroll"
                closeOnSelect={false}
                disallowEmptySelection
                onSelectionChange={setVisibleColumns}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
              >
                {columns.map((column) => (
                  <DropdownItem className="capitalize" key={column.uid}>
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {/* Date Filter */}
            <DateFilter
              date={date}
              footer="Scheduled orders for"
              onSelect={onDateChange}
            />
          </div>
          {/* <div className="flex-1 flex justify-end gap-2">
                        <Button
                            size="sm"
                            radius="sm"
                            startContent={<Printer className="size-4" />}
                            variant="solid"
                            className="bg-white shadow hover:bg-gray-100 disabled:bg-gray-100 disabled:hover:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                            disabled={orders.length === 0}
                        >
                            {orders.length > 0 ? (
                                <Link
                                    href={`/summary/scheduled?date=${format(
                                        date || new Date(),
                                        "yyyy-MM-dd"
                                    )}`}
                                    target="_blank"
                                >
                                    Print Report
                                </Link>
                            ) : (
                                "Print Report"
                            )}
                        </Button>
                    </div> */}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-default-400 text-small">
            Total {orders?.length} orders
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent text-default-400 text-small outline-none"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    orderFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    onClear,
    date,
    onDateChange,
    orders,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <Pagination
          color="primary"
          isCompact
          onChange={setPage}
          page={page}
          showControls
          showShadow
          total={pages}
        />
        <div className="hidden w-[30%] justify-end gap-2 sm:flex">
          <Button
            isDisabled={pages === 1}
            onPress={onPreviousPage}
            size="sm"
            variant="flat"
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            onPress={onNextPage}
            size="sm"
            variant="flat"
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [
    // items.length,
    // hasSearchFilter,
    page,
    pages,
    onNextPage,
    onPreviousPage,
  ]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: 'max-h-[382px] scrollbar-none border shadow-md px-3',
      }}
      isHeaderSticky
      onSortChange={setSortDescriptor}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
    >
      <TableHeader columns={headerColumns}>
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
        items={sortedItems}
        loadingContent={<Loader2 className="animate-spin" />}
      >
        {(item: ScheduledOrderProps) => (
          <TableRow key={item.orderId}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
