"use client";
import { useSettings } from '@/app/providers/SettingsProvider';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'


const useCartCalculation = () => {

    const { items } = useSelector((state) => state.cartSlice);
    const settings = useSettings();
    const deliveryFee = Number(settings?.delivery_charge ?? 0);
    const tax = Number(settings?.tax_percentage ?? 0);
    const minOrderAmount = Number(settings?.min_order_amount ?? 0);
    const isCodEnabled = settings?.is_cod_enabled ?? false;
    const isOnlineEnabled = settings?.is_online_enabled ?? false;

    const { offer } = useSelector((state) => state.offerSlice);
    const [totalPrice, setTotalPrice] = useState(0)


    const calculatePrice = () => {
        let total = 0;
        items.forEach(item => {
            total += Number(item.selectedSize?.price ?? 0) * item.quantity;
            let addonItems = item.selectedAddons?.length > 0 ? item.selectedAddons : [];
            let addonTotal = 0;
            addonItems.forEach(addon => {
                addonTotal += Number(addon.price ?? 0) * (addon.qty * item.quantity);
            });
            total += addonTotal;
        });
        setTotalPrice(total);
    }

    useEffect(() => {
        calculatePrice();
    }, [items]);

    let discountAmount = 0;
    if (offer && offer.type === "percentage") {
        discountAmount = Math.min(((totalPrice * parseFloat(offer.value)) / 100), parseFloat(offer.maximum_discount_amount));
    }
    else if (offer && offer.type === "fixed") {
        discountAmount = Math.min(parseFloat(offer.value), parseFloat(offer.maximum_discount_amount));
    }




    const taxAmount = totalPrice * tax / 100;
    const grandTotal = totalPrice + deliveryFee + taxAmount - discountAmount;

    return {
        deliveryFee,
        tax,
        taxAmount,
        minOrderAmount,
        isCodEnabled,
        isOnlineEnabled,
        totalPrice,
        discountAmount,
        grandTotal,
    }
}

export default useCartCalculation