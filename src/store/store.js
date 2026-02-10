"use client"
import { configureStore } from "@reduxjs/toolkit";
import itemModalSlice from "./features/itemModalSlice";
import cartSlice from "./features/cartSlice";
export const makeStore = () => {
    return configureStore({
        reducer: {
            itemModalSlice,
            cartSlice,
        }
    });
}


