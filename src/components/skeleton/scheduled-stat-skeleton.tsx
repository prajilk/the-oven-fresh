import { Card, CardContent, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

const ScheduledStatSkeleton = () => {
  return (
    <Card className="flex h-full w-full flex-col rounded-lg bg-primary-foreground shadow-sm">
      <CardHeader className="flex-row items-center justify-between p-4 pt-2">
        <Skeleton className="h-6 w-1/2 rounded-md" />
        <Skeleton className="h-8 w-16 rounded-md" />
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <Skeleton className="size-16 flex-shrink-0 rounded-full" />
          <div className="w-full space-y-2">
            <Skeleton className="h-4 w-[90%] rounded-md" />
            <Skeleton className="h-4 w-[75%] rounded-md" />
            <Skeleton className="h-4 w-[75%] rounded-md" />
            <Skeleton className="h-4 w-[75%] rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-16 flex-shrink-0 rounded-full" />
          <div className="w-full space-y-2">
            <Skeleton className="h-4 w-[90%] rounded-md" />
            <Skeleton className="h-4 w-[75%] rounded-md" />
            <Skeleton className="h-4 w-[75%] rounded-md" />
            <Skeleton className="h-4 w-[75%] rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduledStatSkeleton;
