import { Box, Stack, Typography } from '@mui/material';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import Header from '@/components/dashboard/header';
import GroceriesTable from '@/components/data-table/groceries-table';
import { getGroceriesServer } from '@/lib/api/groceries/get-groceries';

const Groceries = async () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: Number.POSITIVE_INFINITY } },
  });
  await queryClient.prefetchQuery({
    queryKey: ['groceries'],
    queryFn: getGroceriesServer,
  });

  return (
    <Box className="flex-grow overflow-auto" component="main">
      <Header />
      <Stack
        spacing={2}
        sx={{
          alignItems: 'center',
          mx: 3,
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
          <Typography component="h2" sx={{ mb: 2 }} variant="h6">
            Groceries
          </Typography>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <GroceriesTable />
          </HydrationBoundary>
        </Box>
      </Stack>
    </Box>
  );
};

export default Groceries;
