
import React from 'react';
import Link from 'next/link';

const ThankYouPage = () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md w-full">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    Thank You!
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                    Your submission has been received successfully. We appreciate your interest and will get back to you as soon as possible.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        href="/"
                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Go back home
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default ThankYouPage;
