import { Box, Stack } from '@mui/material';
import { Suspense } from 'react';
import Header from '@/components/dashboard/header';
import DeliveryProof from '@/components/delivery-proof/delivery-proof';
import DisableSendingCard from '@/components/delivery-proof/disable-sending-card';
import ServerWrapper from '@/components/server-wrapper';
import { getDeliveryProofServer } from '@/lib/api/delivery-proof/get-delivery-proof-server';

const DeliveryProofPage = () => {
  return (
    <Box className="flex-grow" component="main">
      <Header />
      <Stack
        spacing={2}
        sx={{
          alignItems: 'center',
          mx: { xs: 1.5, sm: 3 },
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
          <Suspense fallback={<div>Loading...</div>}>
            <ServerWrapper
              queryFn={getDeliveryProofServer}
              queryKey={['delivery-proof', 1, '']}
            >
              <DeliveryProof />
            </ServerWrapper>
          </Suspense>

          <DisableSendingCard />
        </Box>
      </Stack>
    </Box>
  );
};

export default DeliveryProofPage;
