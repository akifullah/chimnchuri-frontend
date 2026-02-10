import React from 'react'
import { isDevMode } from "@/lib/constant";
import Image from 'next/image';


const Img = ({ src = null, width = "100%", height = "100%", alt = "", className = "", others = {} }) => {
    return (
        <>
            {
                isDevMode ? (
                    <img src={src} alt={alt} width={width} height={height} {...others} className={className} />
                ) : (
                    <Image src={src} alt={alt} width={width} height={height} {...others} className={className} />
                )
            }
        </>
    )
}

export default Img
