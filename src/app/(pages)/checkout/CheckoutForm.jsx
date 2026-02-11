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

const CheckoutForm = forwardRef(({ amount }, ref) => {
    const stripe = useStripe();
    const elements = useElements();
    const { items, totalPrice } = useSelector((state) => state.cartSlice);



    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");

    const createPaymentIntent = async (formData) => {
        const response = await fetch("http://127.0.0.1:8000/api/process-checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...formData,
                items: items,
                amount: amount,
            }),
        });

        const data = await response.json();
        return data.clientSecret;
    };

    const submitPayment = async (data) => {
        console.log(data);
        if (!stripe || !elements) return false;

        setLoading(true);
        setMessage("");

        try {
            const clientSecret = await createPaymentIntent(data);

            const result = await stripe.confirmCardPayment(clientSecret, {
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
            return true;

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
                color: "#1f2937",
                "::placeholder": {
                    color: "#96999fff",
                },
            },

            invalid: {
                color: "#dc2626",
            },
        },
    };

    return (
        <div className="space-y-4">

            <input
                type="text"
                placeholder="Card Holder Name"
                className="w-full py-4 h-13 border outline-none border-zinc-200 text-zinc-900 placeholder:text-black/50 bg-white p-3 rounded-xl"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />

            <div className="border py-4 border-gray-300 bg-white p-3 rounded-xl">
                <CardNumberElement options={inputStyle} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="border py-4 border-gray-300 bg-white p-3 rounded-xl">
                    <CardExpiryElement options={inputStyle} />
                </div>

                <div className="border py-4 border-gray-300 bg-white p-3 rounded-xl">
                    <CardCvcElement options={inputStyle} />
                </div>
            </div>

            {loading && (
                <div className="text-sm text-gray-500">
                    Processing payment...
                </div>
            )}

            {message && (
                <div className="text-red-600 text-sm">
                    {message}
                </div>
            )}

        </div>
    );
});

export default CheckoutForm;
