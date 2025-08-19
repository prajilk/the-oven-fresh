import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CateringItemsState } from '@/lib/types/catering/catering-order-state';

const initialState: CateringItemsState[] = [];

export const cateringItemSlice = createSlice({
  name: 'cateringOrder',
  initialState,
  reducers: {
    incrementQuantity: (state, action: PayloadAction<CateringItemsState>) => {
      const existingItem = state.find(
        (item) =>
          item._id === action.payload._id && item.size === action.payload.size
      );

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 0) + 1;
      } else {
        state.push({ ...action.payload, quantity: 1 }); // Ensure quantity is initialized
      }
    },
    decrementQuantity: (state, action: PayloadAction<CateringItemsState>) => {
      const existingItem = state.find(
        (item) =>
          item._id === action.payload._id && item.size === action.payload.size
      );

      if (existingItem) {
        if (existingItem.quantity === 1) {
          return state.filter(
            (item) =>
              item._id !== action.payload._id ||
              item.size !== action.payload.size
          );
        }
        existingItem.quantity = (existingItem.quantity || 0) - 1;
      }
    },
    removeItem: (
      state,
      action: PayloadAction<{ _id: string; size: string }>
    ) => {
      return state.filter(
        (item) =>
          item._id !== action.payload._id || item.size !== action.payload.size
      );
    },
    clearState: () => {
      return initialState;
    },
  },
});

export const { decrementQuantity, incrementQuantity, removeItem, clearState } =
  cateringItemSlice.actions;
export default cateringItemSlice.reducer;
