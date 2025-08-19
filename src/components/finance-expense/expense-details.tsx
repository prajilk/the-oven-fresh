'use client';

import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useExpenseDetails } from '@/api-hooks/admin/get-expense-details';
import type { ExpenseDetailsProps } from '@/lib/types/finance';
import type { RootState } from '@/store';
import MonthSelect from '../select/month-select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Input } from '../ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

const ExpenseDetails = () => {
  const [monthFilter, setMonthFilter] = useState(
    format(new Date(), 'MMM').toLowerCase()
  );
  const yearFilter = useSelector((state: RootState) => state.selectYear);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: expenseDetails, isPending } = useExpenseDetails(
    monthFilter,
    yearFilter
  );

  // Filter items based on search query and selected store
  const getFilteredItems = () => {
    const allItems: ExpenseDetailsProps[] = expenseDetails || [];

    // Apply search filter
    if (searchQuery) {
      return allItems.filter((item) =>
        item.item.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return allItems;
  };

  const filteredItems = getFilteredItems();

  if (isPending) {
    return (
      <div className="flex min-h-[420px] items-center justify-center gap-1 rounded-lg bg-white shadow">
        <Loader2 className="animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <Card className="mt-7">
      <CardHeader>
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <CardTitle className="text-lg">Grocery Expense Details</CardTitle>
            <CardDescription>
              Itemized grocery expenses for {monthFilter} 2025
            </CardDescription>
          </div>
          <div className="flex w-full flex-wrap gap-2 md:w-auto">
            <Input
              className="w-full md:w-[200px]"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
              value={searchQuery}
            />
            <MonthSelect
              monthFilter={monthFilter}
              removeAllMonth={true}
              setMonthFilter={setMonthFilter}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Purchased from</TableHead>
              <TableHead className="whitespace-nowrap">
                Unit Price &#040;$&#041;
              </TableHead>
              <TableHead className="whitespace-nowrap">
                Tax &#040;$&#041;
              </TableHead>
              <TableHead className="whitespace-nowrap text-right">
                Total &#040;$&#041;
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <TableRow key={`${item.store}-${item._id}`}>
                  <TableCell className="whitespace-nowrap font-medium">
                    {format(new Date(item.date), 'MMM d')}
                  </TableCell>
                  <TableCell className="font-medium">{item.item}</TableCell>
                  <TableCell className="font-medium">{item.store}</TableCell>
                  <TableCell>
                    {item.quantity} {item.unit === 'none' ? '' : item.unit}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.purchasedFrom}
                  </TableCell>
                  <TableCell>
                    {item.price > 0 ? item.price : 'Variable'}
                  </TableCell>
                  <TableCell>{item.tax}</TableCell>
                  <TableCell className="text-right">
                    ${item.total.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="py-4 text-center" colSpan={7}>
                  No items found
                </TableCell>
              </TableRow>
            )}

            {filteredItems.length > 0 && (
              <TableRow className="bg-muted/50">
                <TableCell className="text-right font-medium" colSpan={6}>
                  Total:
                </TableCell>
                <TableCell className="text-right font-bold">
                  $
                  {filteredItems
                    .reduce((sum, item) => sum + item.total, 0)
                    .toLocaleString()}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ExpenseDetails;
