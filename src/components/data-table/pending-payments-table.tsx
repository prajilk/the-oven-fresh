import { Button } from '@heroui/button';
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
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table';
import { format } from 'date-fns';
import { ListFilter, Loader2, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import type { PendingDetailsProps } from '@/lib/types/finance';

export const columns = [
  { name: 'ID', uid: 'orderId' },
  { name: 'CUSTOMER', uid: 'customerName' },
  { name: 'STORE', uid: 'store' },
  { name: 'ORDER', uid: 'order' },
  { name: 'DUE DATE', uid: 'due' },
  { name: 'PENDING BALANCE', uid: 'pendingBalance' },
];

const orderOptions = [
  { name: 'Catering', uid: 'catering' },
  { name: 'Tiffin', uid: 'tiffin' },
];

export default function PendingPaymentsTable({
  data,
  isPending,
}: {
  isPending: boolean;
  data: PendingDetailsProps[];
}) {
  const [orderFilter, setOrderFilter] = React.useState<Selection>('all');
  const [filterValue, setFilterValue] = React.useState('');
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filteredDetails = [...data];

    if (hasSearchFilter) {
      filteredDetails = filteredDetails.filter(
        (detail) =>
          detail.customerName
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          detail.orderId.includes(filterValue)
      );
    }
    if (
      orderFilter !== 'all' &&
      Array.from(orderFilter).length !== orderOptions.length
    ) {
      filteredDetails = filteredDetails.filter((detail) =>
        Array.from(orderFilter).includes(detail.order.toLowerCase())
      );
    }

    return filteredDetails;
  }, [data, filterValue, orderFilter, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const renderCell = React.useCallback(
    (order: PendingDetailsProps, columnKey: React.Key) => {
      const cellValue = order[columnKey as keyof PendingDetailsProps];

      // biome-ignore lint/nursery/noUnnecessaryConditions: <Ignore>
      switch (columnKey) {
        case 'orderId':
          return (
            <Link
              className="hover:underline"
              href={`/dashboard/orders/${order.order}-${order.orderId}?mid=${order._id}`}
            >
              {cellValue as string}
            </Link>
          );
        case 'order':
          return (cellValue as string).toUpperCase();
        case 'due':
          return format(new Date(cellValue as string), 'MMM d, yyyy');
        case 'pendingBalance':
          return `$${cellValue as number}`;
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
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-default-400 text-small">
            Total {data?.length} pending payments
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
    onSearchChange,
    onRowsPerPageChange,
    onClear,
    data,
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
  }, [page, pages, onNextPage, onPreviousPage]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: 'max-h-[382px] scrollbar-none border shadow px-3',
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
        {(item: PendingDetailsProps) => (
          <TableRow key={item.orderId}>
            {(columnKey) => (
              <TableCell className="whitespace-nowrap">
                {/* @ts-expect-error: cellValue is of type PendingDetailsProps */}
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
