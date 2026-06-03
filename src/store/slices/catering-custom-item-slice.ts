import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CateringCustomItemState } from "@/lib/types/catering/catering-order-state";

const initialState: CateringCustomItemState[] = [];

export const cateringCustomItemSlice = createSlice({
    name: "cateringCustomItem",
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<CateringCustomItemState>) => {
            state.push(action.payload);
        },
        incrementQuantity: (
            state,
            action: PayloadAction<CateringCustomItemState>
        ) => {
            const existingItem = state.find(
                (item) => item._id === action.payload._id
            );

            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 0) + 1;
            } else {
                state.push({ ...action.payload, quantity: 1 }); // Ensure quantity is initialized
            }
        },
        decrementQuantity: (
            state,
            action: PayloadAction<CateringCustomItemState>
        ) => {
            const existingItem = state.find(
                (item) => item._id === action.payload._id
            );

            if (existingItem) {
                if (existingItem.quantity === 1) {
                    return state.filter(
                        (item) => item._id !== action.payload._id
                    );
                }
                existingItem.quantity = (existingItem.quantity || 0) - 1;
            }
        },
        removeCustomItem: (
            state,
            action: PayloadAction<{ itemDescription: string }>
        ) => {
            return state.filter(
                (item) =>
                    item.itemDescription.toLowerCase() !==
                    action.payload.itemDescription.toLowerCase()
            );
        },
        clearCustomItemState: () => {
            return initialState;
        },
    },
});

export const {
    addItem,
    removeCustomItem,
    clearCustomItemState,
    decrementQuantity,
    incrementQuantity,
} = cateringCustomItemSlice.actions;
export default cateringCustomItemSlice.reducer;
