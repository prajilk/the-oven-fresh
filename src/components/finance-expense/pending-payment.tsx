import { Suspense } from 'react';
import { getPendingDetailsServer } from '@/lib/api/finance/get-pending-details-server';
import { getStoresPendingServer } from '@/lib/api/finance/get-stores-pending';
import { getTotalPendingServer } from '@/lib/api/finance/get-total-pending';
import ServerWrapper from '../server-wrapper';
import RevenueStatCardSkeleton from '../skeleton/revenue-stat-card-skeleton';
import PendingDetails from './pending-details';
import StoresPending from './stores-pending';
import TotalPending from './total-pending';

const PendingPayments = () => {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<RevenueStatCardSkeleton />}>
          <ServerWrapper
            queryFn={getTotalPendingServer}
            queryKey={['total-pending']}
          >
            <TotalPending />
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
            queryFn={getStoresPendingServer}
            queryKey={['stores-pending']}
          >
            <StoresPending />
          </ServerWrapper>
        </Suspense>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ServerWrapper
          queryFn={getPendingDetailsServer}
          queryKey={['pending-details']}
        >
          <PendingDetails />
        </ServerWrapper>
      </Suspense>
    </div>
  );
};

export default PendingPayments;
