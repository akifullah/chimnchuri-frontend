"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { registerApi } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const password = watch('password');

    const router = useRouter();

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const res = await registerApi(data);

            if (res.success) {
                router.push("/login");
            }
        } catch (error) {
            console.error('Registration failed:', error);
            setSubmitError('Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const InputField = ({ icon: Icon, label, name, type = "text", placeholder, validation = {}, isPassword = false, showPw, togglePw }) => (
        <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">{label}</label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon className="text-zinc-500 group-focus-within:text-brand transition-colors duration-300" size={14} />
                </div>
                <input
                    {...register(name, validation)}
                    type={isPassword ? (showPw ? "text" : "password") : type}
                    placeholder={placeholder}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-zinc-500 text-sm
                        focus:outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 focus:bg-white/[0.08]
                        transition-all duration-300 hover:border-white/20"
                // style={isPassword ? { paddingRight: '3rem' } : {}}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={togglePw}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors duration-300 cursor-pointer"
                    >
                        {showPw ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                )}
            </div>
            {errors[name] && <p className="mt-1.5 text-xs text-red-400">{errors[name].message}</p>}
        </div>
    );

    return (
        <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden`}>
            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand/10 blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-brand/5 blur-3xl" />
                <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-green-500/[0.04] blur-3xl" />
            </div>

            <div className="max-w-md w-full relative z-10">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link href="/">
                        <Image src="/logo-light.png" alt="Chim 'N' Churri" width={120} height={72} className="drop-shadow-lg" />
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/20">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                            Create Account
                        </h1>
                        <p className="text-zinc-400 text-sm">
                            Join us and start ordering your favorite meals
                        </p>
                    </div>

                    {/* Error message */}
                    {submitError && (
                        <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {submitError}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <InputField
                            icon={FaUser}
                            label="Full Name"
                            name="name"
                            placeholder="John Doe"
                            validation={{ required: 'Name is required' }}
                        />

                        <InputField
                            icon={FaEnvelope}
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            validation={{
                                required: 'Email is required',
                                pattern: { value: /^\S+@\S+$/, message: 'Invalid email address' }
                            }}
                        />

                        <InputField
                            icon={FaPhone}
                            label="Phone Number"
                            name="phone"
                            type="tel"
                            placeholder="+92 300 1234567"
                        />

                        <InputField
                            icon={FaLock}
                            label="Password"
                            name="password"
                            placeholder="••••••••"
                            isPassword
                            showPw={showPassword}
                            togglePw={() => setShowPassword(!showPassword)}
                            validation={{
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Minimum 6 characters' }
                            }}
                        />

                        <InputField
                            icon={FaLock}
                            label="Confirm Password"
                            name="confirmPassword"
                            placeholder="••••••••"
                            isPassword
                            showPw={showConfirmPassword}
                            togglePw={() => setShowConfirmPassword(!showConfirmPassword)}
                            validation={{
                                validate: value => value === password || 'Passwords do not match'
                            }}
                        />

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-brand hover:bg-green-700 active:bg-green-800 text-white font-semibold text-sm rounded-xl shadow-lg shadow-brand/20 hover:shadow-brand/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"

                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Create Account
                                        <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="mt-8 flex items-center gap-4">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-xs text-zinc-500 uppercase tracking-wider">Already a member?</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/login"
                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-sm text-zinc-300
                                hover:border-brand/40 hover:text-white hover:bg-white/[0.03]
                                transition-all duration-300`}
                        >
                            <FaArrowLeft size={11} />
                            Back to Sign In
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-zinc-600">
                    By creating an account, you agree to our Terms of Service & Privacy Policy
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;