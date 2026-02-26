"use client"

import React from 'react'
import { fetchOrders } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { FaShoppingBag, FaCalendarAlt, FaChevronRight, FaArrowLeft, FaBoxOpen } from 'react-icons/fa';
import Link from 'next/link';
import { useCurrency } from '@/app/providers/SettingsProvider';

const OrdersClient = () => {
    const { symbol } = useCurrency();

    const { data: ordersData, isLoading, error } = useQuery({
        queryKey: ['orders'],
        queryFn: fetchOrders,
    });

    const getStatusBadge = (status) => {
        const statusColors = {
            paid: 'bg-green-500/10 text-green-400 border-green-500/20',
            unpaid: 'bg-red-500/10 text-red-400 border-red-500/20',
            pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            processing: 'bg-brand/10 text-brand border-brand/20',
            shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
            completed: 'bg-green-500/10 text-green-400 border-green-500/20',
            cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
        };
        const colorClass = statusColors[status] || 'bg-white/10 text-zinc-400 border-white/10';
        return (
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${colorClass}`}>
                {status}
            </span>
        );
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen bg-[#141414] items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand/20 border-t-brand"></div>
            </div>
        );
    }

    const orders = ordersData?.data || [];

    return (
        <main className="min-h-screen bg-[#141414] py-6 sm:py-8 px-3 sm:px-6 relative overflow-hidden text-white font-sans">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand/10 blur-3xl opacity-50" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-brand/5 blur-3xl opacity-30" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <Link href="/profile" className="inline-flex items-center gap-1.5 sm:gap-2 text-zinc-400 hover:text-white transition-colors group">
                        <FaArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs sm:text-sm font-medium">Back to Profile</span>
                    </Link>
                </div>

                <div className="mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-3xl font-black tracking-tight mb-0.5 sm:mb-1">My Orders</h1>
                    <p className="text-zinc-500 text-xs sm:text-sm">Track and manage your delicious journeys with us.</p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-brand">
                            <FaBoxOpen size={28} />
                        </div>
                        <h3 className="text-base sm:text-xl font-black mb-1 sm:mb-2">No orders yet</h3>
                        <p className="text-zinc-500 text-xs sm:text-sm mb-6 sm:mb-8">Looks like you haven't placed any orders. Let's change that!</p>
                        <Link href="/" className="inline-flex items-center gap-2 bg-brand hover:bg-green-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm transition-all shadow-xl shadow-brand/20">
                            Start Ordering
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-4">
                        {orders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/orders/${order.id}`}
                                className="block group bg-white/[0.04] hover:bg-white/[0.06] backdrop-blur-xl border border-white/10 hover:border-brand/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all shadow-xl shadow-black/20"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                                    <div className="flex items-center gap-3 sm:gap-5">
                                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-brand/10 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-all shrink-0">
                                            <FaShoppingBag size={16} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 sm:gap-3 mb-0.5 sm:mb-1">
                                                <h4 className="font-black text-white text-xs sm:text-base tracking-tight truncate">Order #{order.order_number}</h4>
                                                <div className="flex gap-1.5 sm:gap-2">
                                                    {getStatusBadge(order.order_status)}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                                <span className="flex items-center gap-1 sm:gap-1.5">
                                                    <FaCalendarAlt size={10} className="text-zinc-600" />
                                                    {formatDate(order.created_at)}
                                                </span>
                                                <span className="text-brand">
                                                    {symbol} {order.grand_total}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                                        <div className="sm:hidden">
                                            {getStatusBadge(order.payment_status)}
                                        </div>
                                        <div className="hidden sm:block">
                                            {getStatusBadge(order.payment_status)}
                                        </div>
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 flex items-center justify-center text-zinc-500 group-hover:bg-brand/20 group-hover:text-brand transition-all">
                                            <FaChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}

export default OrdersClient
