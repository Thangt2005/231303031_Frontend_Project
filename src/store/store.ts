import{configureStore} from "@reduxjs/toolkit";
import productSlice from "./slice/ProductListSlice";

export const store = configureStore({
    reducer: {
        products : productSlice,
    }
})