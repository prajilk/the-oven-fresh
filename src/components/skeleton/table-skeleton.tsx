import { Skeleton } from '../ui/skeleton';

const TableSkeleton = () => {
  return (
    <div className="w-full rounded-lg border p-6 shadow-md">
      <div className="mb-3 flex justify-between">
        <Skeleton className="h-7 w-1/4 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md shadow-md" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-10 w-full rounded-lg shadow-md" />
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <Ignore>
            <Skeleton className="h-5 w-full rounded-md" key={i} />
          ))}
        </div>
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <Ignore>
            <Skeleton className="h-5 w-full rounded-md" key={i} />
          ))}
        </div>
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <Ignore>
            <Skeleton className="h-5 w-full rounded-md" key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;
