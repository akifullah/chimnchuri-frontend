"use client";
import React from 'react'
import { useParams } from 'next/navigation';
import { useCategory } from '@/features/categories/hooks';
import ProductCard from '@/app/_components/ProductCard';
import ItemModal from '@/app/_components/ItemModal';

const CategoryClient = () => {
    const { slug } = useParams();


    const { data, isLoading, error } = useCategory(slug);

    if (isLoading) return <div>Loading...</div>;

    if (error) return <div>Error loading category</div>;
    const items = data?.data?.items || [];
    const childern = data?.data?.children || [];
    return (
        <div>
            <ItemModal />
            <div className="container mx-auto px-2 md:px-4 my-10 mb-20">

                <div className="my-4">
                    <h3 className='text-2xl md:text-3xl font-bold'>{data?.data?.name}</h3>
                </div>


                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">

                    {
                        items?.map((item, idx) => {
                            return (
                                <div className="" key={idx}>

                                    <ProductCard item={item} />

                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default CategoryClient
