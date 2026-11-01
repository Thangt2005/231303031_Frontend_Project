import { createSlice } from '@reduxjs/toolkit';

const compareSlice = createSlice({
  name: 'compare',
  initialState: [],
  reducers: {
    addProduct(products, action) {
      const product = action.payload;
      // Chỉ thêm tối đa 3 sản phẩm, không thêm trùng mã.
      if (!product || product.id == null) return;
      if (
        products.length >= 3 ||
        products.some((item) => item.id === product.id)
      )
        return;
      products.push(product);
    },
    removeProduct(products, action) {
      return products.filter((product) => product.id !== action.payload);
    },
  },
});

export const { addProduct, removeProduct } = compareSlice.actions;
export default compareSlice.reducer;
