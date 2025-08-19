import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import { Suspense } from 'react';
import Header from '@/components/dashboard/header';
import ScheduledStatCard from '@/components/dashboard/scheduled-stat/scheduled-stat-card';
import ScheduledStatServerWrapper from '@/components/dashboard/scheduled-stat/scheduled-stat-server-wrapper';
import StatCardWrapper from '@/components/dashboard/stat-card/stat-card-wrapper';
import CateringServerWrapper from '@/components/data-table/catering/catering-server-wrapper';
import RecentCateringOrderTable from '@/components/data-table/catering/recent-catering-order-table';
import RecentTiffinOrderTable from '@/components/data-table/tiffin/recent-tiffin-order-table';
import TiffinServerWrapper from '@/components/data-table/tiffin/tiffin-server-wrapper';
import ScheduledStatSkeleton from '@/components/skeleton/scheduled-stat-skeleton';
import StatCardSKeleton from '@/components/skeleton/stat-card-skeleton';
import TableSkeleton from '@/components/skeleton/table-skeleton';

export default function Dashboard() {
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
          alignItems: 'center',
          mx: { xs: 2, md: 3 },
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
          {/* cards */}
          <Typography component="h2" sx={{ mb: 2 }} variant="h6">
            Overview
          </Typography>
          <Grid columns={12} container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
              <Suspense fallback={<ScheduledStatSkeleton />}>
                <ScheduledStatServerWrapper>
                  <ScheduledStatCard />
                </ScheduledStatServerWrapper>
              </Suspense>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Suspense fallback={<StatCardSKeleton />}>
                <StatCardWrapper type="tiffin" />
              </Suspense>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Suspense fallback={<StatCardSKeleton />}>
                <StatCardWrapper type="catering" />
              </Suspense>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Suspense fallback={<TableSkeleton />}>
                <CateringServerWrapper>
                  <RecentCateringOrderTable />
                </CateringServerWrapper>
              </Suspense>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Suspense fallback={<TableSkeleton />}>
                <TiffinServerWrapper>
                  <RecentTiffinOrderTable />
                </TiffinServerWrapper>
              </Suspense>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Box>
  );
}
