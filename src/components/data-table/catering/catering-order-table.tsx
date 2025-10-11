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
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table';
import { format } from 'date-fns';
import {
  Banknote,
  CreditCard,
  Eye,
  ListFilter,
  Loader2,
  PlusCircle,
} from 'lucide-react';
import type { ObjectId } from 'mongoose';
import Link from 'next/link';
import React from 'react';
import ExportToExcel from '@/components/csv/export-to-excel';
import { Show } from '@/components/show';
import { authClient } from '@/lib/auth-client';
import { formatDate } from '@/lib/utils';
import type {
  CateringDocument,
  CateringDocumentPopulate,
} from '@/models/types/catering';
import type { CustomerDocument } from '@/models/types/customer';
import { DatePickerWithRange } from '../../date-range-picker';
import { DeleteOrderDrawer } from '../../drawer/delete-order-drawer';

type CellValue = Array<
  | string
  | number
  | boolean
  | ObjectId
  | CustomerDocument
  | {
      itemId: string;
      priceAtOrder: number;
      quantity: number;
    }[]
  | Date
>;

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';
}

export const columns = [
  { name: 'ID', uid: '_id', sortable: true },
  { name: 'CUSTOMER', uid: 'customerName' },
  { name: 'PHONE', uid: 'customerPhone' },
  { name: 'DELIVERY DATE', uid: 'deliveryDate', sortable: true },
  { name: 'NO. OF ITEMS', uid: 'items' },
  { name: 'PAYMENT METHOD', uid: 'paymentMethod' },
  { name: 'ADVANCE PAID', uid: 'advancePaid' },
  { name: 'PENDING BALANCE', uid: 'pendingBalance' },
  { name: 'DISCOUNT', uid: 'discount' },
  { name: 'TAX', uid: 'tax' },
  { name: 'TOTAL', uid: 'totalPrice' },
  { name: 'FULLY PAID', uid: 'fullyPaid' },
  { name: 'NOTE', uid: 'note' },
  { name: 'STATUS', uid: 'status', sortable: true },
  { name: 'ACTIONS', uid: 'actions' },
];

export const statusOptions = [
  { name: 'Pending', uid: 'pending' },
  { name: 'Ongoing', uid: 'ongoing' },
  { name: 'Delivered', uid: 'delivered' },
  { name: 'Cancelled', uid: 'cancelled' },
];

const statusColorMap: Record<string, ChipProps['color']> = {
  DELIVERED: 'success',
  CANCELLED: 'danger',
  PENDING: 'warning',
  ONGOING: 'primary',
};

const INITIAL_VISIBLE_COLUMNS = [
  'customerName',
  'deliveryDate',
  'items',
  'totalPrice',
  'pendingBalance',
  'status',
  'actions',
];

export default function CateringOrderTable({
  isPending,
  orders,
}: {
  isPending: boolean;
  orders: CateringDocumentPopulate[];
}) {
  const { data: session } = authClient.useSession();
  const userRole = session?.user.role;

  const [filterValue, setFilterValue] = React.useState('');
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>('all');
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
          order.customerPhone.includes(filterValue) ||
          order.orderId.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== 'all' &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredOrders = filteredOrders.filter((order) =>
        Array.from(statusFilter).includes(order.status.toLowerCase())
      );
    }

    return filteredOrders;
  }, [orders, filterValue, statusFilter, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => [...items], [items]);

  const renderCell = React.useCallback(
    (order: CateringDocument, columnKey: React.Key) => {
      const cellValue = order[columnKey as keyof CateringDocument];

      // biome-ignore lint/nursery/noUnnecessaryConditions: <Ignore>
      switch (columnKey) {
        case 'deliveryDate':
          return <p>{formatDate(new Date(cellValue as string))}</p>;
        case 'items':
          return (
            <p className="text-center">
              {(cellValue as unknown as CellValue)?.length +
                order.customItems?.length}
            </p>
          );
        case 'paymentMethod':
          return (
            <p className="flex items-center justify-center gap-1 text-sm capitalize">
              {cellValue.toString() === 'cash' ? (
                <Banknote className="text-muted-foreground" size={17} />
              ) : (
                <CreditCard className="text-muted-foreground" size={17} />
              )}
              {cellValue.toString()}
            </p>
          );
        case 'advancePaid':
          return <p className="text-center">{`$${cellValue}`}</p>;
        case 'pendingBalance':
          return <p className="text-center">{`$${cellValue}`}</p>;
        case 'discount':
          return <p className="text-center">{`$${cellValue ?? 0}`}</p>;
        case 'tax':
          return <p className="text-center">{`$${cellValue}`}</p>;
        case 'totalPrice':
          return `$${cellValue}`;
        case 'fullyPaid':
          return (
            <Chip
              className="capitalize"
              color={cellValue ? 'success' : 'warning'}
              size="sm"
              variant="flat"
            >
              {cellValue ? 'Yes' : 'No'}
            </Chip>
          );
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
              <Link href={`orders/catering-${order.orderId}`}>
                <Eye className="stroke-2 text-muted-foreground" size={18} />
              </Link>
              <DeleteOrderDrawer
                orderId={order._id.toString()}
                orderType="catering"
              />
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

  const excelData = React.useMemo(() => {
    if (userRole === 'admin') {
      return orders.map((order) => ({
        orderId: order.orderId,
        customerName: order.customerName,
        phone: order.customerPhone,
        address: order.address?.address,
        deliveryDate: format(new Date(order.deliveryDate), 'PPP'),
        orderType: order.order_type,
        items: order.items.map((item) => item.itemId.name),
        paymentMethod: order.paymentMethod,
        deliveryCharge: order.deliveryCharge,
        totalAmount: order.totalPrice - order.tax,
        tax: order.tax,
        fullyPaid: order.fullyPaid ? 'Yes' : 'No',
        status: order.status,
        note: order.note,
        orderPlaced: format(new Date(order.createdAt), 'PPP'),
        store: order.store.location,
      }));
    }
    return [];
  }, [orders, userRole]);

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
            placeholder="Search by name or phone or order ID..."
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
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Table Columns"
                closeOnSelect={false}
                disallowEmptySelection
                onSelectionChange={setStatusFilter}
                selectedKeys={statusFilter}
                selectionMode="multiple"
              >
                {statusOptions.map((status) => (
                  <DropdownItem className="capitalize" key={status.uid}>
                    {capitalize(status.name)}
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
          </div>
          <div className="flex flex-1 justify-end gap-2">
            <Show>
              <Show.When isTrue={userRole === 'admin' && orders.length > 0}>
                <ExportToExcel
                  data={excelData}
                  filename="catering-orders.xlsx"
                />
              </Show.When>
            </Show>
            <DatePickerWithRange
              disabled={orders.length === 0}
              label="Print Report"
              orderType="catering"
              printType="summary"
            />
            <DatePickerWithRange
              disabled={orders.length === 0}
              label="Print Stickers"
              orderType="catering"
              printType="sticker"
            />
          </div>
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
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    orders?.length,
    excelData,
    userRole,
    onClear,
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
        {(item: CateringDocumentPopulate) => (
          <TableRow key={item._id.toString()}>
            {(columnKey) => (
              <TableCell className="whitespace-nowrap">
                {/* @ts-expect-error: renderCell doesn't take CateringDocPopulate type */}
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
