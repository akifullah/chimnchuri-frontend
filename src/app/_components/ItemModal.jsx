"use client"
import { closeItemModal } from '@/store/features/itemModalSlice'
import React, { useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import Img from './Img'
import { addToCart } from '@/store/features/cartSlice'

const ItemModal = () => {
    const dispatch = useDispatch();
    const { isModalOpen, itemData, isInCart } = useSelector((state) => state.itemModalSlice);
    const data = itemData;
    console.log(data);

    let addon_groups = data?.addon_groups;

    const [selectedSize, setSelectedSize] = useState(data?.sizes[0] ?? {});
    const [selectedAddons, setSelectedAddons] = useState({})
    const [quantity, setQuantity] = useState(1)
    const [validationError, setValidationError] = useState("")

    useEffect(() => {
        if (data?.sizes && data.sizes.length > 0) {
            setSelectedSize(data.sizes[0]);
        }
    }, [data]);

    useEffect(() => {
        if (data?.sizes && data.sizes.length > 0) {
            setSelectedSize(data.sizes[0]);
        }
        setSelectedAddons({});
        setQuantity(1);
        setValidationError("");
    }, [data, isModalOpen]);

    const handleAddonChange = (group, addonId) => {
        setValidationError("");
        setSelectedAddons(prev => {
            const currentSelection = prev[group.id] || [];
            let newSelection = [...currentSelection];

            if (group.selection_type === 'single') {
                // If single selection, replace the current selection
                // If clicking the same one, maybe toggle off? Or enforced? 
                // Usually radio buttons don't toggle off. Let's assume radio behavior.
                newSelection = [addonId];
            } else {
                // Multiple selection
                if (currentSelection.includes(addonId)) {
                    // Remove
                    newSelection = currentSelection.filter(id => id !== addonId);
                } else {
                    // Add
                    // Check max_qty constraint
                    if (group.max_qty && currentSelection.length >= group.max_qty) {
                        // Maybe show temporary error or just return
                        alert(`You can only select up to ${group.max_qty} items`);
                        return prev;
                    }
                    newSelection = [...currentSelection, addonId];
                }
            }

            return {
                ...prev,
                [group.id]: newSelection
            };
        });
    }

    // Calculate total price
    const calculateTotalPrice = () => {
        let total = parseFloat(selectedSize.price) || 0;

        Object.entries(selectedAddons).forEach(([groupId, addonIds]) => {
            const group = addon_groups?.find(g => g.id === parseInt(groupId));
            if (group) {
                addonIds.forEach(addonId => {
                    const addon = group.items.find(a => a.id === addonId);
                    if (addon) {
                        let price = parseFloat(addon.price);
                        if (!price || price === 0) price = parseFloat(addon.addon_item?.price) || 0;
                        total += price;
                    }
                });
            }
        });

        return (total * quantity).toFixed(2);
    }

    // Validate required addons
    const validateAddons = () => {
        for (let group of addon_groups) {
            const selectedCount = (selectedAddons[group.id] || []).length;

            if (group.is_required && selectedCount < group.min_qty) {
                // For single selection required, min_qty is usually 1
                if (group.selection_type === 'single') {
                    setValidationError(`Please select a ${group.addon_category?.name || 'option'}`);
                } else {
                    setValidationError(`Please select at least ${group.min_qty} ${group.addon_category?.name || 'options'}`);
                }
                return false;
            }

            // For multiple selection, we might strictly enforce min_qty if they selected some but not enough
            if (group.selection_type === 'multiple' && selectedCount > 0 && selectedCount < group.min_qty) {
                setValidationError(`Please select at least ${group.min_qty} ${group.addon_category?.name || 'options'}`);
                return false;
            }
        }
        return true;
    }

    const handleAddToCart = () => {
        setValidationError("");
        if (!validateAddons()) {
            return;
        }

        dispatch(addToCart({
            item: data,
            selectedSize,
            selectedAddons,
            quantity,
            addonGroups: addon_groups
        }));

        // Reset and close modal
        setQuantity(1);
        setSelectedAddons({});
        setValidationError("");
        dispatch(closeItemModal());
    }

    return (
        <div className={`fixed inset-0 z-[100] bg-white/20 backdrop-blur-xs flex items-center justify-center transition duration-500 ${isModalOpen ? "opacity-100 pointer-events-auto " : "opacity-0 pointer-events-none"}`}>
            <div className={`w-4xl max-w-[95vw] shadow-xl rounded-2xl bg-white text-zinc-800 transition duration-500 flex flex-col max-h-[90vh] ${isModalOpen ? "scale-100" : "scale-50"}`}>
                <div className="border-b border-zinc-200 px-4 py-3 flex items-center justify-between shrink-0">
                    <h2 className='text-xl font-semibold truncate pr-4'>{data?.name}</h2>

                    <button
                        onClick={() => dispatch(closeItemModal())}
                        className='size-10 rounded-full text-black/70 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition duration-300 '>
                        <FaTimes size={20} />
                    </button>

                </div>

                <div className="overflow-y-auto p-0 sm:p-4 flex-1">
                    <div className="sm:flex items-start gap-6">
                        {/* IMAGE */}
                        <div className="rounded-xl overflow-hidden aspect-video sm:aspect-square sm:w-2/5 shrink-0 bg-gray-100 mb-4 sm:mb-0 relative">
                            {data?.media?.[0]?.original_url ? (
                                <Img
                                    src={data.media[0].original_url}
                                    className='w-full h-full object-cover'
                                    alt={data.name}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                            )}
                        </div>

                        {/* DETAILS */}
                        <div className="flex-1 space-y-6 px-4 sm:px-0 pb-20 sm:pb-0">
                            <p className='text-sm text-gray-600 leading-relaxed'>{data?.description}</p>

                            {/* SIZES */}
                            {data?.sizes?.length > 0 && (
                                <div>
                                    <h3 className='font-semibold text-lg mb-3'>Select Size</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {data.sizes.map((size) => (
                                            <label key={size.id} className={`border-2 px-4 py-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${selectedSize.id === size.id ? 'border-brand bg-brand/5 text-brand' : 'border-gray-200 hover:border-gray-300'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedSize.id === size.id ? 'border-brand' : 'border-gray-300'}`}>
                                                        {selectedSize.id === size.id && <div className="w-2.5 h-2.5 rounded-full bg-brand" />}
                                                    </div>
                                                    <span className="font-medium">{size.name}</span>
                                                </div>
                                                <span className="font-semibold">${size.price}</span>
                                                <input
                                                    type="radio"
                                                    name="size"
                                                    value={size.id}
                                                    hidden
                                                    checked={selectedSize.id === size.id}
                                                    onChange={() => setSelectedSize(size)}
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ADD-ONS */}
                            {addon_groups?.length > 0 && (
                                <div className="space-y-6">
                                    <h3 className='font-semibold text-lg'>Add-ons</h3>
                                    {addon_groups.map((group) => (
                                        <div key={group.id} className="bg-gray-50 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <h4 className='font-medium text-gray-900'>
                                                        {group.addon_category?.name}
                                                        {group.is_required ? <span className='text-red-500 ml-1'>*</span> : <span className="text-gray-400 text-xs font-normal ml-2">(Optional)</span>}
                                                    </h4>
                                                    <p className='text-xs text-gray-500'>
                                                        {group.selection_type === 'single' ? 'Select 1' : `Select up to ${group.max_qty}`}
                                                    </p>
                                                </div>
                                                {group.selection_type === 'multiple' && (
                                                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-md text-gray-600">
                                                        {(selectedAddons[group.id] || []).length} / {group.max_qty}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {group.items?.map((addon) => {
                                                    const isSelected = (selectedAddons[group.id] || []).includes(addon.id);
                                                    const isDisabled = !isSelected && group.selection_type === 'multiple' && (selectedAddons[group.id] || []).length >= group.max_qty;

                                                    return (
                                                        <label
                                                            key={addon.id}
                                                            className={`
                                                                flex items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer
                                                                ${isSelected ? 'border-brand bg-white shadow-sm ring-1 ring-brand' : 'border-transparent hover:bg-white hover:shadow-sm'}
                                                                ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}
                                                            `}
                                                        >
                                                            <div className={`
                                                                w-5 h-5 rounded border flex items-center justify-center shrink-0
                                                                ${group.selection_type === 'single' ? 'rounded-full' : 'rounded-md'}
                                                                ${isSelected ? 'bg-brand border-brand text-white' : 'border-gray-300 bg-white'}
                                                            `}>
                                                                {isSelected && (group.selection_type === 'single' ? <div className="w-2 h-2 rounded-full bg-white" /> : <FaTimes className="rotate-45" size={12} />)}
                                                            </div>

                                                            {addon.addon_item?.image && (
                                                                <Img src={addon.addon_item.image} alt="" className="w-8 h-8 rounded object-cover bg-gray-200" />
                                                            )}

                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium truncate">{addon.addon_item?.name}</p>
                                                            </div>
                                                            <span className="text-sm text-gray-600 whitespace-nowrap">+ ${(() => {
                                                                let price = parseFloat(addon.price);
                                                                if (!price || price === 0) price = parseFloat(addon.addon_item?.price) || 0;
                                                                return price;
                                                            })()}</span>

                                                            <input
                                                                type={group.selection_type === 'single' ? 'radio' : 'checkbox'}
                                                                name={`group-${group.id}`}
                                                                checked={isSelected}
                                                                onChange={() => !isDisabled && handleAddonChange(group, addon.id)}
                                                                disabled={isDisabled}
                                                                hidden
                                                            />
                                                        </label>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border-t border-zinc-200 p-4 bg-white rounded-b-2xl shrink-0">
                    {validationError && (
                        <div className="mb-3 text-red-500 text-sm font-medium text-center bg-red-50 py-2 rounded-lg">
                            {validationError}
                        </div>
                    )}
                    <div className="flex gap-4 items-center max-w-lg mx-auto">
                        <div className="flex items-center border border-gray-300 rounded-full h-12">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-12 h-full flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-l-full transition"
                            >
                                −
                            </button>
                            <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-12 h-full flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-r-full transition"
                            >
                                +
                            </button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 h-12 rounded-full bg-brand text-white font-semibold hover:bg-brand/90 transition flex items-center justify-center gap-2 shadow-lg shadow-brand/20">
                            <span>Add to Order</span>
                            <span className="bg-white/20 px-2 py-0.5 rounded text-sm">${calculateTotalPrice()}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemModal
