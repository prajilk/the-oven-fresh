import { Skeleton } from '../ui/skeleton';

const DeliveryStatSkeleton = () => {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-6">
        <h2 className="mb-4 flex font-bold text-2xl">
          Hello, Ready for Today&apos;s Deliveries?
        </h2>

        <div className="mb-2 grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-primary-foreground p-4 shadow"
              // biome-ignore lint/suspicious/noArrayIndexKey: <Ignore>
              key={i}
            >
              <Skeleton className="size-6 rounded-md bg-primary/30" />
              <Skeleton className="h-4 w-20 rounded-md bg-primary/30" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeliveryStatSkeleton;
