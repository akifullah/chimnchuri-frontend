"use client"
import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion"
import c from "@/assets/images/c.png"
import h from "@/assets/images/h.png"
import i from "@/assets/images/i.png"
import m from "@/assets/images/m.png"
import n from "@/assets/images/n.png"
import u from "@/assets/images/u.png"
import r from "@/assets/images/r.png"

const HeroSection = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const bounceHeight = isMobile ? -30 : -50;

    const images = [
        { src: c, alt: "C" },
        { src: h, alt: "H" },
        { src: i, alt: "I" },
        { src: m, alt: "M" },
        { src: n, alt: "'N'" },
        { src: c, alt: "C" },
        { src: h, alt: "H" },
        { src: u, alt: "U" },
        { src: r, alt: "R" },
        { src: r, alt: "R" },
        { src: i, alt: "I" },
    ];

    const totalLetters = images.length;
    const letterDuration = 0.4;
    const totalCycleDuration = totalLetters * letterDuration;

    return (
        <section>
            <div className="bg-brand py-14 min-h-[20vh] lg:min-h-[50vh] flex items-center justify-center">
                <div className="flex justify-center items-end">
                    {images.map((img, index) => {
                        const delay = index * letterDuration;

                        // Add spacing around the 'N' (index 4) for "CHIM 'N' CHURRI"
                        const isN = index === 4;
                        const spacingClass = isN ? "mx-[3vw] lg:mx-[3vw]" : "";

                        return (
                            <motion.img
                                key={index}
                                src={img?.src?.src}
                                alt={img.alt}
                                height={100}
                                className={`h-[11vw] lg:h-[11vw] ${spacingClass}`}
                                animate={{
                                    y: [0, bounceHeight, 0],
                                }}
                                transition={{
                                    duration: letterDuration * 2,
                                    delay: delay,
                                    repeat: Infinity,
                                    repeatDelay: totalCycleDuration - letterDuration * 2,
                                    ease: "easeInOut",
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HeroSection