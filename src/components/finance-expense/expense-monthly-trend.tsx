'use client';

import { useSelector } from 'react-redux';
import { useMonthlyTrend } from '@/api-hooks/admin/get-monthly-trend';
import type { RootState } from '@/store';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const ExpenseMonthlyTrend = () => {
  const yearFilter = useSelector((state: RootState) => state.selectYear);
  const { data, isPending, isError } = useMonthlyTrend(yearFilter);
  const months = data?.expensesData.map((data) => data.month);

  if (isPending) {
    return <CardSkeleton className="mt-7 min-h-[320px]" />;
  }
  if (isError) {
    return (
      <div className="mt-7 rounded-lg border bg-white py-20 text-center shadow">
        Error: Unable to fetch data
      </div>
    );
  }
  if (!data) {
    return (
      <div className="mt-7 rounded-lg border bg-white py-20 text-center shadow">
        No data found
      </div>
    );
  }

  return (
    <Card className="mt-7">
      <CardHeader>
        <CardTitle className="text-lg">Monthly Expense Trend</CardTitle>
        <CardDescription>
          Grocery expenses over the last {months?.length} months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Stores</TabsTrigger>
            {data.stores.map((store) => (
              <TabsTrigger className="capitalize" key={store} value={store}>
                {store}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  {data.stores.map((store) => (
                    <TableHead className="capitalize" key={store}>
                      {store}
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.expensesData.map(({ month, expenses }) => (
                  <TableRow key={month}>
                    <TableCell className="font-medium">{month}</TableCell>
                    {data.stores.map((store) => (
                      <TableCell key={store}>
                        ${expenses[store]?.total || 0}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      $
                      {data.stores.reduce(
                        (sum, store) => sum + (expenses[store]?.total || 0),
                        0
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {data.stores.map((store) => (
            <TabsContent key={store} value={store}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Total Expense</TableHead>
                    <TableHead className="text-right">
                      Items Purchased
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.expensesData.map(({ month, expenses }) => (
                    <TableRow key={month}>
                      <TableCell className="font-medium">{month}</TableCell>
                      <TableCell className="text-right">
                        ${expenses[store]?.total || 0}
                      </TableCell>
                      <TableCell className="text-right">
                        {expenses[store]?.items || 0} items
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ExpenseMonthlyTrend;
