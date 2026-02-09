import React from 'react'
import Img from './Img'
import { FaCartPlus } from 'react-icons/fa';

const ProductCard = ({ item }) => {
    const img = item?.media[0]?.original_url ?? null;
    return (
        <div className='rounded-2xl h-full border-4 border-transparent hover:border-brand group transition duration-300 bg-white'>
            <div className="img aspect-square rounded-xl overflow-hidden">
                <Img src={img} className='aspect-square object-cover group-hover:scale-105 transition duration-300' />
            </div>
            <div className="text-zinc-900 px-1 lg:px-2 pt-2 md:pt-4 pb-1">
                <div className="">
                    <h3 className='text-sm sm:text-md lg:text-lg font-bold capitalize text-brand line-clamp-1'>{(item?.name?.toLowerCase())}</h3>
                    <p className='line-clamp-2 text-xs lg:text-sm h-[2lh]'>{item?.description}</p>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <p className='font-bold text-brand'>£ {item?.sizes[0]?.price}</p>

                    <button className='size-7 md:size-8 rounded-full bg-brand text-white flex items-center justify-center cursor-pointer'>
                        <FaCartPlus className='size-3 md:size-4' />
                    </button>
                </div>


            </div>
        </div>
    )
}

export default ProductCard
