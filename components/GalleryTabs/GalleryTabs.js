// components/GalleryTabs/GalleryTabs.js
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";

const GalleryTabs = ({ galleries = [] }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const currentImages = galleries[activeTab]?.images || [];

  const handleKeyDown = (e) => {
    if (lightboxIndex === null) return;

    if (e.key === "Escape") {
      setLightboxIndex(null);
    } else if (e.key === "ArrowRight") {
      setLightboxIndex((prev) => (prev + 1) % currentImages.length);
    } else if (e.key === "ArrowLeft") {
      setLightboxIndex((prev) =>
        prev === 0 ? currentImages.length - 1 : prev - 1
      );
    }
  };

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex]);

  if (!galleries.length) return null;

  const breakpointColumns = {
    default: 3,
    1024: 2,
    640: 1,
  };

  return (
    <section className="py-6 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
            {galleries.map((gallery, index) => {
                const isActive = index === activeTab;
                const previewImg = gallery.images?.[0]?.sourceUrl;

                return (
                <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className="flex flex-col items-center focus:outline-none group"
                >
                    <div
                    className={`w-20 h-20 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                        isActive ? "border-[#B60032]" : "border-[#4C4442]"
                    }`}
                    >
                    {previewImg && (
                        <Image
                        src={previewImg}
                        alt={gallery.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        />
                    )}
                    </div>
                    <span
                    className={`mt-2 text-xs text-center transition-colors duration-200 font-semibold ${
                        isActive ? "text-[#B60032]" : "text-[#4C4442] "
                    }`}
                    >
                    {gallery.title}
                    </span>
                </button>
                );
            })}
            </div>


        {/* Masonry grid */}
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex gap-4"
          columnClassName="space-y-4"
        >
          {currentImages.map((img, idx) => (
            <div
              key={idx}
              className="overflow-hidden shadow cursor-pointer"
              onClick={() => setLightboxIndex(idx)}
            >
              <Image
                src={img.sourceUrl}
                alt={img.altText || `Image ${idx + 1}`}
                width={img.width || 600}
                height={img.height || 800}
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </Masonry>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <button
            className="absolute top-6 right-6 text-white text-3xl"
            onClick={() => setLightboxIndex(null)}
          >
            &times;
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(
                lightboxIndex === 0
                  ? currentImages.length - 1
                  : lightboxIndex - 1
              );
            }}
            className="absolute left-4 text-white text-4xl"
          >
            ‹
          </button>

          <Image
            src={currentImages[lightboxIndex].sourceUrl}
            alt={currentImages[lightboxIndex].altText || "Image"}
            width={1200}
            height={1200}
            className="max-h-[90vh] w-auto object-contain"
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex + 1) % currentImages.length);
            }}
            className="absolute right-4 text-white text-4xl"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
};

export default GalleryTabs;
