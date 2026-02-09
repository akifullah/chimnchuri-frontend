import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className='mt-auto'>
            <div className="container mx-auto px-3">
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
                    <div className="mb-2">
                        <h3 className='text-xl lg:text-2xl font-bold mb-2 md:mb-4'>Help</h3>
                        <ul>
                            <li className=''>
                                <Link className='text-sm md:text-md mb-1 md:mb-2 text-white/80 hover:text-brand transition ease duration-200 inline-block' href={"#"}>FAQs</Link>
                            </li>
                            <li className=''>
                                <Link className='text-sm md:text-md mb-1 md:mb-2 text-white/80 hover:text-brand transition ease duration-200 inline-block' href={"#"}>Delivery</Link>
                            </li>
                            <li className=''>
                                <Link className='text-sm md:text-md mb-1 md:mb-2 text-white/80 hover:text-brand transition ease duration-200 inline-block' href={"#"}>Contact</Link>
                            </li>
                            <li className=''>
                                <Link className='text-sm md:text-md mb-1 md:mb-2 text-white/80 hover:text-brand transition ease duration-200 inline-block' href={"#"}>Store Locator</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="mb-2">
                        <h3 className='text-xl lg:text-2xl font-bold mb-2 md:mb-4'>About US</h3>
                        <ul>
                            <li className=''>
                                <Link className='text-sm md:text-md mb-1 md:mb-2 text-white/80 hover:text-brand transition ease duration-200 inline-block' href={"#"}>FAQs</Link>
                            </li>
                            <li className=''>
                                <Link className='text-sm md:text-md mb-1 md:mb-2 text-white/80 hover:text-brand transition ease duration-200 inline-block' href={"#"}>Delivery</Link>
                            </li>
                            <li className=''>
                                <Link className='text-sm md:text-md mb-1 md:mb-2 text-white/80 hover:text-brand transition ease duration-200 inline-block' href={"#"}>Contact</Link>
                            </li>
                            <li className=''>
                                <Link className='text-sm md:text-md mb-1 md:mb-2 text-white/80 hover:text-brand transition ease duration-200 inline-block' href={"#"}>Store Locator</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="mb-2">
                        <h3 className='text-xl lg:text-2xl font-bold mb-2 md:mb-4'>Address</h3>
                        <ul>
                            <li className=''>
                                <p className='text-sm md:text-md mb-1 md:mb-2 text-white/80 hover:text-brand transition ease duration-200 inline-block'>1487 Rocky Horse Carre 1487Rocky Arlington, TX 16819 United</p>
                            </li>
                            <li className=''>
                                <Link className='text-sm md:text-md mb-1 md:mb-2 text-white/80 hover:text-brand transition ease duration-200 inline-block' href={"tel:1800 6565 222"}>1800 6565 222</Link>
                            </li>
                            <li className=''>
                                <Link className='text-sm md:text-md mb-1 md:mb-2 text-white/80 hover:text-brand transition ease duration-200 inline-block' href={"mailto:info@gmail.com"}>info@gmail.com</Link>
                            </li>

                        </ul>
                    </div>

                </div>
            </div>
            <div className="border-b border-gray-600/40 my-4"></div>
            <div className="container mx-auto pb-4">
                <div className="flex gap-3 text-center md:text-left flex-col md:flex-row items-center justify-center md:justify-between">
                    <p>Copyright © 2025 Chim n Churri all Right Reserved</p>



                    <div className="flex items-center gap-4">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms & Conditions</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
