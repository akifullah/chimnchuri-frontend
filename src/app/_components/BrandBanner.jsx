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
        <section className="brand-banner" ref={sectionRef} id="brand-banner">
            <style>{`
        .brand-banner {
          position: relative;
          background: #0c0a09;
          overflow: hidden;
          padding: 60px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        /* Subtle warm gradient overlay */
        .brand-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center bottom, rgba(201, 169, 110, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Grain texture */
        .brand-banner::after {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
        }

        .banner-words {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          position: relative;
          z-index: 2;
          flex-wrap: wrap;
        }

        .banner-word {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .banner-letter {
          height: 80px;
          width: auto;
          object-fit: contain;
          opacity: 0;
          transform: translateY(30px) scale(0.8);
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          filter: drop-shadow(0 0 12px rgba(201, 169, 110, 0.3));
        }

        .banner-visible .banner-letter {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .banner-letter:hover {
          transform: translateY(-8px) scale(1.15) !important;
          filter: drop-shadow(0 0 20px rgba(201, 169, 110, 0.6));
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease;
        }

        .banner-apostrophe {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 4rem;
          color: #c9a96e;
          line-height: 1;
          margin: 0 -4px;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          text-shadow: 0 0 15px rgba(201, 169, 110, 0.4);
          user-select: none;
        }

        .banner-visible .banner-apostrophe {
          opacity: 1;
          transform: translateY(0);
        }

        /* Decorative divider */
        .banner-divider {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 700px;
          height: 3px;
          margin-top: 16px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(201, 169, 110, 0.1) 15%, 
            rgba(201, 169, 110, 0.6) 50%, 
            rgba(201, 169, 110, 0.1) 85%, 
            transparent 100%
          );
          border-radius: 2px;
        }

        /* Checkerboard-style decorative strip */
        .banner-strip {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin-top: 8px;
          overflow: hidden;
        }

        .strip-block {
          width: 28px;
          height: 14px;
          transition: background 0.3s ease;
        }

        .strip-block:nth-child(odd) {
          background: #c9a96e;
        }

        .strip-block:nth-child(even) {
          background: transparent;
          border: 1px solid rgba(201, 169, 110, 0.25);
        }

        /* Subtitle */
        .banner-subtitle {
          position: relative;
          z-index: 2;
          margin-top: 18px;
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 8px;
          text-transform: uppercase;
          color: rgba(201, 169, 110, 0.5);
          font-weight: 300;
        }

        @media (max-width: 768px) {
          .brand-banner {
            padding: 40px 16px;
          }

          .banner-letter {
            height: 55px;
          }

          .banner-apostrophe {
            font-size: 2.8rem;
          }

          .banner-words {
            gap: 16px;
          }

          .strip-block {
            width: 20px;
            height: 10px;
          }

          .banner-subtitle {
            font-size: 0.65rem;
            letter-spacing: 5px;
          }
        }

        @media (max-width: 480px) {
          .brand-banner {
            padding: 32px 12px;
          }

          .banner-letter {
            height: 42px;
          }

          .banner-apostrophe {
            font-size: 2.2rem;
          }

          .banner-words {
            gap: 12px;
          }

          .strip-block {
            width: 16px;
            height: 8px;
          }
        }
      `}</style>

            <div className="banner-words">
                {/* CHIM */}
                <div className="banner-word">
                    {WORD_1.map((letter, i) => (
                        <img
                            key={`w1-${i}`}
                            src={letter.src}
                            alt={letter.alt}
                            className="banner-letter"
                            style={{ transitionDelay: `${i * 0.08}s` }}
                            draggable={false}
                        />
                    ))}
                </div>

                {/* ' */}
                <span className="banner-apostrophe" style={{ transitionDelay: "0.35s" }}>&apos;</span>

                {/* N */}
                <div className="banner-word">
                    {WORD_2.map((letter, i) => (
                        <img
                            key={`w2-${i}`}
                            src={letter.src}
                            alt={letter.alt}
                            className="banner-letter"
                            style={{ transitionDelay: `${0.4 + i * 0.08}s` }}
                            draggable={false}
                        />
                    ))}
                </div>

                {/* ' */}
                <span className="banner-apostrophe" style={{ transitionDelay: "0.5s" }}>&apos;</span>

                {/* CHURRI */}
                <div className="banner-word">
                    {WORD_3.map((letter, i) => (
                        <img
                            key={`w3-${i}`}
                            src={letter.src}
                            alt={letter.alt}
                            className="banner-letter"
                            style={{ transitionDelay: `${0.55 + i * 0.08}s` }}
                            draggable={false}
                        />
                    ))}
                </div>
            </div>

            {/* Decorative gold line */}
            <div className="banner-divider" />

            {/* Checker strip */}
            <div className="banner-strip">
                {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="strip-block" />
                ))}
            </div>
        </section>
    );
}
