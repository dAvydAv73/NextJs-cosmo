// components/Images2Block/Images2Block.js
"use client"
import React from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";

export const Images2Block = ({ image1, image2 }) => {
  // Création de deux observateurs distincts pour les images
  const { ref: ref1, inView: inView1 } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const { ref: ref2, inView: inView2 } = useInView({
    threshold: 0.3,
    triggerOnce: true,
    delay: 300, // Délai avant de commencer l'observation
  });

  return (
    <div className="relative w-full mx-auto py-4 px-4 images2blocks min-h-[600px]">
      <div className="relative grid grid-cols-12 gap-2">
        {/* Image 1 - Format paysage avec animation */}
        {image1 && (
          <div 
            ref={ref1}
            className="col-span-11 relative z-10 mt-24 transform transition-all duration-1000"
            style={{
              opacity: inView1 ? 1 : 0,
              transform: inView1 ? 'none' : 'translateY(100px)',
            }}
          >
            <div className="relative w-full aspect-[16/9] scale-125">
              <Image
                src={image1.url}
                alt={image1.alt || ""}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}
        
        {/* Image 2 - Format portrait avec animation décalée */}
        {image2 && (
          <div 
            ref={ref2}
            className="col-span-7 col-start-7 relative z-20 transform transition-all duration-1000"
            style={{
              opacity: inView2 ? 1 : 0,
              transform: inView2 ? 'none' : 'translateY(100px)',
              transitionDelay: '0.5s', // Délai supplémentaire pour l'animation
            }}
          >
            <div className="relative w-full aspect-[3/4] scale-125">
              <Image
                src={image2.url}
                alt={image2.alt || ""}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};