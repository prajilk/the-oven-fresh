import { format } from 'date-fns';
import {
  Check,
  Copy,
  ImageUpscale,
  SquareArrowOutUpRight,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { deleteProofAction } from '@/actions/delete-proof-action';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { DeliveryProof } from '@/lib/types/delivery';
import DeleteDialog from '../dialog/delete-dialog';
import { Status, StatusIndicator, StatusLabel } from '../ui/kibo-ui/status';

const statusColors: Record<
  string,
  'online' | 'offline' | 'degraded' | 'maintenance'
> = {
  sent: 'online',
  failed: 'offline',
  stopped: 'degraded',
};

const ProofCard = ({ order }: { order: DeliveryProof }) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(order.image);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(order.image);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{order.orderId}</CardTitle>
            <CardDescription>
              <span className="text-primary text-sm capitalize">
                {order.store}
              </span>
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild size="icon" variant="outline">
                  <Link
                    href={`/dashboard/orders/tiffin-${order.orderId}?mid=${order.order_id}`}
                  >
                    <SquareArrowOutUpRight className="size-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>View order details</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <div className="relative aspect-video bg-muted">
        <Image
          alt="Primary proof image"
          className="aspect-[3/2] object-cover"
          fill
          onError={() => setImageSrc('/fsr-placeholder.webp')}
          src={imageSrc || '/'}
        />
        <div className="absolute top-0 right-0 z-10 m-1 flex items-center gap-1">
          <DeleteDialog
            action={deleteProofAction}
            errorMsg="Failed to delete proof"
            id={order._id}
            loadingMsg="Deleting proof..."
            successMsg="Proof deleted successfully!"
            title="proof"
          >
            <button className="rounded-md bg-white/90 p-1" type="button">
              <Trash2 className="size-4 text-red-500" />
            </button>
          </DeleteDialog>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="rounded-md bg-white/90 p-1" type="button">
                  <Link href={order.image} target="_blank">
                    <ImageUpscale className="size-4" />
                  </Link>
                </button>
              </TooltipTrigger>
              <TooltipContent>View in a new tab</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="rounded-md bg-white/90 p-1"
                  onClick={handleCopy}
                  type="button"
                >
                  {copied ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>Copy URL</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <CardContent className="p-3">
        <div className="flex items-center gap-1 text-xs">
          <p className="text-muted-foreground">Delivered:</p>
          <p>{format(new Date(order.deliveryDate), 'PPP')}</p>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <p className="text-muted-foreground">Delivered by:</p>
          <p className="capitalize">{order.user}</p>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <p className="text-muted-foreground">Message Status:</p>
          <Status status={statusColors[order.messageStatus]}>
            <StatusIndicator />
            <StatusLabel className="capitalize">
              {order.messageStatus}
            </StatusLabel>
          </Status>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProofCard;
