import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { format } from 'date-fns';

const initialState = format(new Date(), 'yyyy');

export const selectYearSlice = createSlice({
  name: 'selectYear',
  initialState,
  reducers: {
    setYear: (_, action: PayloadAction<string>) => {
      return action.payload;
    },
  },
});

export const { setYear } = selectYearSlice.actions;
export default selectYearSlice.reducer;
