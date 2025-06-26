//PWA/utils/getPage.js
import { cleanAndTransformBlocks } from "./cleanAndTransformBlocks";
import { slugMapEnToWp } from "./slugMap"; 

export async function getPage(uri, locale = "fr") {
  const language = locale.toUpperCase();

  let effectiveUri = uri;

  // 🔁 si locale EN et un mapping existe, on réécrit l'uri
  if (locale === "en" && slugMapEnToWp[uri]) {
    effectiveUri = slugMapEnToWp[uri];
  }

  const params = {
    query: `
        query PageQuery($uri: String!, $language: LanguageCodeEnum!) {
          nodeByUri(uri: $uri) {
            ... on Page {
              blocks(postTemplate: false)
              translation(language: $language) {
                id
                title
                slug
                language {
                  code
                  slug
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


  try {
    const wpGraphqlUrl = process.env.WP_GRAPHQL_URL;

    if (!wpGraphqlUrl) {
      throw new Error("WP_GRAPHQL_URL is not defined");
    }

    const response = await fetch(wpGraphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const responseData = await response.json();
    const { data, errors } = responseData;

    if (errors) {
      console.error("GraphQL errors:", JSON.stringify(errors, null, 2));
      throw new Error("GraphQL query returned errors");
    }

    if (!data || !data.nodeByUri || !data.nodeByUri.blocks) {
      return null;
    }

    const blocks = cleanAndTransformBlocks(data.nodeByUri.blocks);
    return blocks;
  } catch (error) {
    console.error("Error in getPage:", error);
    throw error;
  }
}
