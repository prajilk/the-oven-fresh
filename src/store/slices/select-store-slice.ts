import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState = '';

export const selectStoreSlice = createSlice({
  name: 'selectState',
  initialState,
  reducers: {
    setState: (_, action: PayloadAction<string>) => {
      return action.payload;
    },
  },
});

export const { setState } = selectStoreSlice.actions;
export default selectStoreSlice.reducer;
