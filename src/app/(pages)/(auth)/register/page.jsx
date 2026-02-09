"use client"
import React from 'react'
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { registerApi } from '@/lib/api';



const RegistrationForm = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const password = watch('password');

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            // API call here
            const res = await registerApi(data);
            console.log(res);
        } catch (error) {
            console.error('Registration failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 border rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Register</h2>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input {...register('name', { required: 'Name is required' })} className="w-full border rounded px-3 py-2" />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })} className="w-full border rounded px-3 py-2" />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input {...register('phone')} className="w-full border rounded px-3 py-2" />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Password</label>
                <input type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })} className="w-full border rounded px-3 py-2" />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input type="password" {...register('confirmPassword', { validate: value => value === password || 'Passwords do not match' })} className="w-full border rounded px-3 py-2" />
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white py-2 rounded font-medium hover:bg-blue-600 disabled:opacity-50">
                {isSubmitting ? 'Registering...' : 'Register'}
            </button>
        </form>
    );
};

export default RegistrationForm;