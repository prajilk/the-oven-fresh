import { Box, Stack } from '@mui/material';
import { notFound } from 'next/navigation';
import CateringOrderDetails from '@/components/catering/order-details';
import Header from '@/components/dashboard/header';
import TiffinOrderDetails from '@/components/tiffin/order-details';
import { getOrderServer } from '@/lib/api/order/get-order';
import type { CateringDocumentPopulate } from '@/models/types/catering';
import type { TiffinDocumentPopulate } from '@/models/types/tiffin';

const OrderPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ mid: string | undefined }>;
}) => {
  const { orderId: orderKey } = await params;
  const orderType = orderKey.split('-')[0];
  const orderId = `${orderKey.split('-')[1]}-${orderKey.split('-')[2]}`;
  const mid = (await searchParams).mid;

  if (orderType !== 'catering' && orderType !== 'tiffin') {
    return notFound();
  }

  const order = await getOrderServer(orderId, orderType, mid as string).catch(
    () => notFound()
  );

  if (!order) {
    return notFound();
  }

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
        {orderType === 'catering' ? (
          <CateringOrderDetails orderData={order as CateringDocumentPopulate} />
        ) : (
          <TiffinOrderDetails orderData={order as TiffinDocumentPopulate} />
        )}
      </Stack>
    </Box>
  );
};

export default OrderPage;
