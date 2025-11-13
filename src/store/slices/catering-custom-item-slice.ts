import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CateringCustomItemState } from '@/lib/types/catering/catering-order-state';

const initialState: CateringCustomItemState[] = [];

export const cateringCustomItemSlice = createSlice({
  name: 'cateringCustomItem',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CateringCustomItemState>) => {
      state.push(action.payload);
    },
    removeCustomItem: (state, action: PayloadAction<{ itemDescription: string }>) => {
      return state.filter(
        (item) => item.itemDescription.toLowerCase() !== action.payload.itemDescription.toLowerCase()
      );
    },
    clearCustomItemState: () => {
      return initialState;
    },
  },
});

export const { addItem, removeCustomItem, clearCustomItemState } =
  cateringCustomItemSlice.actions;
export default cateringCustomItemSlice.reducer;
