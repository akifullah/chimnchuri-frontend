"use client";

import { useEffect, useRef } from "react";
import { makeStore } from "./store";
import { Provider } from "react-redux";
import { initializeCart } from "./features/cartSlice";
import { setProfile } from "./features/authSlice";

export default function ReduxProvider({ children }) {
    const storeRef = useRef();

    if (!storeRef.current) {
        storeRef.current = makeStore();
    }

    useEffect(() => {
        let cartItems = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : null;
        let auth = localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")) : null;
        if (storeRef.current && cartItems) {
            storeRef.current.dispatch(initializeCart(cartItems))
        }
        if (storeRef.current && auth) {
            storeRef.current.dispatch(setProfile(auth))
        }

    }, []);


    return (
        <Provider store={storeRef.current}>
            {children}
        </Provider>
    )
};