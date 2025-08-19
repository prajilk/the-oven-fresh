import { ImageIcon, Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import type { CateringCustomItemState } from '@/lib/types/catering/catering-order-state';
import { removeCustomItem } from '@/store/slices/catering-custom-item-slice';
import { setAdvancePaid } from '@/store/slices/catering-order-slice';

const FinalCustomItemCard = ({ item }: { item: CateringCustomItemState }) => {
  const dispatch = useDispatch();

  function handleRemoveItem(name: string) {
    dispatch(removeCustomItem({ name }));
    dispatch(setAdvancePaid(0));
  }

  return (
    <div className="mb-2 flex space-x-4 rounded-md border p-3 shadow">
      <div className="flex size-[70px] items-center justify-center rounded-md shadow">
        <ImageIcon size={15} />
      </div>
      <div className="flex-1">
        <h3 className="flex items-center gap-1 font-medium">{item.name} </h3>
        <p className="text-gray-500 text-xs capitalize">Size: {item.size}</p>
      </div>
      <div className="flex flex-col items-end justify-between">
        <p className="font-medium">${item.priceAtOrder.toFixed(2)}</p>
        <Button
          className="bg-transparent text-red-500 hover:bg-red-200"
          onClick={() => handleRemoveItem(item.name)}
          size={'icon'}
        >
          <Trash2 size={17} />
        </Button>
      </div>
    </div>
  );
};

export default FinalCustomItemCard;
