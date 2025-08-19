import { Box, Divider, Stack } from '@mui/material';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import CateringOrders from '@/components/catering/catering-orders';
import Header from '@/components/dashboard/header';
import TiffinOrders from '@/components/tiffin/tiffin-orders';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCateringOrdersServer } from '@/lib/api/order/get-catering-orders';
import { getTiffinOrdersServer } from '@/lib/api/order/get-tiffin-orders';

const Orders = async () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } },
  });
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['order', 'tiffin'],
      queryFn: () => getTiffinOrdersServer(),
    }),
    queryClient.prefetchQuery({
      queryKey: ['order', 'catering'],
      queryFn: () => getCateringOrdersServer(),
    }),
  ]);

  return (
    <Box className="flex-grow overflow-auto" component="main">
      <Header />
      <Stack
        spacing={2}
        sx={{
          alignItems: 'center',
          mx: { xs: 1.5, md: 3 },
          pb: 5,
          pt: { xs: 2, md: 0 },
          mt: { xs: 8, md: 2 },
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Tabs defaultValue="tiffin">
            <TabsList>
              <TabsTrigger value="tiffin">Tiffin Orders</TabsTrigger>
              <TabsTrigger value="catering">Catering Orders</TabsTrigger>
            </TabsList>
            <div className="pt-3">
              <Divider />
            </div>
            <TabsContent className="pt-3" value="tiffin">
              <HydrationBoundary state={dehydrate(queryClient)}>
                <TiffinOrders />
              </HydrationBoundary>
            </TabsContent>
            <TabsContent className="pt-3" value="catering">
              <HydrationBoundary state={dehydrate(queryClient)}>
                <CateringOrders />
              </HydrationBoundary>
            </TabsContent>
          </Tabs>
        </Box>
      </Stack>
    </Box>
  );
};

export default Orders;
