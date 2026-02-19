import React from 'react'

const HeroSection = () => {
    return (
        <>
            <section>
                <div className="bg-brand py-10 min-h-[40vh] lg:min-h-[70vh] flex items-center justify-center">
                    <div className="flex justify-center">
                        <img src="./c.png" alt="" height={100} className="h-[14vw] animate-image-wave"
                            style={{ animationDelay: `${0 * 0.12}s` }} />
                        <img src="./h.png" alt="" height={100} className="h-[14vw] animate-image-wave"
                            style={{ animationDelay: `${1 * 0.12}s` }} />
                        <img src="./i.png" alt="" height={100} className="h-[14vw] animate-image-wave"
                            style={{ animationDelay: `${2 * 0.12}s` }} />
                        <img src="./m.png" alt="" height={100} className="h-[14vw] animate-image-wave"
                            style={{ animationDelay: `${3 * 0.12}s` }} />
                        <img src="./double.png" alt="" height={100} className="h-[14vw] animate-image-wave"
                            style={{ animationDelay: `${4 * 0.12}s` }} />
                        <img src="./c.png" alt="" height={100} className="h-[14vw] animate-image-wave"
                            style={{ animationDelay: `${5 * 0.12}s` }} />
                        <img src="./h.png" alt="" height={100} className="h-[14vw] animate-image-wave"
                            style={{ animationDelay: `${6 * 0.12}s` }} />
                        <img src="./u.png" alt="" height={100} className="h-[14vw] animate-image-wave"
                            style={{ animationDelay: `${7 * 0.12}s` }} />
                        <img src="./r.png" alt="" height={100} className="h-[14vw] animate-image-wave"
                            style={{ animationDelay: `${8 * 0.12}s` }} />
                        <img src="./r.png" alt="" height={100} className="h-[14vw] animate-image-wave"
                            style={{ animationDelay: `${9 * 0.12}s` }} />
                        <img src="./i.png" alt="" height={100} className="h-[14vw] animate-image-wave"
                            style={{ animationDelay: `${10 * 0.12}s` }} />
                    </div>

                    {/* <h1 className="text-white text-[13vw] font-bold uppercase text-center text-shadow-lg">Chimnchurri</h1> */}
                </div>
            </section>
        </>
    )
}

export default HeroSection