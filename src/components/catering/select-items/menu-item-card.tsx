'use client';

import { Radio, RadioGroup } from '@heroui/radio';
import { Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { CateringMenuDocumentPopulate } from '@/models/types/catering-menu';
import type { RootState } from '@/store';
import {
  decrementQuantity,
  incrementQuantity,
} from '@/store/slices/catering-item-slice';

type Size = 'small' | 'medium' | 'large';
type MenuItemCardProps = {
  item: CateringMenuDocumentPopulate;
};

const MenuItemCard = ({ item }: MenuItemCardProps) => {
  const [imgSrc, setImgSrc] = useState(item.image);
  const [size, setSize] = useState<Size>(
    // biome-ignore lint/style/noNestedTernary: <Ignore>
    item.smallPrice ? 'small' : item.mediumPrice ? 'medium' : 'large'
  );
  const cateringOrder = useSelector((state: RootState) => state.cateringItem);
  const dispatch = useDispatch();

  useEffect(() => {
    setImgSrc(item.image);
  }, [item.image]);

  const handleIncrement = () => {
    dispatch(
      incrementQuantity({
        _id: item._id,
        name: item.name,
        category: item.category.name,
        variant: item.variant || undefined,
        image: item.image || '/fsr-placeholder.webp',
        size,
        priceAtOrder: item[`${size}Price`] || 0,
        quantity: 1,
      })
    );
  };

  const handleDecrement = () => {
    dispatch(
      decrementQuantity({
        _id: item._id,
        name: item.name,
        category: item.category.name,
        variant: item.variant || undefined,
        image: item.image || '/fsr-placeholder.webp',
        size,
        priceAtOrder: item[`${size}Price`] || 0,
        quantity: 1,
      })
    );
  };

  const quantity =
    cateringOrder.find(
      (orderItem) => orderItem._id === item._id && orderItem.size === size
    )?.quantity || 0;

  return (
    <Card key={item._id}>
      <div className="flex items-center border-b p-3">
        <div className="relative mr-3 h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
          <Image
            alt={item.name}
            className="h-full w-full object-cover"
            fill
            onError={() => setImgSrc('/fsr-placeholder.webp')}
            src={imgSrc || '/'}
          />
        </div>
        <div>
          <h3 className="font-medium">{item.name}</h3>
          {item.variant && (
            <Badge className="mt-1" variant="outline">
              {item.variant}
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-3">
        <div className="grid grid-cols-1 gap-1 text-sm">
          <RadioGroup
            label="Select size"
            onValueChange={(value) => setSize(value as Size)}
            size="sm"
            value={size}
          >
            {item.smallPrice && (
              <div className="flex justify-between">
                <Radio value="small">
                  Small ({item.smallServingSize || '5 PPL'})
                </Radio>
                <span>$ {item.smallPrice}</span>
              </div>
            )}
            {item.mediumPrice && (
              <div className="flex justify-between">
                <Radio value="medium">
                  Medium ({item.mediumServingSize || '10 PPL'})
                </Radio>
                <span>$ {item.mediumPrice}</span>
              </div>
            )}
            {item.largePrice && (
              <div className="flex justify-between">
                <Radio value="large">
                  Full Deep ({item.largeServingSize || '15 PPL'})
                </Radio>
                <span>$ {item.largePrice}</span>
              </div>
            )}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <div className="ms-auto flex items-center rounded-full bg-gray-200 p-0.5">
          <Button
            className="flex size-9 items-center justify-center rounded-full bg-white text-black shadow-sm hover:bg-white/50"
            disabled={quantity === 0}
            onClick={handleDecrement}
            size={'icon'}
            type="button"
          >
            <Minus size={15} />
          </Button>
          <div className="w-6 select-none text-center">{quantity}</div>
          <Button
            className="flex size-9 items-center justify-center rounded-full bg-primary shadow-sm"
            onClick={handleIncrement}
            size={'icon'}
            type="button"
          >
            <Plus size={15} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;
