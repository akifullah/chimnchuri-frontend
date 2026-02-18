"use client"

import { resetPasswordApi } from "../../../../lib/api";
import { useMutation } from '@tanstack/react-query';
import React, { useState, Suspense } from 'react'
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaLock, FaEye, FaEyeSlash, FaArrowRight, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ResetPasswordContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            token: token || '',
            email: email || '',
        }
    });

    const mutation = useMutation({
        mutationFn: resetPasswordApi,
        onSuccess: (data) => {
            toast.success("Password reset successfully! Plese login with your new password.");
            router.push("/login");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to reset password. The link may be expired.");
        },
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    }

    if (!token || !email) {
        return (
            <div className="text-center p-8 bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl">
                <h2 className="text-xl font-bold text-red-400 mb-4">Invalid Reset Link</h2>
                <p className="text-zinc-400 mb-6">The password reset link is invalid or has expired.</p>
                <Link href="/forgot-password" size={14} className="inline-flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-xl font-bold transition-all hover:bg-green-700">
                    Request new link
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/20">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                    Reset Password
                </h1>
                <p className="text-zinc-400 text-sm">
                    Enter your new password below to reset it.
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Hidden Fields for token and email if needed by backend */}
                <input type="hidden" {...register("token")} />
                <input type="hidden" {...register("email")} />

                {/* Password Field */}
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">New Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaLock className="text-zinc-500 group-focus-within:text-brand transition-colors duration-300" size={14} />
                        </div>
                        <input
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 8, message: "Password must be at least 8 characters" }
                            })}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className={`w-full pl-11 pr-12 py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-zinc-500 text-sm
                                focus:outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 focus:bg-white/[0.08]
                                transition-all duration-300 hover:border-white/20 ${errors.password ? "border-red-500" : ""}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors duration-300 cursor-pointer"
                        >
                            {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
                </div>

                {/* Confirm Password Field */}
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Confirm Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaCheck className="text-zinc-500 group-focus-within:text-brand transition-colors duration-300" size={14} />
                        </div>
                        <input
                            {...register("password_confirmation", {
                                required: "Please confirm your password",
                                validate: (value) => value === watch('password') || "Passwords do not match"
                            })}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className={`w-full pl-11 pr-12 py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-zinc-500 text-sm
                                focus:outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 focus:bg-white/[0.08]
                                transition-all duration-300 hover:border-white/20 ${errors.password_confirmation ? "border-red-500" : ""}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors duration-300 cursor-pointer"
                        >
                            {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </button>
                    </div>
                    {errors.password_confirmation && <p className="mt-1.5 text-xs text-red-400">{errors.password_confirmation.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="group w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-brand hover:bg-green-700 active:bg-green-800 text-white font-semibold text-sm rounded-xl shadow-lg shadow-brand/20 hover:shadow-brand/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {mutation.isPending ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            Reset Password
                            <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

const ResetPasswordPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand/10 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-brand/5 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand/[0.03] blur-3xl" />
            </div>

            <div className="max-w-md w-full relative z-10">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link href="/">
                        <Image src="/logo-light.png" alt="Chim 'N' Churri" width={120} height={72} className="drop-shadow-lg" />
                    </Link>
                </div>

                <Suspense fallback={
                    <div className="flex items-center justify-center p-12 bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl">
                        <div className="w-8 h-8 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
                    </div>
                }>
                    <ResetPasswordContent />
                </Suspense>

                {/* Footer */}
                <p className="mt-8 text-center text-xs text-zinc-600">
                    Remembered your password? <Link href="/login" className="text-brand hover:text-green-400 transition-colors">Sign in here</Link>
                </p>
            </div>
        </div>
    )
}

export default ResetPasswordPage
