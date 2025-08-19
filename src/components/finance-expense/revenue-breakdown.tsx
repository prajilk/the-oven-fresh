'use client';

import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRevenueBreakdown } from '@/api-hooks/admin/get-revenue-breakdown';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { RootState } from '@/store';
import MonthSelect from '../select/month-select';

const RevenueBreakdown = () => {
  const [monthFilter, setMonthFilter] = useState(
    format(new Date(), 'MMM').toLowerCase()
  );
  const yearFilter = useSelector((state: RootState) => state.selectYear);

  const { data: revenueBreakdown, isPending } = useRevenueBreakdown(
    yearFilter,
    monthFilter
  );

  const totalForMonth =
    revenueBreakdown?.reduce(
      (acc, curr) => acc + curr.tiffin + curr.catering,
      0
    ) || 0;

  if (isPending) {
    return (
      <div className="flex min-h-[350px] items-center justify-center gap-1 rounded-lg bg-white shadow md:col-span-4">
        <Loader2 className="animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <Card className="md:col-span-4">
      <div className="flex items-center justify-between pe-6">
        <CardHeader>
          <CardTitle className="text-lg">Revenue Breakdown</CardTitle>
          <CardDescription>
            Monthly revenue by store and service
          </CardDescription>
        </CardHeader>
        <MonthSelect
          monthFilter={monthFilter}
          removeAllMonth={true}
          setMonthFilter={setMonthFilter}
        />
      </div>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {revenueBreakdown?.map((data) => (
              <Fragment key={data.store}>
                <TableRow>
                  <TableCell className="font-medium" rowSpan={2}>
                    {data.store}
                  </TableCell>
                  <TableCell>Tiffin</TableCell>
                  <TableCell>${data.tiffin}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Catering</TableCell>
                  <TableCell>${data.catering}</TableCell>
                </TableRow>
              </Fragment>
            ))}
            <TableRow className="bg-muted/50">
              <TableCell className="font-medium" colSpan={2}>
                Total
              </TableCell>
              <TableCell className="font-medium">${totalForMonth}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RevenueBreakdown;
