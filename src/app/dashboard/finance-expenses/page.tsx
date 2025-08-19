import { Box, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import { Suspense } from 'react';
import { RevenueExpenseCharts } from '@/components/charts/revenue-expense-chart';
import Header from '@/components/dashboard/header';
import ExpenseTracking from '@/components/finance-expense/expense-tracking';
import PendingPayments from '@/components/finance-expense/pending-payment';
import ProfitMetrics from '@/components/finance-expense/profit-metrics';
import { RevenueMetrics } from '@/components/finance-expense/revenue-metrics';
import YearSelect from '@/components/select/year-select';
import ServerWrapper from '@/components/server-wrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProfitDetailsServer } from '@/lib/api/finance/get-profit-details-server';
import { getRevenueExpenseAnalysisServer } from '@/lib/api/finance/get-revenue-expense-analysis';

const FinanceAndExpensesPage = () => {
  return (
    <Box className="flex-grow overflow-auto" component="main">
      <Header />
      <Stack
        spacing={2}
        sx={{
          alignItems: 'center',
          mx: { xs: 1.5, md: 3 },
          pb: 5,
          pt: { xs: 2, md: 0 },
          mt: { xs: 8, md: 2 },
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="flex items-center justify-between">
            <Typography component="h2" sx={{ mb: 2 }} variant="h6">
              Finance & Expenses
            </Typography>
            <YearSelect />
          </div>
          <Tabs className="space-y-4" defaultValue="overview">
            <TabsList className="scrollbar-hide max-w-full justify-start overflow-x-scroll">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="pending">Pending Payments</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
            </TabsList>

            <TabsContent className="space-y-4" value="overview">
              <RevenueMetrics />
              <Suspense fallback={<div>Loading...</div>}>
                <ServerWrapper
                  queryFn={getRevenueExpenseAnalysisServer}
                  queryKey={[
                    'revenue',
                    'rne-analysis',
                    format(new Date(), 'yyyy'),
                  ]}
                >
                  <RevenueExpenseCharts />
                </ServerWrapper>
              </Suspense>
              <Suspense fallback={<div>Loading...</div>}>
                <ServerWrapper
                  queryFn={getProfitDetailsServer}
                  queryKey={[
                    'profit-details',
                    format(new Date(), 'yyyy'),
                    format(new Date(), 'MMM').toLowerCase(),
                  ]}
                >
                  <ProfitMetrics />
                </ServerWrapper>
              </Suspense>
            </TabsContent>

            <TabsContent className="space-y-4" value="revenue">
              <RevenueMetrics detailed />
            </TabsContent>

            <TabsContent className="space-y-4" value="pending">
              <PendingPayments />
            </TabsContent>

            <TabsContent className="space-y-4" value="expenses">
              <ExpenseTracking />
            </TabsContent>
          </Tabs>
        </Box>
      </Stack>
    </Box>
  );
};

export default FinanceAndExpensesPage;
