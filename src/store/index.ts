import { configureStore } from '@reduxjs/toolkit';
import cateringCustomItemReducer from './slices/catering-custom-item-slice';
import cateringItemReducer from './slices/catering-item-slice';
import cateringOrderReducer from './slices/catering-order-slice';
import selectStoreReducer from './slices/select-store-slice';
import selectYearReducer from './slices/select-year-slice';

export const store = configureStore({
  reducer: {
    cateringItem: cateringItemReducer,
    cateringCustomItem: cateringCustomItemReducer,
    cateringOrder: cateringOrderReducer,
    selectStore: selectStoreReducer,
    selectYear: selectYearReducer,
  },
});

// Infer types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
