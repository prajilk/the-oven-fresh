'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { areaElementClasses } from '@mui/x-charts/LineChart';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { useLastMonthStats } from '@/api-hooks/last-month-stat';
import StatCardSKeleton from '@/components/skeleton/stat-card-skeleton';

function getLast30Days() {
  const days: string[] = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - i);

    const formattedDate = pastDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    days.push(formattedDate);
  }

  return days.reverse(); // Reverse to show oldest first
}

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

export default function StatCard({ type }: { type: 'tiffin' | 'catering' }) {
  const { data, isPending } = useLastMonthStats(type);

  const theme = useTheme();

  const daysInWeek = getLast30Days();

  const trendColors = {
    up: theme.palette.success.main,
    down: theme.palette.error.main,
    neutral: theme.palette.grey[400],
  };

  const labelColors = {
    up: 'success' as const,
    down: 'error' as const,
    neutral: 'default' as const,
  };

  if (!data) {
    return <h1>Failed to retrieve data</h1>;
  }

  const color = labelColors[data.trend];
  const chartColor = trendColors[data.trend];
  const trendValues = { up: '+25%', down: '-25%', neutral: '+5%' };

  if (isPending) {
    return <StatCardSKeleton />;
  }

  return (
    <Card
      className="!bg-primary-foreground"
      sx={{ height: '100%', flexGrow: 1 }}
      variant="outlined"
    >
      <CardContent className="bg-transparent">
        <Typography
          className="capitalize"
          component="h2"
          gutterBottom
          variant="subtitle2"
        >
          {data.title}
        </Typography>
        <Stack
          direction="column"
          sx={{
            justifyContent: 'space-between',
            flexGrow: '1',
            gap: 1,
          }}
        >
          <Stack sx={{ justifyContent: 'space-between' }}>
            <Stack
              direction="row"
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography component="p" variant="h4">
                {data.value}
              </Typography>
              <Chip
                color={color}
                label={
                  data.percentage ? data.percentage : trendValues[data.trend]
                }
                size="small"
              />
            </Stack>
            <Typography sx={{ color: 'text.secondary' }} variant="caption">
              Last 30 days
            </Typography>
          </Stack>
          <Box sx={{ width: '100%', height: 50 }}>
            <SparkLineChart
              area
              colors={[chartColor]}
              data={data.data}
              showHighlight
              showTooltip
              sx={{
                [`& .${areaElementClasses.root}`]: {
                  fill: `url(#area-gradient-${data.value})`,
                },
              }}
              xAxis={{
                scaleType: 'band',
                data: daysInWeek, // Use the correct property 'data' for xAxis
              }}
            >
              <AreaGradient
                color={chartColor}
                id={`area-gradient-${data.value}`}
              />
            </SparkLineChart>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
