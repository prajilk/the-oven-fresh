'use client';

import { useCateringOrders } from '@/api-hooks/catering/get-catering-orders';
import CateringOrderTable from '../data-table/catering/catering-order-table';

const CateringOrders = () => {
  const { data: cateringOrders, isPending } = useCateringOrders();

  return (
    <CateringOrderTable isPending={isPending} orders={cateringOrders || []} />
  );
};

export default CateringOrders;
