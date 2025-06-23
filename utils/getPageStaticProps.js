import { gql } from "@apollo/client";
import client from "client";
import { cleanAndTransformBlocks } from "./cleanAndTransformBlocks";
import { mapMainMenuItems } from "./mapMainMenuItems";

export const getPageStaticProps = async (context) => {
  const uri = context.params?.slug ? `/${context.params.slug.join("/")}/` : "/";
  const language = context.locale || context.defaultLocale || 'en';
  const isEnglish = language === 'en';

  try{

    const { data } = await client.query({
      query: gql`
        query PageQuery($uri: String!, $language: LanguageCodeEnum!) {
          nodeByUri(uri: $uri) {
            ... on Page {
              id
              title
                  {
                name
                attributes {
                  ... on BlockAttributesUnion {
                    classesTailwind
                  }
                }
                innerBlocks {
                  name
                  attributes {
                    ... on BlockAttributesUnion {
                      classesTailwind
                    }
                  }
                }
              }
              featuredImage {
                node {
                  sourceUrl
                }
              }
              seo {
                title
                metaDesc
              }
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
          acfOptionsMainMenu {
            mainMenu {
              enLang {
                callToActionButton {
                  label
                  emaildestination
                }
                menuItems {
                  menuItem {
                    destination {
                      ... on Page {
                        slug
                        uri
                      }
                    }
                  }
                }
                callToActionButton2 {
                  url
                  label
                }
              }
              frLang {
                callToActionButton {
                  label
                  emaildestination
                }
                menuItems {
                  menuItem {
                    destination {
                      ... on Page {
                        slug
                        uri
                      }
                    }
                  }
                }
                callToActionButton2 {
                  url
                  label
                }
              }
            }
          }
        }
      `,
      variables: {
        uri,
        language: language.toUpperCase(),
      },
    });
    if (!data || !data.nodeByUri) {
      return { notFound: true };
    }
    
    const blocks = cleanAndTransformBlocks(data.nodeByUri.blocks);
    return {

      props: {
        language,
        translation: data.nodeByUri.translation
          ? {
              title: data.nodeByUri.translation.title,
              slug: data.nodeByUri.translation.slug,
              language: data.nodeByUri.translation.language,
            }
          : null,
        seo: data.nodeByUri.seo,
        title: data.nodeByUri.title,
        featuredImage: data.nodeByUri.featuredImage?.node?.sourceUrl || null,
        mainMenuItems: isEnglish
          ? mapMainMenuItems(data.acfOptionsMainMenu.mainMenu.enLang.menuItems)
          : mapMainMenuItems(data.acfOptionsMainMenu.mainMenu.frLang.menuItems),
        callToActionLabel: isEnglish
          ? data.acfOptionsMainMenu.mainMenu.enLang.callToActionButton.label
          : data.acfOptionsMainMenu.mainMenu.frLang.callToActionButton.label,
        callToAction2Label: isEnglish
        ? data.acfOptionsMainMenu.mainMenu.enLang.callToActionButton2.label
        : data.acfOptionsMainMenu.mainMenu.frLang.callToActionButton2.label,
        callToActionEmail: isEnglish
          ? data.acfOptionsMainMenu.mainMenu.enLang.callToActionButton.emaildestination
          : data.acfOptionsMainMenu.mainMenu.frLang.callToActionButton.emaildestination,
        callToAction2Destination: isEnglish
          ? data.acfOptionsMainMenu.mainMenu.enLang.callToActionButton2.url
          : data.acfOptionsMainMenu.mainMenu.frLang.callToActionButton2.url,
        blocks,
      },
    };
  } catch (error) {
    console.error("Error fetching page data:", error);
    return { notFound: true };
  }
};