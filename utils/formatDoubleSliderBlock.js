//NextJS/utils/formatDoubleSliderBlock.js

export const formatDoubleSliderBlock = (block) => {
  const data = block.attributes?.data || {};
  const count = parseInt(data.slides || data._slides || "0", 10);
  const slides = [];

  for (let i = 0; i < count; i++) {
    slides.push({
      title: data[`slides_${i}_title`],
      description: data[`slides_${i}_description`],
      backgroundImage: data[`slides_${i}_background_image`],
      contentImage: data[`slides_${i}_image`],
      link: data[`slides_${i}_link`],
    });
  }

  return slides;
};