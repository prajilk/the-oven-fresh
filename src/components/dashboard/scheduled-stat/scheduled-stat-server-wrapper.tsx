import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getOrderStatCountsServer } from '@/lib/api/order/get-order-stat-counts';

const ScheduledStatServerWrapper = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } },
  });
  await queryClient.prefetchQuery({
    queryKey: ['order', 'stats', 'today'],
    queryFn: getOrderStatCountsServer,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
};

export default ScheduledStatServerWrapper;
