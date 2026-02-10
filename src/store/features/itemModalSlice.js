import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isModalOpen: false,
    itemData: null,
    isInCart: false
}


const itemModalSlice = createSlice({
    name: "itemModal",
    initialState,

    reducers: {
        openItemModal: (state, action) => {
            state.isModalOpen = true;
            state.itemData = action.payload;
            state.isInCart = action.payload?.inCart
        },

        closeItemModal: (state, action) => {
            state.isModalOpen = false;
            state.itemData = null;
            state.isInCart = false
        }
    }

});

export const { openItemModal, closeItemModal } = itemModalSlice.actions;

export default itemModalSlice.reducer;