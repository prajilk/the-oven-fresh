'use client';

import { useSelector } from 'react-redux';
import { useTotalExpense } from '@/api-hooks/admin/get-total-expense';
import type { RootState } from '@/store';
import ExpenseStatCardSkeleton from '../skeleton/expense-stat-card-skeleton';
import ExpenseStatCard from './expense-stat-card';

const TotalExpense = () => {
  const yearFilter = useSelector((state: RootState) => state.selectYear);
  const { data, isPending } = useTotalExpense(yearFilter);
  if (isPending) {
    return (
      <>
        <ExpenseStatCardSkeleton />
        <ExpenseStatCardSkeleton />
        <ExpenseStatCardSkeleton />
      </>
    );
  }

  return (
    <>
      <ExpenseStatCard
        items={data?.items || 0}
        title="Total Expense"
        total={data?.total || 0}
      />
      {data?.stores.map((store) => (
        <ExpenseStatCard
          items={store.items || 0}
          key={store.location}
          title={`Expense - ${store.location}`}
          total={store.total || 0}
        />
      ))}
    </>
  );
};

export default TotalExpense;
