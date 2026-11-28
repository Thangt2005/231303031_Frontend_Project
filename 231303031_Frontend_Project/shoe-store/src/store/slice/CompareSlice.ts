import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from './ProductListSlice';

// Chỉ cho so sánh tối đa 3 sản phẩm
const MAX_COMPARE = 3;

type CompareState = {
    selectedProducts: Product[];
};

const initialState: CompareState = {
    selectedProducts: [],
};

const compareSlice = createSlice({
    name: 'compare',
    initialState,
    reducers: {
        // Thêm sản phẩm vào danh sách so sánh
        addCompare(state, action: PayloadAction<Product>) {
            const product = action.payload;

            // Sản phẩm đã có trong danh sách thì không thêm nữa
            const found = state.selectedProducts.find((item) => item.id === product.id);

            if (found) {
                return;
            }

            // Đủ 3 sản phẩm thì không thêm nữa
            if (state.selectedProducts.length >= MAX_COMPARE) {
                return;
            }

            state.selectedProducts.push(product);
        },

        // Xóa sản phẩm theo id
        removeCompare(state, action: PayloadAction<number>) {
            const id = action.payload;

            state.selectedProducts = state.selectedProducts.filter((item) => item.id !== id);
        },
    },
});

export const { addCompare, removeCompare } = compareSlice.actions;

export default compareSlice.reducer;