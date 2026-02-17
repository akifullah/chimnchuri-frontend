"use client"

import React, { useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useDispatch, useSelector } from "react-redux";
import Img from "@/app/_components/Img";
import { useForm } from "react-hook-form";
import { FaMapMarkerAlt, FaCreditCard, FaMoneyBillWave, FaShoppingBag, FaShieldAlt, FaArrowRight } from "react-icons/fa";
import { createOrder } from "@/lib/api";
import { clearCart } from "@/store/features/cartSlice";
import { useCurrency, useSettings } from "@/app/providers/SettingsProvider";
import { toast } from "react-toastify";
import useCartCalculation from "@/hooks/useCartCalculation";
import { useRouter } from "next/navigation";
import useTimeSlots from "@/hooks/useTimeSlots";


export default function CheckoutPage() {

    const { data: timeSlots, isLoading: timeSlotsLoading, error: timeSlotsError } = useTimeSlots();

    const { deliveryFee,
        tax,
        taxAmount,
        minOrderAmount,
        isCodEnabled,
        isOnlineEnabled,
        totalPrice,
        grandTotal } = useCartCalculation();

    const settings = useSettings();


    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    const dispatch = useDispatch();

    const { code, symbol, format } = useCurrency();


    const { items } = useSelector((state) => state.cartSlice);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const checkoutFormRef = useRef(null);


    const router = useRouter()

    const handlePlaceOrder = async (data) => {
        if (grandTotal < minOrderAmount) {
            toast.error(`minimum order amount is ${symbol}${minOrderAmount}`)
            return;
        }
        const formData = { ...data, payment_method: paymentMethod };
        if (paymentMethod === "cod") {
            const response = await createOrder({
                ...formData,
                items: items,
                amount: grandTotal,
            });
            if (response.success) {
                dispatch(clearCart());
                toast.success("Order placed successfully");
                router.push(`/thank-you?id=${response.orderId}`);
                return;
            }
        }

        if (paymentMethod === "online") {
            const response = await checkoutFormRef.current?.submitPayment(formData);
            if (response.success) {
                dispatch(clearCart());
                toast.success("Order placed successfully");
                router.push(`/thank-you?id=${response.orderId}`);
                return;
            }
        }
        toast.error("Something went wrong");
    };

    const InputField = ({ label, name, type = "text", placeholder, options = {} }) => (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{label}</label>
            <input
                type={type}
                {...register(name, options)}
                placeholder={placeholder}
                className="w-full px-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-zinc-400 text-sm
                    focus:outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 focus:bg-white/[0.08]
                    transition-all duration-300 hover:border-white/20"
            />
            {errors[name] && <p className="text-xs text-red-400 mt-1">{errors[name].message}</p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#141414] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand/10 blur-3xl opacity-50" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-brand/5 blur-3xl opacity-30" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Checkout</h1>
                    <p className="text-zinc-300 text-sm">Complete your order with secure delivery and payment</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* 1. Delivery Address */}
                        <section className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center">
                                    <FaMapMarkerAlt className="text-brand" size={18} />
                                </div>
                                <h2 className="text-xl font-bold">Delivery Address</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Full name" name="full_name" placeholder="John Doe" options={{ required: "Name is required" }} />
                                <InputField label="Phone Number" name="phone" placeholder="+92 300 1234567" options={{ required: "Phone is required" }} />
                                <div className="md:col-span-2">
                                    <InputField label="Street Address" name="street_address" placeholder="123 Food Street, Block A" options={{ required: "Address is required" }} />
                                </div>
                                <InputField label="City" name="city" placeholder="Lahore" options={{ required: "City is required" }} />
                                <InputField label="Postal Code" name="postal_code" placeholder="54000" />

                                <div className="md:col-span-2">
                                    <label htmlFor="time_slot_id" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Time Slot</label>
                                    <select
                                        id="time_slot_id"
                                        {...register("time_slot_id", { required: "Time slot is required" })}
                                        required
                                        className="w-full px-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-zinc-400 text-sm
                                    focus:outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 focus:bg-white/[0.08]
                                            transition-all duration-300 hover:border-white/20">
                                        <option value={""} className="text-black">Select a time slot</option>
                                        {timeSlots?.data?.map((slot) => (
                                            <option
                                                className={`text-black ${slot.disabled ? "text-gray-400" : ""}`}
                                                disabled={slot.disabled}
                                                key={slot.id} value={slot.id}>
                                                {slot.start_time} - {slot.end_time}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.time_slot_id && <p className="text-xs text-red-400 mt-1">{errors.time_slot_id.message}</p>}
                                </div>

                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Delivery Instructions (Optional)</label>
                                    <textarea
                                        {...register("delivery_instructions")}
                                        placeholder="Ring the doorbell, leave at gate, etc..."
                                        className="w-full px-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-zinc-400 text-sm
                                            focus:outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 focus:bg-white/[0.08]
                                            transition-all duration-300 hover:border-white/20 min-h-[100px] resize-none"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 2. Payment Method */}
                        <section className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center">
                                    <FaCreditCard className="text-brand" size={18} />
                                </div>
                                <h2 className="text-xl font-bold">Payment Method</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                <button
                                    onClick={() => setPaymentMethod('cod')}
                                    type="button"
                                    className={`relative group flex flex-col items-start p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer text-left
                                        ${paymentMethod === 'cod'
                                            ? 'border-brand bg-brand/10'
                                            : 'border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]'}`}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${paymentMethod === 'cod' ? 'bg-brand text-white shadow-lg shadow-brand/30' : 'bg-white/10 text-zinc-400'}`}>
                                            <FaMoneyBillWave size={18} />
                                        </div>
                                        <div className="font-bold text-sm">Cash on Delivery</div>
                                    </div>
                                    <p className="text-xs text-zinc-400 leading-relaxed">Pay with cash when your delicious food arrives at your doorstep.</p>
                                    {paymentMethod === 'cod' && (
                                        <div className="absolute top-4 right-4 text-brand">
                                            <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                            </div>
                                        </div>
                                    )}
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('online')}
                                    type="button"
                                    className={`relative group flex flex-col items-start p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer text-left
                                        ${paymentMethod === 'online'
                                            ? 'border-brand bg-brand/10'
                                            : 'border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]'}`}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${paymentMethod === 'online' ? 'bg-brand text-white shadow-lg shadow-brand/30' : 'bg-white/10 text-zinc-400'}`}>
                                            <FaCreditCard size={18} />
                                        </div>
                                        <div className="font-bold text-sm">Pay Online</div>
                                    </div>
                                    <p className="text-xs text-zinc-400 leading-relaxed">Fast and secure payment using your credit or debit card.</p>
                                    {paymentMethod === 'online' && (
                                        <div className="absolute top-4 right-4 text-brand">
                                            <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                            </div>
                                        </div>
                                    )}
                                </button>
                            </div>

                            {paymentMethod === "online" && (
                                <div className="mb-10 pt-4 border-t border-white/5">
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
                                className="group w-full flex items-center justify-center gap-3 py-4.5 bg-brand hover:bg-green-700 active:bg-green-800 text-white font-bold rounded-2xl transition-all duration-300  cursor-pointer"
                            >
                                Place Order
                                <FaArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </section>
                    </div>

                    {/* Right Column: Order Summary */}
                    <aside className="lg:col-span-4 lg:sticky lg:top-8">
                        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
                            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                                <FaShoppingBag className="text-brand/60" size={18} />
                                Order Summary
                            </h2>

                            <div className="space-y-6 mb-8 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 group">
                                        <div className="w-16 h-16 rounded-xl bg-zinc-800 border border-white/5 overflow-hidden relative shrink-0">
                                            {item.image ? (
                                                <Img src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-500">
                                                    <FaShoppingBag size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <h3 className="font-bold text-white text-sm line-clamp-1 mb-0.5">{item.name}</h3>
                                                    <p className="text-[12px] text-zinc-200 font-medium">{item.selectedSize.name}</p>
                                                </div>
                                                <p className="text-sm font-bold text-zinc-200">{symbol} {item.itemTotal.toFixed(2)}</p>
                                            </div>

                                            {item.selectedAddons && item.selectedAddons.length > 0 && (
                                                <div className="mt-2 text-[10px] space-y-0.5">
                                                    {item.selectedAddons.map((addon, aIdx) => (
                                                        <div key={aIdx} className="flex justify-between text-zinc-400 italic">
                                                            <span>+ {addon.name}</span>
                                                            <span className="text-zinc-500 ml-2">{symbol} {parseFloat(addon.price) || 0}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="mt-2 text-[11px] font-bold text-zinc-300">Qty: {item.quantity}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/5 pt-6 space-y-4">
                                <div className="flex justify-between text-sm text-zinc-300">
                                    <span>Subtotal</span>
                                    <span className="text-zinc-200">{symbol} {totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-zinc-300">
                                    <span>Delivery Fee</span>
                                    <span className="text-zinc-200">{symbol} {deliveryFee.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-sm text-zinc-300">
                                    <span>Tax ({tax}%)</span>
                                    <span className="text-zinc-200">{symbol} {taxAmount.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                    <span className="text-base font-bold text-white">Total</span>
                                    <span className="text-2xl font-black text-white tracking-tight">{symbol} {grandTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] text-zinc-400 justify-center uppercase tracking-widest font-bold">
                                <FaShieldAlt className="text-brand/50" />
                                <span>Encrypted & Secure</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div >
        </div >
    );
}
