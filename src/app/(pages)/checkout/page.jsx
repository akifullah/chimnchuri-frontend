"use client"

import React, { useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useSelector } from "react-redux";
import Img from "@/app/_components/Img";
import { useForm } from "react-hook-form";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
    const { items, totalPrice } = useSelector((state) => state.cartSlice);

    const { register, handleSubmit, formState: { errors } } = useForm();



    const [paymentMethod, setPaymentMethod] = useState("cod");

    const checkoutFormRef = useRef(null);

    const deliveryFee = 150;
    const grandTotal = totalPrice + deliveryFee;

    const handlePlaceOrder = async (data) => {
        const formData = { ...data, payment_method: paymentMethod };
        if (paymentMethod === "cod") {
            console.log("Placing COD Order...");
            const response = await fetch("http://127.0.0.1:8000/api/process-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    items: items,
                    amount: totalPrice,
                }),
            });

            const data = await response.json();

            if (data.success) {
                window.location.href = "/thank-you";
            }

            // Here call your normal order API for COD
            return;
        }

        if (paymentMethod === "online") {
            const success = await checkoutFormRef.current?.submitPayment(formData);

            if (success) {
                window.location.href = "/thank-you";
            }
        }



    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="container mx-auto">
                <h1 className="text-3xl font-heading font-bold text-foreground mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-8">

                        {/* 1. Delivery Address */}
                        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                {/* <span className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm font-bold">1</span> */}
                                <h2 className="text-xl font-heading font-semibold text-foreground">Delivery Address</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-foreground">Full name</label>
                                    <input type="text" {...register("full_name")} placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-muted-foreground/50" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-foreground">Phone</label>
                                    <input type="text" {...register("phone")} placeholder="+94 77 123 4567" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-muted-foreground/50" />
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-sm font-medium text-foreground">Street address</label>
                                    <input type="text" {...register("street_address")} placeholder="123 Main Street" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-muted-foreground/50" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-foreground">City</label>
                                    <input type="text" {...register("city")} placeholder="Colombo" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-muted-foreground/50" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-foreground">Postal Code</label>
                                    <input type="text" {...register("postal_code")} placeholder="00100" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-muted-foreground/50" />
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-sm font-medium text-foreground">Delivery Instructions (Optional)</label>
                                    <textarea
                                        {...register("delivery_instructions")}
                                        placeholder="Ring the doorbell, leave at gate, etc..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-muted-foreground/50 min-h-[100px] resize-y"
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="bg-white p-6 rounded-xl shadow">

                            <div className="flex items-center gap-3 mb-6">
                                {/* <span className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm font-bold">2</span> */}
                                <h2 className="text-xl font-heading font-semibold text-foreground">Payment Method</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                                <button
                                    onClick={() => setPaymentMethod('cod')}
                                    className={`relative p-2 rounded-xl cursor-pointer border-2 text-left transition-all duration-200 ${paymentMethod === 'cod' ? 'border-brand bg-brand/5' : 'border-gray-200 hover:border-brand/30'}`}
                                >
                                    <div className="flex items-center gap-3 mb-0">
                                        <div className={`size-8 rounded-full flex items-center justify-center ${paymentMethod === 'cod' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="12" x="2" y="6" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>
                                        </div>
                                        <span className={`font-semibold text-sm ${paymentMethod === 'cod' ? 'text-brand' : 'text-gray-700'}`}>Cash on Delivery</span>
                                    </div>
                                    <p className="text-xs -mt-2 text-gray-500 pl-[42px]">Pay when your order arrives at your doorstep.</p>
                                    {paymentMethod === 'cod' && <div className="absolute top-4 right-4 text-brand"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></div>}
                                </button>

                                <button

                                    onClick={() => setPaymentMethod('online')}
                                    className={`relative p-2 rounded-xl cursor-pointer border-2 text-left transition-all duration-200 ${paymentMethod === 'online' ? 'border-brand bg-brand/5' : 'border-gray-200 hover:border-brand/30'}`}
                                >
                                    <div className="flex items-center gap-3 mb-0">
                                        <div className={`size-8 rounded-full flex items-center justify-center ${paymentMethod === 'online' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                                        </div>
                                        <span className={`font-semibold text-sm ${paymentMethod === 'online' ? 'text-brand' : 'text-gray-700'}`}>Pay Online</span>
                                    </div>
                                    <p className="text-xs -mt-2 text-gray-500 pl-[42px]">Secure payment via Credit/Debit Card.</p>
                                    {paymentMethod === 'online' && <div className="absolute top-4 right-4 text-brand"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></div>}
                                </button>

                                {/* <button
                                onClick={() => setPaymentMethod("cod")}
                                className={`p-3 border rounded ${paymentMethod === "cod"
                                    ? "border-green-600 bg-green-50"
                                    : "border-gray-300"
                                    }`}
                            >
                                Cash on Delivery
                            </button>

                            <button
                                onClick={() => setPaymentMethod("online")}
                                className={`p-3 border rounded ${paymentMethod === "online"
                                    ? "border-green-600 bg-green-50"
                                    : "border-gray-300"
                                    }`}
                            >
                                Pay Online
                            </button> */}
                            </div>

                            {paymentMethod === "online" && (
                                <div className="mb-6">
                                    <Elements stripe={stripePromise}>
                                        <CheckoutForm
                                            ref={checkoutFormRef}
                                            amount={grandTotal}
                                        />
                                    </Elements>
                                </div>
                            )}

                            <button
                                onClick={handleSubmit(handlePlaceOrder)}
                                className="w-full cursor-pointer py-4 bg-green-700 text-white font-bold rounded-xl"
                            >
                                Place Order
                            </button>

                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-8">
                            <h2 className="text-xl font-heading font-semibold text-foreground mb-6">Order Summary</h2>

                            <div className="space-y-6 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden relative shrink-0">
                                            {item.image ? (
                                                <Img src={item.image} alt={item.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <FaShoppingBag size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-foreground text-sm line-clamp-2">{item.name}</h3>
                                                    <p className="text-xs text-muted-foreground">{item.selectedSize.name}</p>
                                                </div>
                                                <p className="text-sm font-semibold text-foreground">Rs {item.itemTotal.toFixed(2)}</p>
                                            </div>

                                            {/* Addons Display */}
                                            {item.selectedAddons && item.selectedAddons.length > 0 && (
                                                <div className="mt-2 text-xs text-gray-500 space-y-0.5">
                                                    {item.selectedAddons.map((addon, idx) => (
                                                        <div key={`${addon.id}-${idx}`} className="flex justify-between">
                                                            <span>+ {addon.name}</span>
                                                            <span>Rs {addon.price}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="mt-2 text-xs text-brand font-medium">Qty: {item.quantity}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-3">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>Rs {totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span>Rs {deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t border-gray-100 mt-2">
                                    <span>Total</span>
                                    <span>Rs {grandTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center gap-2 text-xs text-gray-400 justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                <span>Secure Checkout</span>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
