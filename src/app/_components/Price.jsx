import React from 'react';
import { useSelector } from 'react-redux';
import { useCurrency } from '../providers/SettingsProvider';

const Price = ({ amount, className = "" }) => {
    const { format, symbol } = useCurrency();
    const { offer } = useSelector((state) => state.offerSlice);

    let price = parseFloat(amount) || 0;
    let discountedPrice = price;

    if (offer && offer.type === "percentage") {
        discountedPrice = price - (price * parseFloat(offer.value)) / 100;
    }

    const hasDiscount = discountedPrice < price;

    return (
        <span className={`${className} font-semibold transition-all duration-300`}>
            {hasDiscount ? (
                <span className="flex items-center gap-2">
                    <span className="text-white">
                        {format(discountedPrice.toFixed(2))}
                    </span>
                    <del className="text-zinc-400 font-normal">
                        {symbol}{price.toFixed(2)}
                    </del>
                </span>
            ) : (
                <span className="text-zinc-200">
                    {symbol}{price.toFixed(2)}
                </span>
            )}
        </span>
    );
};

export default Price;
