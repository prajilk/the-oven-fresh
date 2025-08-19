import type { SetStateAction } from 'react';
import type { CateringDocumentPopulate } from '@/models/types/catering';
import type { CateringMenuDocument } from '@/models/types/catering-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type ItemProps = CateringDocumentPopulate['items'][0];

type SizeSelectProps = {
  defaultSize: string;
  itemId: string;
  setOrderItems: (value: SetStateAction<ItemProps[]>) => void;
  menu: CateringMenuDocument;
};

const SizeSelect = ({
  defaultSize = 'small',
  itemId,
  setOrderItems,
  menu,
}: SizeSelectProps) => {
  function handleValue(value: string) {
    setOrderItems((prevItems) => {
      // Step 1: Update the size and price of the item
      const updatedItems = prevItems.map((item) => {
        if (item.itemId._id === itemId && item.size === defaultSize) {
          // Update the size and priceAtOrder based on the new size
          return {
            ...item,
            size: value,
            priceAtOrder: menu[`${value}Price` as 'smallPrice'] || 0,
          };
        }
        return item;
      });

      // Step 2: Combine items with the same itemId and size
      const finalItems = updatedItems.reduce((acc: ItemProps[], item) => {
        const existingItem = acc.find(
          (i) => i.itemId._id === item.itemId._id && i.size === item.size
        );

        if (existingItem) {
          // If the item already exists with the same size, combine quantities
          existingItem.quantity += item.quantity;
        } else {
          // Otherwise, add the item to the array
          acc.push({ ...item });
        }

        return acc;
      }, []);

      return finalItems;
    });
  }

  const filteredItems = filterItems(menu);

  return (
    <Select defaultValue={defaultSize} onValueChange={handleValue}>
      <SelectTrigger className="w-28">
        <SelectValue placeholder="Select a size" />
      </SelectTrigger>
      <SelectContent>
        {filteredItems.map((size, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <Ignore>
          <SelectItem className="capitalize" key={`${size}-${i}`} value={size}>
            {size}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SizeSelect;

function filterItems(item: CateringMenuDocument) {
  const filteredItems: ('small' | 'medium' | 'large')[] = [];
  if (item.smallPrice) {
    filteredItems.push('small');
  }
  if (item.mediumPrice) {
    filteredItems.push('medium');
  }
  if (item.largePrice) {
    filteredItems.push('large');
  }
  return filteredItems;
}
