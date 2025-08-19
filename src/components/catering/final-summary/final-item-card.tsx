import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { Show } from '@/components/show';
import { Button } from '@/components/ui/button';
import type { CateringItemsState } from '@/lib/types/catering/catering-order-state';
import { removeItem } from '@/store/slices/catering-item-slice';
import { setAdvancePaid } from '@/store/slices/catering-order-slice';

const FinalItemCard = ({ item }: { item: CateringItemsState }) => {
  const dispatch = useDispatch();

  function handleRemoveItem(itemId: string, size: string) {
    dispatch(removeItem({ _id: itemId, size }));
    dispatch(setAdvancePaid(0));
  }

  return (
    <div className="mb-2 flex space-x-4 rounded-md border p-3 shadow">
      <Image
        alt={item.name}
        className="rounded-md shadow"
        height={70}
        src={item.image || '/placeholder.svg'}
        width={70}
      />
      <div className="flex-1">
        <h3 className="flex items-center gap-1 font-medium">
          {item.name}{' '}
          <Show>
            <Show.When isTrue={item.variant !== undefined}>
              <span className="font-normal text-muted-foreground text-xs">
                &#040;{item.variant}&#041;
              </span>
            </Show.When>
          </Show>
        </h3>
        <p className="text-gray-500 text-xs capitalize">Size: {item.size}</p>
        <p className="text-gray-500 text-xs">Quantity: {item.quantity}</p>
      </div>
      <div className="flex flex-col items-end justify-between">
        <p className="font-medium">${item.priceAtOrder.toFixed(2)}</p>
        <Button
          className="bg-transparent text-red-500 hover:bg-red-200"
          onClick={() => handleRemoveItem(item._id, item.size)}
          size={'icon'}
        >
          <Trash2 size={17} />
        </Button>
      </div>
    </div>
  );
};

export default FinalItemCard;
