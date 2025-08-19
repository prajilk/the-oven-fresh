'use client';

import { format } from 'date-fns';
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useProfitDetails } from '@/api-hooks/admin/get-profit-details';
import { getMonthInNumber } from '@/lib/utils';
import type { RootState } from '@/store';
import MonthSelect from '../select/month-select';
import CardSkeleton from '../skeleton/card-skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

const ProfitMetrics = () => {
  const [monthFilter, setMonthFilter] = useState(
    format(new Date(), 'MMM').toLowerCase()
  );
  const yearFilter = useSelector((state: RootState) => state.selectYear);

  const {
    data: profitDetails,
    isPending,
    isError,
  } = useProfitDetails(monthFilter, yearFilter);

  const totalRevenue = profitDetails?.reduce(
    (sum, data) => sum + data.totalRevenue,
    0
  );
  const totalExpense = profitDetails?.reduce(
    (sum, data) => sum + data.totalExpense,
    0
  );
  const totalProfit = profitDetails?.reduce(
    (sum, data) => sum + data.totalProfit,
    0
  );

  if (isPending) {
    return <CardSkeleton className="mt-7 min-h-[520px]" />;
  }
  if (isError) {
    return (
      <div className="mt-7 min-h-[520px] rounded-lg border bg-white text-center shadow">
        Error: Unable to fetch data
      </div>
    );
  }
  if (!profitDetails) {
    return (
      <div className="mt-7 min-h-[520px] rounded-lg border bg-white text-center shadow">
        No data found
      </div>
    );
  }

  return (
    <div className="min-h-[520px] space-y-6 rounded-lg border bg-white p-4 shadow md:p-6">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-lg">Profit Details</h1>
          <MonthSelect
            monthFilter={monthFilter}
            removeAllMonth
            setMonthFilter={setMonthFilter}
          />
        </div>
        <p className="text-muted-foreground text-sm">Monthly profit by store</p>
      </div>
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              ${totalRevenue?.toFixed(2)}
            </div>
            <p className="text-muted-foreground text-xs">
              For{' '}
              {format(
                new Date(2025, getMonthInNumber(monthFilter) - 1, 1),
                'MMMM'
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Expense</CardTitle>
            <TrendingDown className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              ${totalExpense?.toFixed(2)}
            </div>
            <p className="text-muted-foreground text-xs">
              For{' '}
              {format(
                new Date(2025, getMonthInNumber(monthFilter) - 1, 1),
                'MMMM'
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">${totalProfit?.toFixed(2)}</div>
            <p className="text-muted-foreground text-xs">
              For{' '}
              {format(
                new Date(2025, getMonthInNumber(monthFilter) - 1, 1),
                'MMMM'
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Store Details Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Store Performance</CardTitle>
          <CardDescription>
            Detailed breakdown by store for March
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Expense</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profitDetails.map((data) => (
                  <TableRow key={data.store}>
                    <TableCell className="font-medium">{data.store}</TableCell>
                    <TableCell className="text-right text-emerald-600">
                      ${data.totalRevenue}
                    </TableCell>
                    <TableCell className="text-right text-rose-600">
                      ${data.totalExpense}
                    </TableCell>
                    <TableCell className="text-right text-indigo-600">
                      ${data.totalProfit}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfitMetrics;
