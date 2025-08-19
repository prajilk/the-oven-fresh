'use client';

import { useDeliveryOrders } from '@/api-hooks/delivery/get-delivery-order';
import DeliveryStatSkeleton from '@/components/skeleton/delivery-stat-skeleton';
import { Card, CardContent } from '../ui/card';

const WelcomeSection = ({
  orderType,
}: {
  orderType: 'tiffins' | 'caterings';
}) => {
  const { data: orders, isPending } = useDeliveryOrders(orderType);
  if (isPending) {
    return <DeliveryStatSkeleton />;
  }

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-6">
        <h2 className="mb-4 font-bold text-2xl">
          Hello, Ready for Today&apos;s Deliveries?
        </h2>

        <div className="mb-2 grid grid-cols-3 gap-3">
          <Card className="bg-primary-foreground text-primary">
            <CardContent className="p-4 text-center">
              <p className="font-bold text-2xl">{orders?.stats?.total}</p>
              <p className="text-xs">Total Orders</p>
            </CardContent>
          </Card>
          <Card className="bg-primary-foreground text-primary">
            <CardContent className="p-4 text-center">
              <p className="font-bold text-2xl">{orders?.stats?.pending}</p>
              <p className="text-xs">Pending</p>
            </CardContent>
          </Card>
          <Card className="bg-primary-foreground text-primary">
            <CardContent className="p-4 text-center">
              <p className="font-bold text-2xl">{orders?.stats?.delivered}</p>
              <p className="text-xs">Completed</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
