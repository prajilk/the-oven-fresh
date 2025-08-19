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
import { useCallback, useMemo, useState } from 'react';
import { useStaffs } from '@/api-hooks/staffs/get-staffs';
import { useStores } from '@/api-hooks/stores/get-stores';
import type { UserDocumentPopulate } from '@/models/types/user';
import AddStaffDialog from '../dialog/add-staff-dialog';
import DeleteStaffDialog from '../dialog/delete-staff-dialog';
import EditStaffDialog from '../dialog/edit-staff-dialog';

export const columns = [
  { name: 'USERNAME', uid: 'username' },
  { name: 'DISPLAY NAME', uid: 'displayUsername' },
  { name: 'ROLE', uid: 'role' },
  { name: 'STORE', uid: 'store', sortable: true },
  { name: 'ACTIONS', uid: 'actions' },
];

export default function StaffsTable() {
  const [filterValue, setFilterValue] = useState('');

  const { data: staffs, isPending } = useStaffs();
  const { data: stores } = useStores();

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredStaffs = staffs ? [...staffs] : [];

    if (hasSearchFilter) {
      filteredStaffs = filteredStaffs.filter((order) =>
        order.username.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredStaffs;
  }, [staffs, filterValue, hasSearchFilter]);

  const renderCell = useCallback(
    (staff: UserDocumentPopulate, columnKey: React.Key) => {
      const cellValue = staff[columnKey as keyof UserDocumentPopulate];

      switch (columnKey) {
        case 'store':
          // @ts-expect-error: cellValue is of type StoreDocument
          return cellValue?.location;
        case 'actions':
          return (
            <div className="flex items-center justify-center gap-2.5">
              <EditStaffDialog staff={staff} stores={stores || []} />
              <DeleteStaffDialog id={staff._id} />
            </div>
          );
        default:
          return cellValue;
      }
    },
    [stores]
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue('');
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue('');
  }, []);

  const topContent = useMemo(() => {
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
            placeholder="Search by username"
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
            <AddStaffDialog stores={stores || []} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-default-400 text-small">
            Total {staffs?.length} staffs
          </span>
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, staffs?.length, onClear, stores]);

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
        emptyContent={'No staffs found'}
        isLoading={isPending}
        items={filteredItems}
        loadingContent={<Loader2 className="animate-spin" />}
      >
        {(item: UserDocumentPopulate) => (
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
