import { getTextAlign } from "../../utils/fonts";
import { relativeToAbsoluteUrls } from "../../utils/relativeToAbsoluteUrls";

export const Paragraph = ({ 
    textAlign = "left",
    content,
    textColor,
    customClasses = "", 
   }) => {
  // Vérifie si customClasses existe et n'est pas vide
  const hasCustomClasses = customClasses && customClasses.trim() !== '';
  
  return (
    <p
      className={`max-w-5xl mx-auto text-base opacity-90 text-justify ${
        hasCustomClasses ? '' : 'my-6'
      } ${getTextAlign(textAlign)} ${customClasses}`}
      style={{ color: textColor }}
      dangerouslySetInnerHTML={{ __html: relativeToAbsoluteUrls(content) }}
    />
  );
};