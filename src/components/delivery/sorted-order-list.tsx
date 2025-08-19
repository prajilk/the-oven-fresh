'use client';

import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { useDeliveryOrders } from '@/api-hooks/delivery/get-delivery-order';
import { Show } from '../show';
import OrderCard from './order-card';

const SortedOrderList = ({
  status,
  orderType,
}: {
  status: string;
  orderType: 'tiffins' | 'caterings';
}) => {
  const { data, isPending } = useDeliveryOrders(orderType);

  const spreadOrders = useMemo(() => {
    return data?.orders.filter((order) => order.status === status);
  }, [data, status]);

  return (
    <Show>
      <Show.When isTrue={isPending}>
        <div className="flex h-32 flex-col items-center justify-center">
          <Loader2 className="animate-spin" />
          <span>Loading...</span>
        </div>
      </Show.When>
      <Show.When
        isTrue={spreadOrders !== undefined && (spreadOrders?.length || 0) > 0}
      >
        {spreadOrders?.map((order) => (
          <OrderCard key={order.orderId} order={order} orderType={orderType} />
        ))}
      </Show.When>
      <Show.Else>
        <Show>
          <Show.When isTrue={(spreadOrders?.length || 0) > 0}>
            <div className="flex h-32 flex-col items-center justify-center">
              <Loader2 className="animate-spin" />
              <span>Loading...</span>
            </div>
          </Show.When>
          <Show.Else>
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No orders to display!</p>
            </div>
          </Show.Else>
        </Show>
      </Show.Else>
    </Show>
  );
};

export default SortedOrderList;
