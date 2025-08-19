import { cn } from '@heroui/theme';
import { SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

const OrderCard = ({
  mid,
  orderId,
  address,
  status,
  orderType,
}: {
  mid: string;
  orderId: string;
  address: string;
  status: string;
  orderType: 'tiffin' | 'catering';
}) => {
  return (
    <div className="flex w-full items-center justify-between rounded-md border p-3 shadow-sm">
      <div>
        <h2 className="font-medium text-sm">
          Order ID: {orderId} <CustomChip>{status}</CustomChip>
        </h2>
        <p className="text-xs">Address: {address}</p>
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/dashboard/orders/${orderType}-${orderId}?mid=${mid}`}
                target="_blank"
              >
                <button
                  className="flex size-8 items-center justify-center rounded-md border bg-white shadow"
                  type="button"
                >
                  <SquareArrowOutUpRight size={20} />
                </button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>View order details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {/* <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button className="bg-white size-8 flex justify-center items-center rounded-md shadow border">
                                <ArrowRight size={20} />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Move to zone 2</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider> */}
      </div>
    </div>
  );
};

export default OrderCard;

function CustomChip({ children }: { children: ReactNode }) {
  const colorMap: Record<string, string> = {
    DELIVERED: 'bg-success',
    ONGOING: 'bg-warning',
    PENDING: 'bg-primary',
  };
  return (
    <span
      className={cn(
        'rounded-md px-2 py-0.5 text-primary-foreground text-xs',
        colorMap[children as string]
      )}
    >
      {children}
    </span>
  );
}
