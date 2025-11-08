import { Check, Pencil, X } from 'lucide-react';
import type { SetStateAction } from 'react';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

type PaymentBlockProps = {
  editState: boolean;
  itemKey: string;
  itemLabel: string;
  valueState: number;
  defaultValue: number;
  setEditState: (
    value: SetStateAction<{
      subtotal: boolean;
      deliveryCharge: boolean;
      discount: boolean;
      tax: boolean;
      total: boolean;
      advancePaid: boolean;
      pendingBalance: boolean;
      paymentMethod: boolean;
      fullyPaid: boolean;
    }>
  ) => void;
  setValueState: (
    value: SetStateAction<{
      subtotal: number;
      deliveryCharge: number;
      discount: number;
      tax: number;
      total: number;
      advancePaid: number;
      pendingBalance: number;
      paymentMethod: string;
      fullyPaid: boolean;
    }>
  ) => void;
  onCheck: () => void;
  calculateTax?: () => number;
};

const PaymentBlock = ({
  editState,
  itemKey,
  itemLabel,
  valueState,
  defaultValue,
  setEditState,
  setValueState,
  onCheck,
  calculateTax
}: PaymentBlockProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label className={cn((itemKey === "total" || itemKey === "pendingBalance") && "py-2")}>{itemLabel}</Label>
        <div className='flex items-center'>
          {editState ? (
            <>
              <button
                className="mr-1 rounded-full bg-zinc-200 p-2"
                onClick={() => {
                  setEditState((prev) => ({
                    ...prev,
                    [itemKey]: false,
                  }));
                  setValueState((prev) => ({
                    ...prev,
                    [itemKey]: defaultValue,
                  }));
                }}
                type="button"
              >
                <X size={15} />
              </button>
              <button
                className="rounded-full bg-zinc-200 p-2"
                onClick={onCheck}
                type="button"
              >
                <Check size={15} />
              </button>
            </>
          ) : (
            <button
              className={cn("rounded-full bg-zinc-100 p-2", (itemKey === "total" || itemKey === "pendingBalance") && "hidden")}
              onClick={() => {
                setEditState((prev) => ({
                  ...prev,
                  [itemKey]: true,
                }));
              }}
              type="button"
            >
              <Pencil size={15} />
            </button>
          )}
        </div>
      </div>
      <input
        className="font-bold text-sm"
        disabled={!editState}
        min={0}
        onChange={(e) => {
          setValueState((prev) => ({
            ...prev,
            [itemKey]: Number(e.target.value),
          }));
        }}
        step={0.01}
        type="number"
        value={valueState}
      />

      {itemKey === "tax" && (
        <span className='text-xs'>Tax amount: {calculateTax ? calculateTax() : 0}</span>
      )}
    </div>
  );
};

export default PaymentBlock;
