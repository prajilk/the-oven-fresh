'use client';

import { useTiffinOrders } from '@/api-hooks/tiffin/get-tiffin-orders';
import TiffinOrderTable from '../data-table/tiffin/tiffin-order-table';

const TiffinOrders = () => {
  const { data: tiffinOrders, isPending } = useTiffinOrders();

  return <TiffinOrderTable isPending={isPending} orders={tiffinOrders || []} />;
};

export default TiffinOrders;
