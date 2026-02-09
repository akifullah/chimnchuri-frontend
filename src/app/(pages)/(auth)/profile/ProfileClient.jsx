"use client"
import { fetchProfile } from '../../../../lib/api';
import { useQuery } from '@tanstack/react-query';
import React from 'react'

const ProfileClient = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['profile'],
        queryFn: fetchProfile,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading profile</div>;

    return (
        <div>
            <h1>Profile Client</h1>
            <p>Name: {data?.name}</p>
            <p>Email: {data?.email}</p>
        </div>
    )
}

export default ProfileClient
