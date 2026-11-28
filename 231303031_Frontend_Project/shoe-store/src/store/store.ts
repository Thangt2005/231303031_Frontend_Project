import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./slice/ProductListSlice";
import compareSlice from './slice/CompareSlice';
import wishlistSlice, { saveWishlist } from './slice/WishlistSlice';


export const store = configureStore({
    reducer: {
        products: productSlice,
        compare: compareSlice,
        wishlist: wishlistSlice,
    }
});

// Lưu danh sách yêu thích sau mỗi lần dispatch, giống useEffect của CartContext
store.subscribe(() => {
    saveWishlist(store.getState().wishlist.items);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;