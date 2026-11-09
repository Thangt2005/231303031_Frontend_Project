import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProducts } from "../../services/productService";

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

interface ProductListState {
    products: Product[];
    loading: boolean;
    error: string | null;
}

const initialState: ProductListState = {
    products: [],
    loading: false,
    error: null,
};

export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
    "products/fetchProducts",
    async (_, { rejectWithValue }) => {
        try {
            const data = await getProducts();

            if (!Array.isArray(data)) {
                throw new Error("Dữ liệu sản phẩm không hợp lệ.");
            }

            return data;
        } catch (err) {
            return rejectWithValue(
                err instanceof Error ? err.message : "Không tải được sản phẩm."
            );
        }
    }
);

const productSlice = createSlice({
    initialState,
    name: "products",
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Không tải được sản phẩm.";
            });
    },
});

export default productSlice.reducer;
