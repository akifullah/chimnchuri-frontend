"use client"
import React from 'react'
import Link from 'next/link';
import { useCategories } from '@/features/categories/hooks';
import Image from 'next/image';
import CategoryCard from '@/app/_components/CategoryCard';

import { isDevMode } from "@/lib/constant";


const CategoriesClient = () => {
    const { data, isLoading, error } = useCategories();

    console.log(error);
    if (isLoading) return <div>Loading...</div>;

    if (error) return <div>Error loading categories</div>;
    return (
        <div className='container mx-auto my-14 px-2'>

            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4'>
                {data?.data?.map((category, idx) => {

                    return (
                        <div key={idx} className={`${idx == 0 ? "col-span-2" : ""}`}>
                            <CategoryCard category={category} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default CategoriesClient
