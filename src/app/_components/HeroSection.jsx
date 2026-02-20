import React from 'react'
import c from "@/assets/images/c.png"
import h from "@/assets/images/h.png"
import i from "@/assets/images/i.png"
import m from "@/assets/images/m.png"
import n from "@/assets/images/n.png"
import u from "@/assets/images/u.png"
import r from "@/assets/images/r.png"

const HeroSection = () => {
    let images = [{ src: c, alt: "C" }, { src: h, alt: "H" }, { src: i, alt: "I" }, { src: m, alt: "M" }, { src: n, alt: "N" }, { src: c, alt: "C" }, { src: h, alt: "H" }, { src: u, alt: "U" }, { src: r, alt: "R" }, { src: r, alt: "R" }, { src: i, alt: "I" }];
    return (
        <>
            <section>
                <div className="bg-brand py-10 min-h-[40vh] lg:min-h-[70vh] flex items-center justify-center">
                    <div className="flex justify-center">
                        {
                            images?.map((img, index) => (
                                <img key={index} src={img?.src?.src} alt={img.alt} height={100} className="h-[12vw] animate-image-wave"
                                    style={{ animationDelay: `${index * 0.12}s` }} />
                            ))
                        }
                    </div>
                </div>
            </section>
        </>
    )
}

export default HeroSection