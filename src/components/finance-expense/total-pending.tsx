'use client';

import { useTotalPending } from '@/api-hooks/admin/get-total-pending';
import RevenueStatCardSkeleton from '../skeleton/revenue-stat-card-skeleton';
import RevenueStatCard from './revenue-stat-card';

const TotalPending = () => {
  const { data, isPending } = useTotalPending();
  if (isPending) {
    return <RevenueStatCardSkeleton />;
  }
  return <RevenueStatCard data={data} title="Total Pending" />;
};

export default TotalPending;
