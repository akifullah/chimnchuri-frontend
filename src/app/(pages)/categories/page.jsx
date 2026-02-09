import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import React from 'react'
import CategoriesClient from './CategoriesClient';
import { prefetchCategories } from '@/features/categories/prefetch';

const Categories = async () => {

    const queryClient = new QueryClient()

    await prefetchCategories(queryClient);

    const hydarate = dehydrate(queryClient);

    return (
        <HydrationBoundary state={hydarate}>
            <CategoriesClient />
        </HydrationBoundary>
    )
}

export default Categories
