import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./slice/ProductListSlice";
import compareSlice from './slice/CompareSlice';


export const store = configureStore({
    reducer: {
        products: productSlice,
        compare: compareSlice,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;