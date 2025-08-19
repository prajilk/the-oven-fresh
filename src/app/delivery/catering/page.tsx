import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import BottomNav from '@/components/delivery/bottom-nav';
import SortedOrderList from '@/components/delivery/sorted-order-list';
import WelcomeSection from '@/components/delivery/welcome-section';
import ServerWrapper from '@/components/server-wrapper';
import DeliveryStatSkeleton from '@/components/skeleton/delivery-stat-skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getDeliveryOrdersServer } from '@/lib/api/delivery/get-delivery-orders-server';

export default function DeliveryDashboard() {
  return (
    <>
      {/* Welcome Section */}
      <Suspense fallback={<DeliveryStatSkeleton />}>
        <ServerWrapper
          queryFn={() => getDeliveryOrdersServer('caterings')}
          queryKey={['order', 'delivery', 'caterings']}
        >
          <WelcomeSection orderType="caterings" />
        </ServerWrapper>
      </Suspense>

      <main className="container mx-auto flex-1 px-3 py-4">
        <Tabs className="w-full" defaultValue="active">
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <Suspense
            fallback={
              <div className="flex h-32 flex-col items-center justify-center">
                <Loader2 className="animate-spin" />
                <span>Loading...</span>
              </div>
            }
          >
            <ServerWrapper
              queryFn={() => getDeliveryOrdersServer('caterings')}
              queryKey={['order', 'delivery', 'caterings']}
            >
              <TabsContent className="space-y-4 pb-20" value="active">
                <SortedOrderList orderType="caterings" status="PENDING" />
              </TabsContent>
              <TabsContent className="space-y-4 pb-20" value="completed">
                <SortedOrderList orderType="caterings" status="DELIVERED" />
              </TabsContent>
            </ServerWrapper>
          </Suspense>
        </Tabs>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </>
  );
}
