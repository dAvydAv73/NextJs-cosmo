//utils/getSeo.js
export const getSeo = async (uri, locale = 'fr') => {
  const params = {
    query: `
      query PageSeo($uri: String!) {
        nodeByUri(uri: $uri) {
          ... on Page {
            seo {
              title
              metaDesc
              opengraphTitle
              opengraphDescription
              opengraphImage {
                sourceUrl
              }
              twitterTitle
              twitterDescription
              twitterImage {
                sourceUrl
              }
            }
            language {
              code
            }
            translations {
              uri
              language {
                code
              }
              ... on Page {
                seo {
                  title
                  metaDesc
                  opengraphTitle
                  opengraphDescription
                  opengraphImage {
                    sourceUrl
                  }
                  twitterTitle
                  twitterDescription
                  twitterImage {
                    sourceUrl
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: { uri }
  };

  const response = await fetch(process.env.WP_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params)
  });

  const { data } = await response.json();
  const node = data?.nodeByUri;

  if (!node) {
    console.warn(`[getSeo] No data found for URI: ${uri}`);
    return null;
  }

  const translation = node.translations.find(
    (t) => t.language.code.toLowerCase() === locale
  );
  const seo = translation?.seo || node.seo;

  if (!seo) {
    console.warn(`[getSeo] No SEO found for ${uri} (${locale})`);
    return null;
  }

  return {
    title: seo.title || null,
    metaDesc: seo.metaDesc || null,
    opengraph: {
      title: seo.opengraphTitle || seo.title,
      description: seo.opengraphDescription || seo.metaDesc,
      image: seo.opengraphImage?.sourceUrl || null
    },
    twitter: {
      title: seo.twitterTitle || seo.opengraphTitle || seo.title,
      description: seo.twitterDescription || seo.opengraphDescription || seo.metaDesc,
      image: seo.twitterImage?.sourceUrl || seo.opengraphImage?.sourceUrl || null
    }
  };
};
