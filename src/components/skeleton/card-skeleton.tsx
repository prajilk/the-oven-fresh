import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const CardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'flex min-h-[420px] items-center justify-center gap-1 rounded-lg bg-white shadow',
        className
      )}
    >
      <Loader2 className="animate-spin" />
      Loading...
    </div>
  );
};

export default CardSkeleton;
