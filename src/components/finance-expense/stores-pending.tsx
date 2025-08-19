'use client';

import { useStoresPending } from '@/api-hooks/admin/get-stores-pending';
import RevenueStatCardSkeleton from '../skeleton/revenue-stat-card-skeleton';
import RevenueStatCard from './revenue-stat-card';

const StoresPending = () => {
  const { data, isPending } = useStoresPending();
  if (isPending) {
    return <RevenueStatCardSkeleton />;
  }
  return (
    <>
      {data?.map((store) => (
        <RevenueStatCard
          data={store.data}
          key={store.location}
          title={`Pending - ${store.location}`}
        />
      ))}
    </>
  );
};

export default StoresPending;
