import { createSlice } from '@reduxjs/toolkit';

const languageSlice = createSlice({
  name: 'language',
  initialState: 'vi',
  reducers: {
    changeLanguage(state, action) {
      if (action.payload === 'vi' || action.payload === 'en') return action.payload;
      return state;
    },
  },
});

export const { changeLanguage } = languageSlice.actions;
export default languageSlice.reducer;
