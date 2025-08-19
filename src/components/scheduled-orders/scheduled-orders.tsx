'use client';

import { Typography } from '@mui/material';
import { format, isToday, isTomorrow } from 'date-fns';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useScheduledOrders } from '@/api-hooks/scheduled/get-orders';
import type { RootState } from '@/store';
import ScheduledOrderTable from '../data-table/scheduled-order-table';

const ScheduledOrders = ({ storeId }: { storeId: string }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const store = useSelector((state: RootState) => state.selectStore);

  const queryKey = useMemo(
    () => [
      'order',
      'scheduled',
      store === '' ? storeId : store,
      format(selectedDate || new Date(), 'yyyy-MM-dd'),
    ],
    [selectedDate, store, storeId]
  );

  const { data: scheduledOrders, isPending } = useScheduledOrders(
    selectedDate,
    store === '' ? storeId : store,
    queryKey
  );

  const formattedDate = useMemo(() => {
    if (isToday(selectedDate)) {
      return 'Today';
    }
    if (isTomorrow(selectedDate)) {
      return 'Tomorrow';
    }
    return format(selectedDate || new Date(), 'PPP');
  }, [selectedDate]);

  return (
    <>
      <Typography component="h2" sx={{ mb: 2 }} variant="h6">
        Scheduled Orders for {formattedDate}
      </Typography>
      <ScheduledOrderTable
        date={selectedDate}
        isPending={isPending}
        onDateChange={setSelectedDate}
        orders={scheduledOrders || []}
      />
    </>
  );
};

export default ScheduledOrders;
