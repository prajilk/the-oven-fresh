'use client';

import { Loader2, Pencil, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { editTiffinMenuAction } from '@/actions/edit-catering-tiffin-action';
import { useTiffinMenu } from '@/api-hooks/tiffin/get-tiffin-menu';
import getQueryClient from '@/lib/query-utils/get-query-client';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const TiffinMenuList = () => {
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: menu, isPending } = useTiffinMenu();

  const queryClient = getQueryClient();

  function handleSubmit(formData: FormData) {
    setLoading(true);
    const data = Object.fromEntries(formData);

    const pickupMenu = {
      '2_weeks': Number(data.pickup_2_weeks),
      '3_weeks': Number(data.pickup_3_weeks),
      '4_weeks': Number(data.pickup_4_weeks),
    };

    const deliveryMenu = {
      '2_weeks': Number(data.delivery_2_weeks),
      '3_weeks': Number(data.delivery_3_weeks),
      '4_weeks': Number(data.delivery_4_weeks),
    };

    const promise = async () => {
      const result = await editTiffinMenuAction({
        pickupMenu,
        deliveryMenu,
      });
      setLoading(false);
      setEdit(false);
      queryClient.invalidateQueries({ queryKey: ['menu', 'tiffin'] });

      if (result.success) {
        return result; // resolves
      }
      throw result; // rejects
    };

    toast.promise(promise(), {
      loading: 'Updating menu...',
      success: () => 'Menu updated successfully.',
      error: ({ error }) => (error ? error : 'Failed to update menu.'),
    });
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center gap-2 py-10">
        <Loader2 className="animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-xl">Tiffin Menu</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            className="rounded-full"
            onClick={() => setEdit(!edit)}
            size={'icon'}
            variant={'ghost'}
          >
            {edit ? <X size={15} /> : <Pencil size={15} />}
          </Button>
          <Button
            disabled={!edit || loading}
            form="edit-tiffin-menu"
            size={'sm'}
          >
            Save
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form
          action={handleSubmit}
          className="grid grid-cols-2 md:grid-cols-3"
          id="edit-tiffin-menu"
        >
          <div className="border-black/30 border-r pr-5">
            <h1 className="mb-3 font-medium text-lg">Pickup Menu</h1>
            <div className="space-y-1">
              <ItemDisplay
                defaultValue={menu?.pickup['2_weeks'] || 0}
                label="2 Weeks"
                name="pickup_2_weeks"
                readOnly={!edit}
              />
              <ItemDisplay
                defaultValue={menu?.pickup['3_weeks'] || 0}
                label="3 Weeks"
                name="pickup_3_weeks"
                readOnly={!edit}
              />
              <ItemDisplay
                defaultValue={menu?.pickup['4_weeks'] || 0}
                label="4 Weeks"
                name="pickup_4_weeks"
                readOnly={!edit}
              />
            </div>
          </div>
          <div className="pl-5">
            <h1 className="mb-3 font-medium text-lg">Delivery Menu</h1>
            <div className="space-y-1">
              <ItemDisplay
                defaultValue={menu?.delivery['2_weeks'] || 0}
                label="2 Weeks"
                name="delivery_2_weeks"
                readOnly={!edit}
              />
              <ItemDisplay
                defaultValue={menu?.delivery['3_weeks'] || 0}
                label="3 Weeks"
                name="delivery_3_weeks"
                readOnly={!edit}
              />
              <ItemDisplay
                defaultValue={menu?.delivery['4_weeks'] || 0}
                label="4 Weeks"
                name="delivery_4_weeks"
                readOnly={!edit}
              />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TiffinMenuList;

function ItemDisplay({
  defaultValue,
  readOnly,
  name,
  label,
}: {
  defaultValue: number;
  readOnly: boolean;
  name: string;
  label: string;
}) {
  return (
    <div className="grid grid-cols-2 items-center gap-1">
      <Label>{label}</Label>
      <div className="flex items-center gap-1">
        <span>$</span>
        <Input
          defaultValue={defaultValue}
          min={0}
          name={name}
          placeholder="Price"
          readOnly={readOnly}
          slot="0.01"
          type="number"
        />
      </div>
    </div>
  );
}
