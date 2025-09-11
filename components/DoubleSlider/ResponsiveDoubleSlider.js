//NextJs/components/DoubleSlider/ResponsiveDoubleSlider.js
"use client";

import { DoubleSlider } from "./DoubleSlider";
import { DoubleSliderMobile } from "./DoubleSliderMobile";
import { useMediaQuery } from "../../utils/useMediaQuery";

export const ResponsiveDoubleSlider = ({ slides }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Optionnel : gestion de l'état initial pendant le SSR (évite le flicker)
  if (typeof window !== "undefined" && slides.length === 0) return null;

  return isMobile ? (
    <DoubleSliderMobile slides={slides} />
  ) : (
    <DoubleSlider slides={slides} />
  );
};
