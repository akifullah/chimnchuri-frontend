"use client";

import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement
} from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { createOrder } from "@/lib/api";

const CheckoutForm = forwardRef(({ amount }, ref) => {
    const stripe = useStripe();
    const elements = useElements();
    const { items, totalPrice } = useSelector((state) => state.cartSlice);

    const deliveryFee = 150;
    const grandTotal = totalPrice + deliveryFee;


    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");

    const createPaymentIntent = async (formData) => {
        const response = await createOrder({
            ...formData,
            items: items,
            amount: totalPrice,
        });
        const data = response;
        return data;
    };

    const submitPayment = async (data) => {
        if (!stripe || !elements) return false;

        setLoading(true);
        setMessage("");

        try {
            const response = await createPaymentIntent(data);

            const result = await stripe.confirmCardPayment(response.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: name,
                    },
                },
            });

            if (result.error) {
                setMessage(result.error.message);
                setLoading(false);
                return false;
            }

            setLoading(false);
            return response;

        } catch (error) {
            setMessage("Payment failed. Please try again.");
            setLoading(false);
            return false;
        }
    };

    useImperativeHandle(ref, () => ({
        submitPayment,
    }));

    const inputStyle = {
        style: {
            base: {
                fontSize: "16px",
                color: "#ffffff",
                "::placeholder": {
                    color: "#71717a",
                },
            },
            invalid: {
                color: "#f87171",
            },
        },
    };

    return (
        <div className="space-y-4">
            <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Card Holder Name</label>
                <input
                    type="text"
                    placeholder="Enter name on card"
                    className="w-full pl-4 pr-12 py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-zinc-500 text-sm
                        focus:outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 focus:bg-white/[0.08]
                        transition-all duration-300 hover:border-white/20"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Card Number</label>
                <div className="w-full px-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white focus-within:border-brand/60 focus-within:ring-2 focus-within:ring-brand/20 transition-all duration-300">
                    <CardNumberElement options={inputStyle} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Expiry Date</label>
                    <div className="w-full px-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white focus-within:border-brand/60 focus-within:ring-2 focus-within:ring-brand/20 transition-all duration-300">
                        <CardExpiryElement options={inputStyle} />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">CVC</label>
                    <div className="w-full px-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white focus-within:border-brand/60 focus-within:ring-2 focus-within:ring-brand/20 transition-all duration-300">
                        <CardCvcElement options={inputStyle} />
                    </div>
                </div>
            </div>

            {loading && (
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <div className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
                    Processing payment...
                </div>
            )}

            {message && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                    {message}
                </div>
            )}
        </div>
    );
});

CheckoutForm.displayName = "CheckoutForm";

export default CheckoutForm;
