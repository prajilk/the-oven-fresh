'use client';

import KitchenIcon from '@mui/icons-material/Kitchen';
import TakeoutDiningIcon from '@mui/icons-material/TakeoutDiningRounded';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useOrderStatsCount } from '@/api-hooks/order-stats-count';
import ScheduledStatSkeleton from '@/components/skeleton/scheduled-stat-skeleton';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Separator } from '../../ui/separator';

const ScheduledStatCard = () => {
  const { data, isPending } = useOrderStatsCount();

  if (isPending) {
    return <ScheduledStatSkeleton />;
  }

  return (
    <Card className="flex h-full w-full flex-col rounded-lg bg-primary-foreground shadow-sm">
      <CardHeader className="flex-row items-center justify-between p-4 pt-2">
        <CardTitle className="font-medium">
          Orders Scheduled for Today:
        </CardTitle>

        <Link href={'/dashboard/scheduled'}>
          <Button className="flex items-center" size={'sm'}>
            View all
            <ChevronRight size={15} />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="flex flex-1 items-center p-5 pt-0">
        <div className="flex w-full flex-col items-start justify-evenly sm:flex-row">
          <div className="flex w-full items-center space-x-2">
            <div className="rounded-full bg-primary/10 p-2">
              <KitchenIcon className="size-5 text-primary" />
            </div>
            <div className="w-full space-y-0.5">
              <p className="font-medium text-lg">Tiffin Orders</p>
              <p className="flex justify-between text-sm leading-tight">
                Total:{' '}
                <span className="font-bold">
                  {data?.tiffinStatCounts.total}
                </span>
              </p>
              <p className="flex justify-between text-sm leading-tight">
                Delivered:{' '}
                <span className="font-bold">
                  {data?.tiffinStatCounts.delivered}
                </span>
              </p>
              <p className="flex justify-between text-sm leading-tight">
                Pending:{' '}
                <span className="font-bold">
                  {data?.tiffinStatCounts.pending}
                </span>
              </p>
            </div>
          </div>
          <Separator
            className="mx-4 hidden h-12 sm:block"
            orientation="vertical"
          />
          <Separator className="my-4 sm:hidden" orientation="horizontal" />
          <div className="flex w-full items-center space-x-2">
            <div className="rounded-full bg-primary/10 p-2">
              <TakeoutDiningIcon className="size-5 text-primary" />
            </div>
            <div className="w-full space-y-0.5">
              <p className="font-medium text-lg">Catering Orders</p>
              <p className="flex justify-between text-sm leading-tight">
                Total:{' '}
                <span className="font-bold">
                  {data?.cateringStatCounts.total}
                </span>
              </p>
              <p className="flex justify-between text-sm leading-tight">
                Delivered:{' '}
                <span className="font-bold">
                  {data?.cateringStatCounts.delivered}
                </span>
              </p>
              <p className="flex justify-between text-sm leading-tight">
                Pending:{' '}
                <span className="font-bold">
                  {data?.cateringStatCounts.pending}
                </span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduledStatCard;
