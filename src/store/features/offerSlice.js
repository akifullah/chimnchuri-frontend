import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    offer: null,
}

const offerSlice = createSlice({
    name: "offer",
    initialState,
    reducers: {
        setOffer: (state, action) => {
            state.offer = action.payload;
        },
        clearOffer: (state) => {
            state.offer = null;
        }
    }
})

export const { setOffer, clearOffer } = offerSlice.actions;
export default offerSlice.reducer;