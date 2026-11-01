import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
    initialState:[],
    name:"products",
    reducers : {
        load:(state,action)=>{
            return action.payload;
        }
    }
})
export const {load} = productSlice.actions;
export default productSlice.reducer;