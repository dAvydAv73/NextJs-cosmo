//Components/SliderBlock/SliderBlock.js
"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export const SliderBlock = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!images || images.length === 0) {
    return <p>Aucune image disponible pour le slider.</p>;
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Images */}
      <div
        className="flex transition-transform duration-500 ease-in-out transform"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="flex-shrink-0 w-full">
            <img
              src={image.url}
              alt={image.alt || `Slide ${index + 1}`}
              className="w-full h-auto"
            />
          </div>
        ))}
      </div>

      {/* Navigation */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white  p-3 "
        aria-label="Previous Slide"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2  text-white  p-3 "
        aria-label="Next Slide"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};
