import React from 'react'
import Img from './Img'
import Link from 'next/link'

const CategoryCard = ({ category }) => {
    return (
        <div className='border border-zinc-500/60 shadow-3xl rounded-2xl 2xl:rounded-3xl overflow-hidden h-[200] md:h-[250] group'>
            <Link href={`/categories/${category.id}`}>
                <div className="h-full rounded-2xl relative">
                    <Img src={category.image_url} alt={category.name} className='size-full object-cover group-hover:scale-105 transition duration-300' />
                    <div className="absolute bottom-0 left-0 px-3 py-2 w-full backdrop-blur-xs bg-linear-to-t ">
                        <h3 className='text-sm md:text-xl font-bold text-shadow-xs'>{category?.name}</h3>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default CategoryCard
