import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from './ProductListSlice';

// Giống giỏ hàng: danh sách yêu thích được lưu trong localStorage
const WISHLIST_STORAGE_KEY = 'wishlist';

type WishlistState = {
    items: Product[];
};

// Đọc lại danh sách đã lưu khi tải trang; dữ liệu hỏng thì dùng danh sách rỗng
function loadWishlist(): Product[] {
    try {
        const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (!saved) {
            return [];
        }

        const items = JSON.parse(saved);
        return Array.isArray(items) ? items : [];
    } catch {
        return [];
    }
}

// Ghi lại mỗi khi state wishlist thay đổi
export function saveWishlist(items: Product[]) {
    try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch {
        // Không lưu được thì vẫn giữ danh sách trên bộ nhớ
    }
}

const initialState: WishlistState = {
    items: loadWishlist(),
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        // Thêm sản phẩm vào danh sách yêu thích
        addWishlist(state, action: PayloadAction<Product>) {
            const product = action.payload;
            const found = state.items.find((item) => item.id === product.id);

            if (found) {
                return;
            }

            state.items.push(product);
        },

        // Xóa sản phẩm theo id
        removeWishlist(state, action: PayloadAction<number>) {
            const id = action.payload;
            state.items = state.items.filter((item) => item.id !== id);
        },

        // Xóa toàn bộ danh sách
        clearWishlist(state) {
            state.items = [];
        },
    },
});

export const { addWishlist, removeWishlist, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
