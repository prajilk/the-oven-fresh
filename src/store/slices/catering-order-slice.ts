import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CateringOrderState } from '@/lib/types/catering/catering-order-state';

const initialState: CateringOrderState = {
  store: '',
  deliveryDate: new Date(
    new Date().setDate(new Date().getDate() + 1)
  ).toISOString(),
  customerDetails: {
    firstName: '',
    lastName: '',
    phone: '',
    address: { address: '', key: 0 },
    placeId: '',
    aptSuiteUnit: '',
    lat: '',
    lng: '',
  },
  payment_method: 'cash',
  note: '',
  totalPrice: 0,
  tax: 0,
  deliveryCharge: 0,
  advancePaid: 0,
  pendingBalance: 0,
  discount: 0,
  fullyPaid: false,
  order_type: 'delivery',
};

export const cateringOrderSlice = createSlice({
  name: 'cateringOrder',
  initialState,
  reducers: {
    clearState: () => initialState,

    setStore: (state, action: PayloadAction<string>) => {
      state.store = action.payload;
    },

    setDeliveryDate: (state, action: PayloadAction<string>) => {
      state.deliveryDate = action.payload
    },

    setCustomerDetails: (
      state,
      action: PayloadAction<Partial<CateringOrderState['customerDetails']>>
    ) => {
      state.customerDetails = {
        ...state.customerDetails,
        ...action.payload,
      };
    },

    setPaymentMethod: (
      state,
      action: PayloadAction<'card' | 'cash' | 'e-transfer'>
    ) => {
      state.payment_method = action.payload;
    },

    setNote: (state, action: PayloadAction<string>) => {
      state.note = action.payload;
    },

    setAdvancePaid: (state, action: PayloadAction<number>) => {
      state.advancePaid = action.payload;
    },

    setPendingBalance: (state, action: PayloadAction<number>) => {
      state.pendingBalance = action.payload;
    },

    setFullyPaid: (state, action: PayloadAction<boolean>) => {
      state.fullyPaid = action.payload;
    },

    setTotalPrice: (state, action: PayloadAction<number>) => {
      state.totalPrice = action.payload;
    },

    setTaxAmount: (state, action: PayloadAction<number>) => {
      state.tax = action.payload;
    },

    setDeliveryCharge: (state, action: PayloadAction<number>) => {
      state.deliveryCharge = action.payload;
    },

    setDiscount: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
    },

    setOrderType: (state, action: PayloadAction<'pickup' | 'delivery'>) => {
      state.order_type = action.payload;
    },
  },
});

export const {
  clearState,
  setStore,
  setDeliveryDate,
  setCustomerDetails,
  setPaymentMethod,
  setNote,
  setAdvancePaid,
  setPendingBalance,
  setFullyPaid,
  setTotalPrice,
  setTaxAmount,
  setDeliveryCharge,
  setDiscount,
  setOrderType,
} = cateringOrderSlice.actions;

export default cateringOrderSlice.reducer;
