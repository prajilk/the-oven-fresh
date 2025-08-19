'use client';

import { Frown } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useRevenueExpenseAnalysis } from '@/api-hooks/admin/get-rne-analysis';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { MonthlyRevenueData } from '@/lib/types/finance';
import type { RootState } from '@/store';
import MonthSelect from '../select/month-select';

// Define the types for store and service filters
type Store = 'store1' | 'store2' | 'all';
type Service = 'tiffin' | 'catering' | 'all';

export function RevenueExpenseCharts() {
  const [storeFilter, setStoreFilter] = useState<Store>('all');
  const [serviceFilter, setServiceFilter] = useState<Service>('all');
  const [monthFilter, setMonthFilter] = useState('all');

  const yearFilter = useSelector((state: RootState) => state.selectYear);

  // useQuery
  const { data, isPending } = useRevenueExpenseAnalysis(yearFilter);

  // Filter data based on selected filters
  const getFilteredData = (data: MonthlyRevenueData[]) => {
    let filteredData = [...data];

    if (monthFilter !== 'all') {
      filteredData = filteredData.filter((item) =>
        item.name.toLowerCase().startsWith(monthFilter.toLowerCase())
      );
    }

    return filteredData;
  };

  const getVisibleKeys = () => {
    // If both filters are "all", return all keys
    if (storeFilter === 'all' && serviceFilter === 'all') {
      return data?.storeServiceMap.all.all;
    }

    // If only one filter is selected, use the dynamic map to return the filtered keys
    if (storeFilter !== 'all' && serviceFilter !== 'all') {
      return data?.storeServiceMap[storeFilter]?.[serviceFilter] || [];
    }

    if (storeFilter !== 'all') {
      return data?.storeServiceMap[storeFilter].all;
    }

    if (serviceFilter !== 'all') {
      return data?.storeServiceMap.all[serviceFilter];
    }

    return data?.storeServiceMap.all.all;
  };

  const visibleKeys = getVisibleKeys();
  const filteredRevenueData = getFilteredData(data?.revenueData || []);

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (!data) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-2 pt-20 pb-20">
          <Frown className="size-7 animate-pulse" />
          <span>Unable to load data!</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            {/* <CardTitle>Revenue & Expense Analysis</CardTitle> */}
            <CardTitle className="text-lg">Revenue Analysis</CardTitle>
            <CardDescription>
              Monthly performance by store and service
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              onValueChange={(value) => setStoreFilter(value as Store)}
              value={storeFilter}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Store Filter" />
              </SelectTrigger>
              <SelectContent>
                {data?.stores.map((store) => (
                  <SelectItem key={store.value} value={store.value}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => setServiceFilter(value as Service)}
              value={serviceFilter}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Service Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="tiffin">Tiffin Only</SelectItem>
                <SelectItem value="catering">Catering Only</SelectItem>
              </SelectContent>
            </Select>

            <MonthSelect
              monthFilter={monthFilter}
              setMonthFilter={setMonthFilter}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-5 md:p-6 md:pt-7">
        {/* <Tabs defaultValue="revenue"> */}
        {/* <TabsList className="mb-4">
                        <TabsTrigger value="revenue">Revenue</TabsTrigger>
                        <TabsTrigger value="expense">Expense</TabsTrigger>
                    </TabsList> */}

        {/* <TabsContent value="revenue"> */}
        <div className="h-[400px] w-full">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={filteredRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip
                formatter={(value) => [
                  `
                                            $${Number(value).toLocaleString()}`,
                  '',
                ]}
              />
              <Legend />
              {visibleKeys?.map((key) => (
                <Bar
                  dataKey={key}
                  fill={data?.colorMap[key]}
                  key={key}
                  name={key}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* </TabsContent> */}

        {/* <TabsContent value="expense">
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={filteredExpenseData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis
                                        tickFormatter={(value) =>
                                            `$${value / 1000}k`
                                        }
                                    />
                                    <Tooltip
                                        formatter={(value) => [
                                            `$${Number(
                                                value
                                            ).toLocaleString()}`,
                                            "",
                                        ]}
                                    />
                                    <Legend />
                                    {visibleKeys?.map((key) => (
                                        <Bar
                                            key={key}
                                            dataKey={key}
                                            fill={data?.colorMap[key]}
                                            name={key}
                                        />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </TabsContent>
                </Tabs> */}
      </CardContent>
    </Card>
  );
}
