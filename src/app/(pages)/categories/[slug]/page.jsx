import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import React from 'react'
import CategoryClient from './CategoryClient';
import { categryKeys } from '@/features/categories/keys';
import { prefetchCategory } from '@/features/categories/prefetch';

const Category = async ({ params }) => {
    const queryClient = new QueryClient();

    const { slug } = await params;

    await prefetchCategory(queryClient, slug);

    return (
        <>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <CategoryClient />
            </HydrationBoundary>
        </>
    )
}

export default Category
