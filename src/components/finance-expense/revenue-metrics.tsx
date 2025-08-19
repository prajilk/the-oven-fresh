import { format } from 'date-fns';
import { Suspense } from 'react';
import { getRevenueBreakdownServer } from '@/lib/api/finance/get-revenue-breakdown-server';
import { getStoresRevenueServer } from '@/lib/api/finance/get-stores-revenue';
import { getTotalRevenueServer } from '@/lib/api/finance/get-total-revenue';
import ServerWrapper from '../server-wrapper';
import RevenueStatCardSkeleton from '../skeleton/revenue-stat-card-skeleton';
import RevenueBreakdown from './revenue-breakdown';
import StoresRevenue from './stores-revenue';
import TotalRevenue from './total-revenue';

type RevenueMetricsProps = {
  detailed?: boolean;
};

export function RevenueMetrics({ detailed = false }: RevenueMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Suspense fallback={<RevenueStatCardSkeleton />}>
        <ServerWrapper
          queryFn={getTotalRevenueServer}
          queryKey={['revenue', 'total-revenue', format(new Date(), 'yyyy')]}
        >
          <TotalRevenue />
        </ServerWrapper>
      </Suspense>
      <Suspense
        fallback={
          <>
            <RevenueStatCardSkeleton />
            <RevenueStatCardSkeleton />
          </>
        }
      >
        <ServerWrapper
          queryFn={getStoresRevenueServer}
          queryKey={['revenue', 'stores-revenue', format(new Date(), 'yyyy')]}
        >
          <StoresRevenue />
        </ServerWrapper>
      </Suspense>

      {detailed && (
        <Suspense fallback={<div>Loading...</div>}>
          <ServerWrapper
            queryFn={getRevenueBreakdownServer}
            queryKey={[
              'revenue',
              'revenue-breakdown',
              format(new Date(), 'yyyy'),
              format(new Date(), 'MMM').toLowerCase(),
            ]}
          >
            <RevenueBreakdown />
          </ServerWrapper>
        </Suspense>
      )}
    </div>
  );
}
