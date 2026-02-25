"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePathname } from "next/navigation";
import { toggleCart } from "@/store/features/cartSlice";
import { FaShoppingBag, FaArrowRight } from "react-icons/fa";
import { useSettings, useCurrency } from "../providers/SettingsProvider";

const CartReminder = () => {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const { totalItems, totalPrice, isCartOpen } = useSelector((state) => state.cartSlice);
    const { symbol } = useCurrency();
    const [show, setShow] = useState(false);
    const [prevItems, setPrevItems] = useState(0);
    const [pulse, setPulse] = useState(false);

    useEffect(() => {
        if (totalItems > 0 && !isCartOpen) {
            setShow(true);
        } else {
            setShow(false);
        }

        // Trigger pulse animation when items increase
        if (totalItems > prevItems && totalItems > 0) {
            setPulse(true);
            const timeout = setTimeout(() => setPulse(false), 600);
            return () => clearTimeout(timeout);
        }
        setPrevItems(totalItems);
    }, [totalItems, isCartOpen]);

    const isHiddenPage = pathname === '/checkout';

    if (!show || isHiddenPage) return null;

    return (
        <div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] w-[calc(100%-2rem)] max-w-md"
            style={{
                animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
        >
            <button
                onClick={() => dispatch(toggleCart(true))}
                className={`w-full flex items-center shadow shadow-zinc-800/30 justify-between gap-4 hover:bg-brand bg-green-800 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-brand/40 transition-all duration-300 cursor-pointer group ${pulse ? "scale-[1.03]" : "scale-100"}`}
            >
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <FaShoppingBag size={18} />
                        <span className="absolute -top-2.5 -right-2.5 size-5 text-[10px] font-black rounded-full bg-white text-brand flex items-center justify-center shadow-md">
                            {totalItems}
                        </span>
                    </div>
                    <span className="font-bold text-sm">View Your Basket</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{symbol} {totalPrice.toFixed(2)}</span>
                    <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
            </button>

            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translate(-50%, 100%);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                }
            `}</style>
        </div>
    );
};

export default CartReminder;
