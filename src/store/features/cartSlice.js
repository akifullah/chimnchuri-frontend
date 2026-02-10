"use client"

import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    items: [], // Array of cart items
    totalItems: 0,
    totalPrice: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { item, selectedSize, selectedAddons, quantity, addonGroups } = action.payload;

            // Calculate addon price
            let addonPrice = 0;
            if (selectedAddons && addonGroups) {
                Object.entries(selectedAddons).forEach(([groupId, addonIds]) => {
                    const group = addonGroups.find(g => g.id === parseInt(groupId));
                    if (group) {
                        addonIds.forEach(addonId => {
                            const addon = group.items.find(a => a.id === addonId);
                            if (addon) {
                                addonPrice += addon.price;
                            }
                        });
                    }
                });
            }

            // Calculate total price for this item
            const itemTotal = (parseFloat(selectedSize.price) + addonPrice) * quantity;

            // Create cart item object
            const cartItem = {
                id: `${item.id}-${selectedSize.id}-${Date.now()}`, // Unique ID for cart item
                productId: item.id,
                name: item.name,
                description: item.description,
                image: item.media?.[0]?.original_url || '',
                selectedSize: {
                    id: selectedSize.id,
                    name: selectedSize.name,
                    price: selectedSize.price,
                },
                selectedAddons: selectedAddons || {},
                addonDetails: [], // Store full addon details for display
                quantity,
                itemTotal,
            };

            // Populate addon details for display
            if (selectedAddons && addonGroups) {
                Object.entries(selectedAddons).forEach(([groupId, addonIds]) => {
                    const group = addonGroups.find(g => g.id === parseInt(groupId));
                    if (group) {
                        addonIds.forEach(addonId => {
                            const addon = group.items.find(a => a.id === addonId);
                            if (addon) {
                                cartItem.addonDetails.push({
                                    id: addon.id,
                                    name: addon.addon_item.name,
                                    price: addon.price,
                                    category: group.addon_category_id,
                                });
                            }
                        });
                    }
                });
            }

            // Add to cart
            state.items.push(cartItem);
            state.totalItems += quantity;
            state.totalPrice += itemTotal;

            localStorage.setItem("cartItems", JSON.stringify({
                items: state.items,
                totalItems: state.totalItems,
                totalPrice: state.totalPrice
            }));
        },

        removeFromCart: (state, action) => {
            const itemId = action.payload;
            const item = state.items.find(item => item.id === itemId);

            if (item) {
                state.totalItems -= item.quantity;
                state.totalPrice -= item.itemTotal;
                state.items = state.items.filter(item => item.id !== itemId);
            }
        },

        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find(item => item.id === id);

            if (item && quantity > 0) {
                const oldTotal = item.itemTotal;
                const pricePerItem = oldTotal / item.quantity;
                const newTotal = pricePerItem * quantity;

                state.totalItems = state.totalItems - item.quantity + quantity;
                state.totalPrice = state.totalPrice - oldTotal + newTotal;

                item.quantity = quantity;
                item.itemTotal = newTotal;
            }
        },

        clearCart: (state) => {
            state.items = [];
            state.totalItems = 0;
            state.totalPrice = 0;
        },

        incrementQuantity: (state, action) => {
            const itemId = action.payload;
            const item = state.items.find(item => item.id === itemId);

            if (item) {
                const pricePerItem = item.itemTotal / item.quantity;
                item.quantity += 1;
                item.itemTotal += pricePerItem;
                state.totalItems += 1;
                state.totalPrice += pricePerItem;
            }
        },

        decrementQuantity: (state, action) => {
            const itemId = action.payload;
            const item = state.items.find(item => item.id === itemId);

            if (item && item.quantity > 1) {
                const pricePerItem = item.itemTotal / item.quantity;
                item.quantity -= 1;
                item.itemTotal -= pricePerItem;
                state.totalItems -= 1;
                state.totalPrice -= pricePerItem;
            }
        },
        initializeCart: (state, action) => {
            console.log(action.payload);
            state.items = action.payload.items;
            state.totalItems = action.payload.totalItems;
            state.totalPrice = action.payload.totalPrice;

            // localStorage.setItem("cartItems", JSON.stringify({
            //     items: state.items,
            //     totalItems: state.totalItems,
            //     totalPrice: state.totalPrice
            // }));

        }

    },
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    incrementQuantity,
    decrementQuantity,
    initializeCart,
} = cartSlice.actions;

export default cartSlice.reducer;