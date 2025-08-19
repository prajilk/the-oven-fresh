import Image from 'next/image';
import type { CateringItemsState } from '@/lib/types/catering/catering-order-state';

function ItemCardSummary({ item }: { item: Partial<CateringItemsState> }) {
  return (
    <div className="flex gap-2 px-3">
      <Image
        alt={item.name || 'image'}
        className="size-14 rounded"
        height={56}
        src={item.image || process.env.NEXT_PUBLIC_PLACEHOLDER_IMAGE || ''}
        width={56}
      />
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-1">
          <span className="font-medium">{item.name}</span>
          <span className="text-muted-foreground text-xs">
            - {item.variant}
          </span>
        </div>
        <span className="text-muted-foreground text-xs capitalize">
          {item.size}
        </span>
        <span className="text-muted-foreground text-xs">x{item.quantity}</span>
      </div>
      <div className="mt-auto font-medium">
        ${item.priceAtOrder || 1 * (item.quantity || 1)}
      </div>
    </div>
  );
}

export default ItemCardSummary;
