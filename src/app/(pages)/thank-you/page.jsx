'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FaCheckCircle, FaCreditCard, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaUser } from 'react-icons/fa'; // Icons
import { MdOutlineLocalShipping, MdOutlineDescription, MdOutlineAttachMoney, MdOutlineDiscount, MdOutlineReceiptLong } from 'react-icons/md';

const ThankYouPage = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('id');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!orderId) {
            setLoading(false);
            return;
        }

        const fetchOrder = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch order details');
                }
                const data = await response.json();
                setOrder(data);
            } catch (err) {
                console.error("Error fetching order:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-dashed border-indigo-600"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
                <div className="max-w-md w-full">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl text-red-500">
                        Include Order ID
                    </h1>
                    <p className="mt-4 text-base leading-7 text-gray-600">
                        We couldn't find your order details. Please check the URL or contact support.
                    </p>
                    <div className="mt-6">
                        <Link href="/" className="btn btn-primary bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm">
                            Go Home
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const {
        order_number,
        payment_status,
        order_status,
        created_at,
        items,
        sub_total,
        discount_total,
        delivery_charge,
        tax_total,
        grand_total,
        customer_name,
        customer_email,
        customer_phone,
        delivery_address,
        payment_method
    } = order;

    // Helper for status badges
    const getStatusBadge = (status, type) => {
        const statusColors = {
            paid: 'bg-green-100 text-green-700',
            unpaid: 'bg-red-100 text-red-700',
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            completed: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700',
        };
        const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';
        return (
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${colorClass}`}>
                {status}
            </span>
        );
    };

    // Format Date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <main className="min-h-screen bg-gray-50 p-3 md:p-6 font-sans text-sm">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                    {/* Left Column (Order Details) */}
                    <div className="xl:col-span-9 lg:col-span-8 space-y-4">
                        {/* Order Header Card */}
                        <div className="bg-white rounded-2xl p-4 border border-gray-200">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        #{order_number}
                                        {getStatusBadge(payment_status, 'payment')}
                                        {getStatusBadge(order_status, 'order')}
                                    </h4>
                                    <p className="text-gray-500 mt-0.5 text-xs">
                                        Order / Order Details / {order_number} - {formatDate(created_at)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Product Table Card */}
                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <h4 className="text-base font-bold text-gray-800">Product</h4>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="px-4 py-2 font-semibold">Product Name & Size</th>
                                            <th className="px-4 py-2 font-semibold text-center">Quantity</th>
                                            <th className="px-4 py-2 font-semibold text-right">Price</th>
                                            <th className="px-4 py-2 font-semibold text-right">Total Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {items.map((item) => (
                                            <React.Fragment key={item.id}>
                                                <tr className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                                                {/* Use first media URL or fallback */}
                                                                {item.item?.media?.[0]?.original_url ? (
                                                                    <img
                                                                        src={item.item.media[0].original_url}
                                                                        alt={item.item_name}
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="text-gray-400 text-[10px]">No Img</div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-800 text-sm">{item.item_name}</p>
                                                                <p className="text-xs text-gray-500">Size: {item.size_name}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-gray-600 text-sm">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-right text-gray-600 text-sm">£{item.price}</td>
                                                    <td className="px-4 py-3 text-right font-semibold text-gray-800 text-sm">£{item.quantity * item.price}</td>
                                                </tr>
                                                {/* Addons Section */}
                                                {item.addons && item.addons.length > 0 && (
                                                    <tr className="bg-gray-50/30">
                                                        <td colSpan="4" className="px-4 py-2">
                                                            <div className="pl-12 space-y-1.5">
                                                                {Object.entries(
                                                                    item.addons.reduce((acc, addon) => {
                                                                        (acc[addon.category_name] = acc[addon.category_name] || []).push(addon);
                                                                        return acc;
                                                                    }, {})
                                                                ).map(([categoryName, addons]) => (
                                                                    <div key={categoryName} className="text-xs">
                                                                        <div className="font-semibold text-gray-700 mb-0.5">{categoryName}</div>
                                                                        {addons.map((addon) => (
                                                                            <div key={addon.id} className="flex mb-1 justify-between text-gray-600 pl-2">
                                                                                <span>+ {addon.name} ({addon.quantity} x £{addon.price})</span>
                                                                                <span>£{(addon.quantity * addon.price).toFixed(2)}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                        {items.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-4 py-6 text-center text-gray-400 text-sm">
                                                    No items found in this order.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>


                    </div>

                    {/* Right Column (Sidebar Information) */}
                    <div className="xl:col-span-3 lg:col-span-4 space-y-4">
                        {/* Customer Details */}
                        <div className="bg-white rounded-2xl p-4 border border-gray-200">
                            <h4 className="text-base font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">Customer Details</h4>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-9 w-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-sm">
                                    <FaUser />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">{customer_name}</p>
                                    <a className="text-xs text-brand">{customer_email}</a>
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <div>
                                    <div className="flex items-center gap-2 text-gray-500 font-medium text-xs mb-0.5">
                                        <FaPhoneAlt className="text-gray-400 text-[10px]" /> Contact Number
                                    </div>
                                    <p className="text-gray-800 pl-5 text-sm">{customer_phone}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-gray-500 font-medium text-xs mb-0.5">
                                        <FaMapMarkerAlt className="text-gray-400 text-[10px]" /> Shipping Address
                                    </div>
                                    <p className="text-gray-800 pl-5 text-sm leading-relaxed">{delivery_address}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <h4 className="text-base font-bold text-gray-800">Order Summary</h4>
                            </div>
                            <div className="p-4 space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 flex items-center gap-1.5"><MdOutlineDescription /> Sub Total :</span>
                                    <span className="font-semibold text-gray-800">£{sub_total}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 flex items-center gap-1.5"><MdOutlineDiscount /> Discount :</span>
                                    <span className="font-semibold text-gray-800">£{discount_total || 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 flex items-center gap-1.5"><MdOutlineLocalShipping /> Delivery Charge :</span>
                                    <span className="font-semibold text-gray-800">£{delivery_charge || 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 flex items-center gap-1.5"><MdOutlineAttachMoney /> Estimated Tax :</span>
                                    <span className="font-semibold text-gray-800">£{tax_total || 0}</span>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-100">
                                <span className="font-bold text-gray-800 text-sm">Total Amount</span>
                                <span className="font-extrabold text-brand text-base ">£{grand_total}</span>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="bg-white rounded-2xl p-4 border border-gray-200">
                            <h4 className="text-base font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">Payment Information</h4>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="h-9 w-12 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-lg">
                                    {payment_method === 'cod' ? <MdOutlineAttachMoney /> : <FaCreditCard />}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm capitalize">{payment_method === 'cod' ? 'Cash On Delivery' : payment_method}</p>
                                    <p className="text-xs text-gray-500">{payment_status}</p>
                                </div>
                                <div className="ml-auto">
                                    {payment_status === 'paid' ? (
                                        <FaCheckCircle className="text-green-500 text-lg" />
                                    ) : (
                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">
                                            {payment_status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>


                        <div className="text-center mt-4">
                            <Link href="/" className="inline-block bg-brand text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-black transition-colors shadow-sm w-full">
                                Continue Shopping
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
};

export default ThankYouPage;
