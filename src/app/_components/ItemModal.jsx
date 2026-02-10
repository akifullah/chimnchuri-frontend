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


    const [selectedSize, setSelectedSize] = useState(data?.sizes[0] ?? {});
    const [selectedAddons, setSelectedAddons] = useState({})
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        if (data?.sizes && data.sizes.length > 0) {
            setSelectedSize(data.sizes[0]);
        }
    }, [data]);

    console.log(selectedSize);



    const addon_groups = [
        {
            id: 1,
            addon_category_id: 'Toppings',
            is_required: true,
            max_qty: 3,
            min_qty: 1,
            items: [
                { id: 1, addon_item: { name: 'Cheese', image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800' }, price: 50 },
                { id: 2, addon_item: { name: 'Bacon', image: 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=800' }, price: 75 },
                { id: 3, addon_item: { name: 'Onions', image: 'https://images.pexels.com/photos/5256480/pexels-photo-5256480.jpeg?auto=compress&cs=tinysrgb&w=800' }, price: 25 },
            ]
        },
        {
            id: 2,
            addon_category_id: 'Sauces',
            is_required: false,
            max_qty: 3,
            min_qty: 1,
            items: [
                { id: 4, addon_item: { name: 'Ketchup', image: 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=800' }, price: 0 },
                { id: 5, addon_item: { name: 'Mayo', image: 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=800' }, price: 0 },
                { id: 6, addon_item: { name: 'Hot Sauce', image: 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=800' }, price: 25 },
            ]
        }
    ]


    const handleAddonChange = (groupId, addonId, checked) => {
        setSelectedAddons(prev => {
            const group = addon_groups.find(g => g.id === groupId)
            const currentSelection = prev[groupId] || []
            let newSelection = currentSelection

            if (checked && currentSelection.length < group.max_qty) {
                newSelection = [...currentSelection, addonId]
            } else if (!checked) {
                newSelection = currentSelection.filter(id => id !== addonId)
            }

            return {
                ...prev,
                [groupId]: newSelection
            }
        })
    }

    // Calculate total price
    const calculateTotalPrice = () => {
        let total = parseFloat(selectedSize.price) || 0;

        Object.entries(selectedAddons).forEach(([groupId, addonIds]) => {
            const group = addon_groups.find(g => g.id === parseInt(groupId));
            if (group) {
                addonIds.forEach(addonId => {
                    const addon = group.items.find(a => a.id === addonId);
                    if (addon) {
                        total += addon.price;
                    }
                });
            }
        });

        return (total * quantity).toFixed(2);
    }

    // Validate required addons
    const validateAddons = () => {
        for (let group of addon_groups) {
            if (group.is_required) {
                const selectedCount = (selectedAddons[group.id] || []).length;
                if (selectedCount < group.min_qty) {
                    return false;
                }
            }
        }
        return true;
    }

    const handleAddToCart = () => {
        if (!validateAddons()) {
            alert('Please select required add-ons');
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
        dispatch(closeItemModal());
    }

    return (
        <div className={`fixed inset-0 z-100 bg-white/20 backdrop-blur-xs flex items-center justify-center transition duration-500 ${isModalOpen ? "opacity-100 pointer-events-auto " : "opacity-0 pointer-events-none"}`}>
            <div className={`w-4xl  shadow-xl rounded-2xl bg-white text-zinc-800 transition duration-500 ${isModalOpen ? "scale-100" : "scale-50"}`}>
                <div className="border-b border-zinc-400/30 px-4 py-3 flex items-center justify-between">
                    <h2 className='text-xl font-semibold'>{data?.name}</h2>

                    <button
                        onClick={() => dispatch(closeItemModal())}
                        className='size-10 rounded-full text-black/70 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition duration-300 '>
                        <FaTimes size={20} />
                    </button>

                </div>
                <div className="sm:p-4 pe-0 max-h-[70vh] md:max-h-fit overflow-auto sm:overflow-visible">
                    <div className="sm:flex items-start ">
                        {/* IMAGE */}
                        <div className="rounded-xl overflow-hidden aspect-square sm:w-2/5">
                            <Img
                                className='aspect-square  object-cover'
                                src={data?.media[0]?.original_url} width={"100%"} alt="" />
                        </div>
                        {/* DETAILS */}
                        <div className="pl-6 flex-1 sm:max-h-[85vh] sm:overflow-auto pe-4">
                            <p className='text-sm text-gray-700 leading-normal'>{data?.description}</p>

                            <div className="mt-4">
                                <h3 className='font-semibold text-xl'>Sizes</h3>

                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    {
                                        data?.sizes?.map((size, idx) => {
                                            console.log(size)
                                            return (
                                                <label key={size.id} className={`border-2 px-3 py-2 rounded-[10px] flex items-center justify-between cursor-pointer ${selectedSize.id === size.id ? 'border-brand bg-brand text-white' : 'border-gray-300'}`}>
                                                    <input type="radio" name="size" value={size.id} hidden checked={selectedSize.id === size.id} onChange={(e) => setSelectedSize(size)} className="w-4 h-4" />
                                                    <span>{size?.name}</span>
                                                    <span className="ml-auto">{size?.price}</span>
                                                </label>
                                            )
                                        })
                                    }
                                    {/* <label className={`border-2 px-3 py-2 rounded-[10px] flex items-center justify-between cursor-pointer ${selectedSize === 'regular' ? 'border-brand bg-brand text-white' : 'border-gray-300'}`}>
                                        <input type="radio" name="size" value="regular" hidden checked={selectedSize === 'regular'} onChange={(e) => setSelectedSize(e.target.value)} className="w-4 h-4" />
                                        <span>Regular</span>
                                        <span className="ml-auto">200</span>
                                    </label>
                                    <label className={`border-2 px-3 py-2 rounded-[10px] flex items-center justify-between cursor-pointer ${selectedSize === 'large' ? 'border-brand bg-brand text-white' : 'border-gray-300'}`}>
                                        <input type="radio" name="size" value="large" hidden checked={selectedSize === 'large'} onChange={(e) => setSelectedSize(e.target.value)} className="w-4 h-4" />
                                        <span>Large</span>
                                        <span className="ml-auto">250</span>
                                    </label> */}
                                </div>

                                <div className="mt-6">
                                    <h3 className='font-semibold text-xl mb-4'>Add-ons</h3>
                                    <div className="space-y-6">
                                        {addon_groups?.map((group) => (
                                            <div key={group.id}>
                                                <h4 className='font-medium text-sm text-gray-700 mb-3'>
                                                    {group.addon_category_id} {group.is_required && <span className='text-red-500'>*</span>}
                                                    <span className='text-xs text-gray-500 ml-2'>({group.min_qty}-{group.max_qty})</span>
                                                </h4>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {group.items?.map((addon) => (
                                                        <label key={addon.id} className='border-2 border-gray-300 rounded-xl p-2 cursor-pointer hover:border-brand transition'>
                                                            <input
                                                                type="checkbox"
                                                                name={`group-${group.id}`}
                                                                checked={(selectedAddons[group.id] || []).includes(addon.id)}
                                                                onChange={(e) => handleAddonChange(group.id, addon.id, e.target.checked)}
                                                                disabled={(selectedAddons[group.id] || []).length >= group.max_qty && !selectedAddons[group.id]?.includes(addon.id)}
                                                                hidden
                                                            />
                                                            <div className='aspect-square mb-2 rounded-lg overflow-hidden bg-gray-100'>
                                                                <img src={addon.addon_item?.image} alt={addon.addon_item?.name} className='w-full h-full object-cover' />
                                                            </div>
                                                            <p className='text-sm font-medium truncate'>{addon.addon_item?.name}</p>
                                                            <p className='text-xs text-gray-600'>${addon.price || 0}</p>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>

                            <div className="sticky bottom-0 left-0 right-0 mt-6 pt-4 border-t border-zinc-400/30 bg-white">
                                <div className="flex gap-3 items-center">
                                    <div className="flex items-center border-2 border-gray-300 rounded-full">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100 transition rounded-full cursor-pointer ">
                                            −
                                        </button>
                                        <span className="px-6 py-2 font-semibold">{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100 transition rounded-full cursor-pointer ">
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 px-4 py-3 rounded-full bg-green-700 text-white font-semibold hover:bg-green-800 transition flex items-center justify-center gap-2">
                                        <span>Add to Cart</span>
                                        <span>${calculateTotalPrice()}</span>
                                    </button>
                                </div>
                            </div>


                        </div>

                    </div>
                </div>
            </div>

        </div>
    )
}

export default ItemModal
