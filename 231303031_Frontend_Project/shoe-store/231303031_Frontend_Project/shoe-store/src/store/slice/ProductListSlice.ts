import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Product {
    id: number;
    name: string;
    brand: string;
    category: string;
    gender: string;
    price: number;
    originalPrice: number;
    sizes: number[];
    colors: string[];
    stock: number;
    rating: number;
    sold: number;
    featured: boolean;
    description: string;
    image: string;
}

const initialState: Product[] = [];

const productSlice = createSlice({
    initialState,
    name: "products",
    reducers: {
        load: (state, action: PayloadAction<Product[]>) => {
            return action.payload;
        }
    }
})

export const { load } = productSlice.actions;
export default productSlice.reducer;
