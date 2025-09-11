//NextJs/components/DoubleSlider/DoubleSliderMobile.js

"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

export const DoubleSliderMobile = ({ slides }) => {
  const [index, setIndex] = useState(0);

  const bgRef = useRef(null);
  const contentRef = useRef(null);

  const animateSlide = (newIndex) => {
    const tl = gsap.timeline();

    tl.to(bgRef.current, {
      x: `-${newIndex * 100}vw`,
      duration: 0.8,
      ease: "power2.inOut",
    }, 0);

    tl.to(contentRef.current, {
      x: `-${newIndex * 100}vw`,
      duration: 0.8,
      ease: "power2.inOut",
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

      
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
        <div
          ref={bgRef}
          className="flex h-full"
          style={{ width: `${slides.length * 100}vw` }}
        >
          {/* Trait vertical */}
            <div className="absolute left-2 top-0 w-px bg-white/40 z-20" style={{ height: "calc(100% - 280px)" }} />
          {slides.map((slide, i) => (
            <div
              key={`bg-${i}`}
              className="w-screen h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${slide.backgroundImage?.url})` }}
            >
              <div className="absolute inset-0 bg-black/30" />
            </div>
          ))}
        </div>
      </div>

      {/* Texte + image intégrés dans le flux */}
      <div
        ref={contentRef}
        className="absolute top-0 left-0 w-full h-full z-20 flex"
        style={{ width: `${slides.length * 100}vw` }}
      >
        {slides.map((slide, i) => (
          <div
            key={`content-${i}`}
            className="w-screen h-full flex flex-col justify-end items-start px-4 pb-24"
          >
            

            {/* Image de contenu alignée à gauche */}
            {slide.contentImage?.url && (
              <div className="w-[65%] max-w-[240px] mb-6 relative z-10">
                <Image
                  src={slide.contentImage.url}
                  alt={slide.contentImage.alt || ""}
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover rounded"
                  priority={i === index}
                />
              </div>
            )}

            {/* Texte aligné à gauche */}
            <div className="text-left max-w-[90%] text-[#FAF5E9] z-10">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold uppercase">
                  {slide.title}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={index === 0}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 border border-white text-white disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={index === slides.length - 1}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 border border-white text-white disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
              </div>
              <p className="mb-6 text-sm leading-snug line-clamp-4">
                {slide.description}
              </p>
              {slide.link?.url && (
                <a
                  href={slide.link.url}
                  className="inline-block border px-6 py-2 text-xs tracking-widest bg-[#FAF5E9] text-[#7A6D64] uppercase"
                >
                  {slide.link.title}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
