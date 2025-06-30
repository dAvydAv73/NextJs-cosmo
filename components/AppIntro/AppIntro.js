// components/AppIntro/AppIntro.js
'use client';

import { useEffect, useRef, useState } from 'react';
import { DotLottie } from '@lottiefiles/dotlottie-web';

export default function AppIntro({ children }) {
  const canvasRef = useRef(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [revealSite, setRevealSite] = useState(false);
  const [fadeInSite, setFadeInSite] = useState(false);

  useEffect(() => {
    const alreadyPlayed = sessionStorage.getItem('cosmo_intro_played');

    if (alreadyPlayed) {
      setRevealSite(true);
      setFadeInSite(true);
      return;
    }

    const anim = new DotLottie({
      autoplay: true,
      loop: false,
      canvas: canvasRef.current,
      src: '/animations/intro0-5.lottie',
    });

    anim.addEventListener('complete', () => {
      setShowOverlay(true);
      setTimeout(() => {
        sessionStorage.setItem('cosmo_intro_played', 'true');
        setRevealSite(true);
        setTimeout(() => {
          setFadeInSite(true);
        }, 50);
      }, 600);
    });
  }, []);

  if (!revealSite) {
    return (
      <div className="fixed inset-0 z-50 bg-[#FAF5E9] text-[#796D64] flex items-center justify-center pointer-events-none appintro">
        <canvas
          ref={canvasRef}
          width="1219"
          height="859"
          className="w-[90vw] max-w-[600px] aspect-[1219/859] block"
        />
        {showOverlay && (
          <div className="absolute inset-0 bg-[#796D64] animate-fadeOverlay" />
        )}
      </div>
    );
  }

  return (
  <div
    className={`transition-opacity duration-700 ease-in ${
      fadeInSite ? 'opacity-100' : 'opacity-0'
    }`}
  >
    {children}
  </div>
);
}
