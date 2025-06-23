import React from "react";
import { getFontSizeForHeading, getTextAlign } from "../../utils/fonts";

export const Heading = ({ textAlign, content, level, textColor }) => {
  const tag = React.createElement(`h${level}`, {
    dangerouslySetInnerHTML: { __html: content },
    className: `max-w-5xl mx-auto my-6 opacity-80 ${getFontSizeForHeading(
      level
    )} ${getTextAlign(textAlign)}`,
    style: textColor ? { color: textColor } : {}
  });
  return tag;
};
