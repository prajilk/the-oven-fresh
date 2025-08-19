'use client';

import { useSelector } from 'react-redux';
import { useTotalRevenue } from '@/api-hooks/admin/get-total-revenue';
import type { RootState } from '@/store';
import RevenueStatCardSkeleton from '../skeleton/revenue-stat-card-skeleton';
import RevenueStatCard from './revenue-stat-card';

const TotalRevenue = () => {
  const yearFilter = useSelector((state: RootState) => state.selectYear);
  const { data, isPending } = useTotalRevenue(yearFilter);
  if (isPending) {
    return <RevenueStatCardSkeleton />;
  }
  return <RevenueStatCard data={data} title="Total Revenue" />;
};

export default TotalRevenue;
