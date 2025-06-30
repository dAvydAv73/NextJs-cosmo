// utils/getImageData.js

export const fetchImageData = async (id) => {
  const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query {
          mediaItem(id: "${id}", idType: DATABASE_ID) {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
      `,
    }),
  });

  const json = await res.json();
  const item = json?.data?.mediaItem;

  if (!item?.sourceUrl) {
    console.warn(`⚠️ Aucune image trouvée pour ID ${id}`);
    return null;
  }

  // ✅ Construction de l'URL complète si nécessaire
  const baseUrl = process.env.NEXT_PUBLIC_WP_URL || "";
  const finalUrl = item.sourceUrl.startsWith("http")
    ? item.sourceUrl
    : `${baseUrl}${item.sourceUrl}`;

  return {
    sourceUrl: finalUrl,
    altText: item.altText || "",
    mediaDetails: item.mediaDetails || {},
  };
};
