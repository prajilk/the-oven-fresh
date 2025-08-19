'use client';

import { Chip, type ChipProps } from '@heroui/chip';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table';
import { Eye, Loader2 } from 'lucide-react';
import type { ObjectId } from 'mongoose';
import Link from 'next/link';
import React from 'react';
import { useCateringOrders } from '@/api-hooks/catering/get-catering-orders';
import { formatDate } from '@/lib/utils';
import type {
  CateringDocument,
  CateringDocumentPopulate,
} from '@/models/types/catering';
import type { CustomerDocument } from '@/models/types/customer';
import { Button } from '../../ui/button';

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

export const columns = [
  { name: 'ID', uid: 'orderId' },
  { name: 'CUSTOMER', uid: 'customerName' },
  { name: 'PHONE', uid: 'customerPhone' },
  { name: 'ORDER PLACED ON', uid: 'createdAt' },
  { name: 'DELIVERY DATE', uid: 'deliveryDate' },
  { name: 'STATUS', uid: 'status' },
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

const RecentCateringOrderTable = () => {
  const { data: orders, isPending } = useCateringOrders(10);

  const renderCell = React.useCallback(
    (order: CateringDocument, columnKey: React.Key) => {
      const cellValue = order[columnKey as keyof CateringDocument];

      // biome-ignore lint/nursery/noUnnecessaryConditions: <Ignore>
      switch (columnKey) {
        case 'createdAt':
          return <p>{formatDate(new Date(cellValue as string))}</p>;
        case 'deliveryDate':
          return <p>{formatDate(new Date(cellValue as string))}</p>;
        case 'items':
          return (
            <p className="text-center">
              {(cellValue as unknown as CellValue)?.length}
            </p>
          );
        case 'totalPrice':
          return `$${cellValue}`;
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
                href={`/dashboard/orders/catering-${
                  order.orderId
                }?mid=${order._id.toString()}`}
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

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      bottomContentPlacement="outside"
      classNames={{
        wrapper: 'max-h-[382px] scrollbar-none border shadow-md px-3',
      }}
      isHeaderSticky
      topContent={
        <div className="flex items-center justify-between">
          <h1 className="font-medium text-lg">Recent Catering Orders</h1>
          <Button asChild size={'sm'}>
            <Link href="/dashboard/orders">View all</Link>
          </Button>
        </div>
      }
      topContentPlacement="inside"
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
        items={orders || []}
        loadingContent={<Loader2 className="animate-spin" />}
      >
        {(item: CateringDocumentPopulate) => (
          <TableRow key={item._id.toString()}>
            {(columnKey) => (
              <TableCell>
                {/* @ts-expect-error: renderCell doesn't take CateringDocPopulate type */}
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default RecentCateringOrderTable;
