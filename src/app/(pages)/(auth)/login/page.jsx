"use client"

import { login } from "../../../../lib/api";
import { useMutation } from '@tanstack/react-query';
import React from 'react'
import { useForm } from 'react-hook-form';

const page = () => {

    const mutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        console.log(data);
        mutation.mutate(data);
    }

    return (
        <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-50">
                        Sign in to your account
                    </h2>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="Email address"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-50 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                            />
                        </div>
                        <div>
                            <input
                                {...register("password")}
                                type="password"
                                placeholder="Password"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-50 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    )
}

export default page