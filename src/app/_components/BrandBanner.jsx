"use client";

import { useEffect, useRef } from "react";

const WORD_1 = [
  { src: "/c.png", alt: "C" },
  { src: "/H.png", alt: "H" },
  { src: "/I.png", alt: "I" },
  { src: "/m.png", alt: "M" },
];

const WORD_2 = [
  { src: "/n.png", alt: "N" },
];

const WORD_3 = [
  { src: "/c.png", alt: "C" },
  { src: "/H.png", alt: "H" },
  { src: "/u.png", alt: "U" },
  { src: "/r.png", alt: "R" },
  { src: "/r.png", alt: "R" },
  { src: "/I.png", alt: "I" },
];

export default function BrandBanner() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("banner-visible");
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="brand-banner py-15 overflow-hidden lg:py-25 bg-brand" ref={sectionRef} id="brand-banner">

      <div className="banner-words flex justify-center">
        {/* CHIM */}
        <div className="banner-word flex">
          {WORD_1.map((letter, i) => (
            <img
              key={`w1-${i}`}
              src={letter.src}
              alt={letter.alt}
              className="banner-letter h-[10vw]"
              style={{ transitionDelay: `${i * 0.08}s` }}
              draggable={false}
            />
          ))}
        </div>

        {/* ' */}

        {/* N */}
        <div className="banner-word flex">
          {WORD_2.map((letter, i) => (
            <img
              key={`w2-${i}`}
              src={letter.src}
              alt={letter.alt}
              className="banner-letter h-[10vw] mx-4"
              style={{ transitionDelay: `${0.4 + i * 0.08}s` }}
              draggable={false}
            />
          ))}
        </div>

        {/* ' */}

        {/* CHURRI */}
        <div className="banner-word flex">
          {WORD_3.map((letter, i) => (
            <img
              key={`w3-${i}`}
              src={letter.src}
              alt={letter.alt}
              className="banner-letter h-[10vw]"
              style={{ transitionDelay: `${0.55 + i * 0.08}s` }}
              draggable={false}
            />
          ))}
        </div>
      </div>


    </section>
  );
}
