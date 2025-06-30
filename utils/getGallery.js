// utils/GetGallery.js
import { fetchImageData } from "./getImageData";

export const getGalleryBlockData = async (block) => {
  const rawData = block.attributes?.data || {};
  const galleryCount = Number(rawData.galleries) || 0;

  console.log("🧱 Données brutes du block:", rawData);
  console.log(`🔢 Nombre de galeries détectées: ${galleryCount}`);

  const galleries = [];

  for (let i = 0; i < galleryCount; i++) {
    const title = rawData[`galleries_${i}_title`] || `Galerie ${i + 1}`;
    const ids = rawData[`galleries_${i}_images`] || [];

    console.log(`📁 Galerie ${i} → Titre: ${title}, ${ids.length} image(s), IDs:`, ids);

    const images = await Promise.all(
      ids.map(async (id) => {
        const data = await fetchImageData(id);
        return {
          sourceUrl: data?.sourceUrl || "",
          altText: data?.altText || "",
          width: data?.mediaDetails?.width,
          height: data?.mediaDetails?.height,
        };
      })
    );

    galleries.push({ title, images });
  }

  console.log("✅ Résultat final galleries:", galleries);

  return {
    id: block.id,
    customId: rawData.blockcustomid || null,
    galleries,
  };
};
