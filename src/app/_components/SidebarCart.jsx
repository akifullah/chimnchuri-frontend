"use client"
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaTimes, FaTrash, FaMinus, FaPlus, FaShoppingBag } from 'react-icons/fa'
import { toggleCart, removeFromCart, updateQuantity, incrementQuantity, decrementQuantity } from '@/store/features/cartSlice'
import Link from 'next/link'
// import Image from 'next/image'
import Img from './Img'

const SidebarCart = () => {
    const dispatch = useDispatch()
    const { items, totalItems, totalPrice, isCartOpen } = useSelector((state) => state.cartSlice)
    const sidebarRef = useRef(null)

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isCartOpen) {
                dispatch(toggleCart(false))
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isCartOpen, dispatch])

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isCartOpen])

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                aria-hidden="true"
            />

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center gap-3">
                            <FaShoppingBag className="text-brand text-xl" />
                            <h2 className="text-xl font-bold text-gray-800">Your Order</h2>
                            <span className="bg-brand text-white text-xs font-bold px-2 py-1 rounded-full">{totalItems}</span>
                        </div>
                        <button
                            onClick={() => dispatch(toggleCart(false))}
                            className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500"
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                    <FaShoppingBag size={40} />
                                </div>
                                <div>
                                    <p className="text-xl font-semibold text-gray-800">Your cart is empty</p>
                                    <p className="text-gray-500 mt-1">Looks like you haven't added anything yet.</p>
                                </div>
                                <button
                                    onClick={() => dispatch(toggleCart(false))}
                                    className="px-6 py-3 bg-brand text-white rounded-full font-semibold hover:bg-brand/90 transition shadow-lg shadow-brand/20"
                                >
                                    Start Ordering
                                </button>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-3 border rounded-xl hover:border-brand/30 transition bg-white shadow-sm">
                                    {/* Item Image */}
                                    <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
                                        {item.image ? (
                                            <Img
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                                                <FaShoppingBag />
                                            </div>
                                        )}
                                    </div>

                                    {/* Item Details */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                                                <button
                                                    onClick={() => dispatch(removeFromCart(item.id))}
                                                    className="text-gray-400 hover:text-red-500 transition p-1"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>

                                            <p className="text-sm text-gray-600 mt-0.5">Size: {item.selectedSize.name}</p>

                                            {item.selectedAddons && item.selectedAddons.length > 0 && (
                                                <div className="mt-2 space-y-1">
                                                    {Object.entries(item.selectedAddons.reduce((acc, addon) => {
                                                        if (!acc[addon.category]) acc[addon.category] = [];
                                                        acc[addon.category].push(addon);
                                                        return acc;
                                                    }, {})).map(([category, addons]) => (
                                                        <div key={category} className="text-xs">
                                                            <span className="font-semibold text-gray-700">{category}:</span>
                                                            <div className="flex flex-col ml-2 mt-0.5">
                                                                {addons.map((addon, idx) => (
                                                                    <span key={`${addon.id}-${idx}`} className="text-gray-500">
                                                                        + {addon.name} <span className="text-gray-400">(${parseFloat(addon.price) || parseFloat(addon.addon_item?.price) || 0})</span>
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center border rounded-full bg-gray-50">
                                                <button
                                                    onClick={() => dispatch(decrementQuantity(item.id))}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full transition"
                                                >
                                                    <FaMinus size={10} />
                                                </button>
                                                <span className="w-8 text-center text-sm font-semibold text-gray-600">{item.quantity}</span>
                                                <button
                                                    onClick={() => dispatch(incrementQuantity(item.id))}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full transition"
                                                >
                                                    <FaPlus size={10} />
                                                </button>
                                            </div>
                                            <span className="font-bold text-brand">${item.itemTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="border-t p-4 space-y-4 bg-gray-50">
                            <div className="space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-xl text-gray-800">
                                    <span>Total</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                onClick={() => dispatch(toggleCart(false))}
                                className="block w-full py-4 bg-green-600 text-white text-center font-bold rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-600/20"
                            >
                                Checkout
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default SidebarCart
