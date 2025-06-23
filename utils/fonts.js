export const getTextAlign = (textAlign = "left") => {
  const textAlignMap = {
    left: "text-left",
    right: "text-right",
    center: "text-center",
  };

  return `${textAlignMap[textAlign] || ""}`;
};

export const getFontSizeForHeading = (level) => {
  const fontSizeMap = {
    1: "text-5xl sm:text-4xl md:text-5xl lg:text-6xl",  // Modèle de la première ligne
    2: "text-4xl sm:text-3xl md:text-4xl lg:text-5xl",
    3: "text-3xl sm:text-2xl md:text-3xl lg:text-4xl",
    4: "text-2xl sm:text-2xl md:text-3xl lg:text-3xl",
    5: "text-xl sm:text-xl md:text-2xl lg:text-2xl",
    6: "text-xl sm:text-xl md:text-xl lg:text-xl",
  };

  return `${fontSizeMap[level] || ""}`;
};
