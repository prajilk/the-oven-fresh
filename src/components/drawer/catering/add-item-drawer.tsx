'use client';

import { Button as HeroButton } from '@heroui/button';
import { Input } from '@heroui/input';
import { Loader2, Plus, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { revalidateOrder } from '@/actions/revalidate-order';
import { useAddItems } from '@/api-hooks/catering/add-items';
import { useCateringMenu } from '@/api-hooks/catering/get-catering-menu';
import MenuItemCard from '@/components/catering/select-items/menu-item-card';
import { Show } from '@/components/show';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import type { CateringMenuDocumentPopulate } from '@/models/types/catering-menu';
import type { RootState } from '@/store';
import { clearState } from '@/store/slices/catering-item-slice';

export function AddItemDrawer({
  orderId,
  existingItems,
}: {
  orderId: string;
  existingItems: string[];
}) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [filterMenu, setFilterMenu] = useState<
    CateringMenuDocumentPopulate[] | null
  >();

  const menuItems = useSelector((state: RootState) => state.cateringItem);
  const dispatch = useDispatch();

  const { data: menu, isPending } = useCateringMenu();

  function onSuccess() {
    toast.success('Item added successfully.');
    dispatch(clearState());
    setOpen(false);
    revalidateOrder(`/dashboard/orders/catering-${orderId}`);
  }

  const mutation = useAddItems(onSuccess);

  useEffect(() => {
    setFilterMenu(menu?.filter((item) => !existingItems.includes(item._id)));
  }, [menu, existingItems]);

  useEffect(() => {
    if (search.length > 0) {
      setFilterMenu(
        menu?.filter(
          (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) &&
            !existingItems.includes(item._id)
        )
      );
    } else {
      setFilterMenu(menu?.filter((item) => !existingItems.includes(item._id)));
    }
  }, [menu, search, existingItems]);

  function handelClose(value: boolean) {
    dispatch(clearState());
    setOpen(value);
  }

  return (
    <Drawer onOpenChange={handelClose} open={open}>
      <DrawerTrigger asChild>
        <HeroButton isIconOnly radius="full" size="sm" variant="flat">
          <Plus size={15} />
        </HeroButton>
      </DrawerTrigger>
      <DrawerContent className="mx-auto h-[90%] max-w-5xl">
        <div className="mx-auto flex h-full w-full flex-col">
          <DrawerHeader className="flex items-center justify-between">
            <DrawerTitle>Select Items</DrawerTitle>
            <DialogClose asChild>
              <Button className="rounded-full" size="icon" variant="outline">
                <X size={15} />
              </Button>
            </DialogClose>
          </DrawerHeader>
          <div className="scrollbar-thin flex-1 overflow-y-scroll px-4 pb-0">
            <Show>
              <Show.When isTrue={!isPending}>
                <div className="mb-3">
                  <Input
                    className="max-w-sm"
                    onValueChange={setSearch}
                    placeholder="Search items..."
                    startContent={<Search size={15} />}
                    value={search}
                  />
                </div>
              </Show.When>
            </Show>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              <Show>
                <Show.When isTrue={isPending}>
                  <div className="col-span-3 flex items-center justify-center gap-3 py-20">
                    <Loader2 className="animate-spin" /> Fetching menu...
                  </div>
                </Show.When>
                <Show.Else>
                  <Show.When
                    isTrue={
                      filterMenu !== null &&
                      filterMenu !== undefined &&
                      filterMenu.length > 0
                    }
                  >
                    {filterMenu?.map((item) => (
                      <MenuItemCard item={item} key={item._id} />
                    ))}
                  </Show.When>
                  <Show.Else>
                    <div className="col-span-3 py-10 text-center">
                      No items found.
                    </div>
                  </Show.Else>
                </Show.Else>
              </Show>
            </div>
          </div>
          <DrawerFooter className="flex-row justify-end pb-7">
            <Button
              disabled={mutation.isPending}
              onClick={() =>
                mutation.mutate({
                  orderId,
                  menuItems,
                })
              }
            >
              Add Item
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
