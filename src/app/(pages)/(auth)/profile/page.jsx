import React from 'react'
import ProfileClient from './ProfileClient';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchProfile } from '../../../../lib/api';

const page = async () => {

    const queryClient = new QueryClient()

    await queryClient.prefetchQuery({
        queryKey: ['profile'],
        queryFn: fetchProfile,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProfileClient />
        </HydrationBoundary>
    )
}

export default page
