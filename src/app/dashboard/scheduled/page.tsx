import { Box, Divider, Stack } from '@mui/material';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { format } from 'date-fns';
import Header from '@/components/dashboard/header';
import ScheduledDeliveries from '@/components/scheduled-deliveries/scheduled-deliveries';
import ScheduledOrders from '@/components/scheduled-orders/scheduled-orders';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import connectDB from '@/config/mongoose';
import { getScheduledDeliveriesServer } from '@/lib/api/order/get-scheduled-deliveries';
import { getScheduledOrdersServer } from '@/lib/api/order/get-scheduled-orders';
import { getCurrentUser } from '@/lib/auth';
import type { UserDocument } from '@/models/types/user';

const ScheduledPage = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized!');
  }
  const storeId = user.storeId.toString();

  if (!storeId) {
    throw new Error('Store ID not found!');
  }

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } },
  });
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [
        'order',
        'scheduled',
        storeId,
        format(new Date(), 'yyyy-MM-dd'),
      ],
      queryFn: () => getScheduledOrdersServer(new Date(), storeId),
    }),
    queryClient.prefetchQuery({
      queryKey: ['order', 'scheduled', storeId, 'delivery'],
      queryFn: () => getScheduledDeliveriesServer(storeId),
    }),
  ]);

  const mongooseConn = await connectDB();
  const allStaffs: UserDocument[] = await mongooseConn.connection.db
    .collection('user')
    .find(
      { role: 'delivery', storeId: user.storeId },
      {
        projection: {
          username: 1,
          _id: 1,
          zone: 1,
        },
      }
    )
    .toArray();

  const formattedStaffs = allStaffs.map((staff) => ({
    _id: staff._id.toString(),
    username: staff.username,
    role: staff.role,
    zone: staff.zone,
  }));

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        overflow: 'auto',
        // position: "relative",
      }}
    >
      <Header />
      <Stack
        spacing={2}
        sx={{
          mx: { xs: 1.5, md: 3 },
          pb: 5,
          pt: { xs: 2, md: 0 },
          mt: { xs: 8, md: 2 },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: { sm: '100%', md: '1700px' },
          }}
        >
          <Tabs defaultValue="scheduled-orders">
            <TabsList>
              <TabsTrigger value="scheduled-orders">
                Scheduled orders
              </TabsTrigger>
              <TabsTrigger value="scheduled-delivery">
                Scheduled delivery
              </TabsTrigger>
            </TabsList>
            <div className="pt-3">
              <Divider />
            </div>
            <TabsContent className="pt-3" value="scheduled-orders">
              <HydrationBoundary state={dehydrate(queryClient)}>
                <ScheduledOrders storeId={storeId} />
              </HydrationBoundary>
            </TabsContent>
            <TabsContent className="pt-3" value="scheduled-delivery">
              <HydrationBoundary state={dehydrate(queryClient)}>
                <ScheduledDeliveries staffs={formattedStaffs} />
              </HydrationBoundary>
            </TabsContent>
          </Tabs>
        </Box>
      </Stack>
    </Box>
  );
};

export default ScheduledPage;
