import { Skeleton } from '../ui/skeleton';

const StatCardSKeleton = () => {
  return (
    <div className="size-full space-y-3 rounded-md border bg-primary-foreground p-4">
      <Skeleton className="h-4 w-1/2 rounded-md" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-10 rounded-md" />
        <Skeleton className="h-6 w-14 rounded-md" />
      </div>
      <Skeleton className="h-4 w-2/3 rounded-md" />
      <Skeleton className="h-4 w-1/2 rounded-md" />
    </div>
  );
};

export default StatCardSKeleton;
