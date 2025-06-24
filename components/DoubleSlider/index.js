"use client";
import { useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import Image from "next/image";

export const DoubleSlider = ({ slides }) => {
  const [index, setIndex] = useState(0);

  const bgRef = useRef(null);
  const slideContentRef = useRef(null);
  const contentBoxRefs = useRef([]);
  const contentImageRefs = useRef([]);

  // Initialisation des refs
  if (contentBoxRefs.current.length !== slides.length) {
    contentBoxRefs.current = Array(slides.length).fill(null);
  }
  if (contentImageRefs.current.length !== slides.length) {
    contentImageRefs.current = Array(slides.length).fill(null);
  }

  const [contentHeight, setContentHeight] = useState(0);

  useLayoutEffect(() => {
    const el = contentBoxRefs.current[index];
    if (el) {
      const timeout = setTimeout(() => {
        setContentHeight(el.offsetHeight);
      }, 650);
      return () => clearTimeout(timeout);
    }
  }, [index]);

  const animateSlide = (newIndex) => {
    const tl = gsap.timeline();

    const currentImg = contentImageRefs.current[index];
    const nextImg = contentImageRefs.current[newIndex];

    // Sortie à gauche
        tl.to(currentImg, {
        x: "-150vw", // bien au-delà de l’écran
        duration: 0.8,
        ease: "power2.inOut",
        }, 0);

    
        // Entrée depuis la droite
        if (nextImg) {
        gsap.set(nextImg, { x: "150vw" }); // start très à droite
        tl.to(nextImg, {
            x: "0vw", // recentré à gauche:[60vw], translateX[-50%] donc parfait
            duration: 0.8,
            ease: "power2.inOut",
        }, 0.1);
        }

    // Défilement vertical du background et contenu textuel
    tl.to(bgRef.current, {
      y: `-${newIndex * 100}vh`,
      duration: 0.6,
      ease: "power1.out",
    }, "<").to(slideContentRef.current, {
      y: `-${newIndex * 100}vh`,
      duration: 0.6,
      ease: "power1.out",
    }, "<");

    setIndex(newIndex);
  };

  const handleNext = () => {
    if (index < slides.length - 1) animateSlide(index + 1);
  };

  const handlePrev = () => {
    if (index > 0) animateSlide(index - 1);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden text-white">
      
      {/* BACKGROUND */}
      <div className="absolute top-0 left-0 w-2/3 h-full z-0 overflow-hidden">
        <div ref={bgRef} style={{ height: `${slides.length * 100}vh` }}>
          {slides.map((slide, i) => (
            <div
              key={`bg-${i}`}
              className="relative w-full h-screen bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.backgroundImage?.url})` }}
            >
              <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* LIGNES DÉCORATIVES */}
        {contentHeight > 0 && (
          <>
            {["top", "bottom"].map((pos) => (
              <div key={pos}>
                <div
                  className="absolute left-[calc(50%-400px)] w-px bg-white/40 z-20 pointer-events-none"
                  style={{ height: `calc(50vh - ${contentHeight / 2}px)`, [pos]: 0 }}
                />
                <div
                  className="absolute left-[calc(50%-80px)] w-px bg-white/40 z-20 pointer-events-none"
                  style={{ height: `calc(50vh - ${contentHeight / 2}px)`, [pos]: 0 }}
                />
              </div>
            ))}
          </>
        )}
      </div>

      {/* SLIDE TEXT CONTENT */}
      <div ref={slideContentRef} className="absolute inset-0 z-10">
        <div style={{ height: `${slides.length * 100}vh` }}>
          {slides.map((slide, i) => (
            <div key={`content-${i}`} className="h-screen flex items-center relative">
              <div className="container mx-auto px-5">
                <div
                  className="text-white max-w-md py-12"
                  ref={(el) => (contentBoxRefs.current[i] = el)}
                >
                  <h2 className="text-6xl font-bold mb-4 text-[#FAF5E9] uppercase">{slide.title}</h2>
                  <p className="mb-6 text-[#FAF5E9">{slide.description}</p>
                  {slide.link?.url && (
                    <a
                      href={slide.link.url}
                      className="inline-block border px-8 py-2 text-xs tracking-widest  bg-[#FAF5E9] text-[#7A6D64] uppercase"
                    >
                      {slide.link.title}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IMAGE FLOTTANTE HORS DU FLUX */}
      {slides.map((slide, i) => (
        slide.contentImage?.url && (
            <div
                key={`float-${i}`}
                className="absolute top-1/2 z-30 w-[460px] -translate-y-1/2 left-[60vw] -translate-x-1/2"
                ref={(el) => (contentImageRefs.current[i] = el)}
                >
                <Image
                    src={slide.contentImage.url}
                    alt={slide.contentImage.alt || ""}
                    width={460}
                    height={600}
                    className="object-cover shadow-xl w-full h-auto"
                    priority={i === 0}
                />
                </div>
        )
        ))}

      {/* NAVIGATION */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-6 z-40">
        <button
          onClick={handlePrev}
          disabled={index === 0}
          className="text-white disabled:opacity-30"
        >
          ←
        </button>
        <button
          onClick={handleNext}
          disabled={index === slides.length - 1}
          className="text-white disabled:opacity-30"
        >
          →
        </button>
      </div>
    </div>
  );
};
