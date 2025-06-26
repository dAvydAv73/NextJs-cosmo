import { slugMapEnToWp } from "./slugMap"; // 👈 mapping externe

export const getSeo = async (uri, locale = "fr") => {
  const language = locale.toUpperCase();

  let effectiveUri = uri;

  // Réécriture du slug côté EN si défini dans le mapping
  if (locale === "en" && slugMapEnToWp[uri]) {
    effectiveUri = slugMapEnToWp[uri];
  }

  const params = {
    query: `
      query SeoQuery($uri: String!, $language: LanguageCodeEnum!) {
        nodeByUri(uri: $uri, language: $language) {
          ... on Page {
            seo {
              title
              metaDesc
              opengraphTitle
              opengraphDescription
              opengraphImage {
                sourceUrl
              }
            }
          }
        }
      }
    `,
    variables: {
      uri: effectiveUri,
      language,
    },
  };

  const response = await fetch(process.env.WP_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const { data } = await response.json();
  if (!data?.nodeByUri) {
    return null;
  }
  return data.nodeByUri.seo;
};
