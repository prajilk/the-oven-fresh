'use client';

import { useSelector } from 'react-redux';
import { useStoresRevenue } from '@/api-hooks/admin/get-stores-revenue';
import type { RootState } from '@/store';
import RevenueStatCardSkeleton from '../skeleton/revenue-stat-card-skeleton';
import RevenueStatCard from './revenue-stat-card';

const StoresRevenue = () => {
  const yearFilter = useSelector((state: RootState) => state.selectYear);
  const { data, isPending } = useStoresRevenue(yearFilter);
  if (isPending) {
    return <RevenueStatCardSkeleton />;
  }

  return (
    <>
      {data?.map((store) => (
        <RevenueStatCard
          data={store.data}
          key={store.location}
          title={`Revenue - ${store.location}`}
        />
      ))}
    </>
  );
};

export default StoresRevenue;
