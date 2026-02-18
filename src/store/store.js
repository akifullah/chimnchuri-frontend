"use client"
import { configureStore } from "@reduxjs/toolkit";
import itemModalSlice from "./features/itemModalSlice";
import cartSlice from "./features/cartSlice";
import authSlice from "./features/authSlice";
import offerSlice from "./features/offerSlice";
export const makeStore = () => {
    return configureStore({
        reducer: {
            itemModalSlice,
            cartSlice,
            authSlice,
            offerSlice,
        }
    });
}


