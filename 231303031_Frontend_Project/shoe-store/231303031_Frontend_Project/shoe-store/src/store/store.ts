import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slice/ProductListSlice';
import compareReducer from './slice/CompareSlice';

import languageReducer from './slice/LanguageSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    compare: compareReducer,
    language: languageReducer,
  },
});
