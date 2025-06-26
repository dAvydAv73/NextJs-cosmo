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
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [index]);

  const animateSlide = (newIndex) => {
    const tl = gsap.timeline();

    const currentImg = contentImageRefs.current[index];
    const nextImg = contentImageRefs.current[newIndex];

    // Pré-positionner la future image pour qu’elle soit visible à droite avant l’anim
    if (nextImg) {
      gsap.set(nextImg, {
        x: "calc(100vw - 150px)",
        zIndex: 29,
      });
    }

    // Sortie image actuelle
    tl.to(currentImg, {
      x: "-150vw",
      duration: 1.2,
      ease: "none",
      zIndex: 28,
    }, 0);

    // Entrée image suivante
    tl.to(nextImg, {
      x: "60vw",
      duration: 1.2,
      ease: "none",
      zIndex: 30,
    }, 0);

    // Scroll vertical contenu + bg
    tl.to(bgRef.current, {
      y: `-${newIndex * 100}vh`,
      duration: 1.2,
      ease: "none",
    }, 0);

    tl.to(slideContentRef.current, {
      y: `-${newIndex * 100}vh`,
      duration: 1.2,
      ease: "none",
    }, 0);

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

      {/* Background & lignes */}
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

      {/* Texte + liens */}
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
                  <p className="mb-6 text-[#FAF5E9]">{slide.description}</p>
                  {slide.link?.url && (
                    <a
                      href={slide.link.url}
                      className="inline-block border px-8 py-2 text-xs tracking-widest bg-[#FAF5E9] text-[#7A6D64] uppercase"
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

      {/* Images flottantes en haut de pile */}
      {slides.map((slide, i) => {
        if (!slide.contentImage?.url) return null;

        const isActive = i === index;
        const isNext = i === index + 1;

        let transform = "translateY(-50%) translateX(150vw)";
        let zIndex = 10;

        if (isActive) {
          transform = "translateY(-50%) translateX(60vw)";
          zIndex = 30;
        } else if (isNext) {
          transform = "translateY(-50%) translateX(calc(100vw - 150px))";
          zIndex = 20;
        }

        return (
          <div
            key={`float-${i}`}
            className="absolute top-1/2 pointer-events-none transition-transform duration-700 ease-in-out"
            style={{
              width: "460px",
              transform,
              zIndex,
            }}
            ref={(el) => (contentImageRefs.current[i] = el)}
          >
            <Image
              src={slide.contentImage.url}
              alt={slide.contentImage.alt || ""}
              width={500}
              height={600}
              className="object-cover shadow-xl"
              priority={isActive}
            />
          </div>
        );
      })}

      {/* Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-6 z-40">
        <button onClick={handlePrev} disabled={index === 0} className="text-white disabled:opacity-30">
          ←
        </button>
        <button onClick={handleNext} disabled={index === slides.length - 1} className="text-white disabled:opacity-30">
          →
        </button>
      </div>
    </div>
  );
};
