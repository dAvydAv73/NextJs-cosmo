//nextJs/src/app/[locale]/[...slug]/page.js

import { BlockRenderer } from "../../../../components/BlockRenderer";
import { getPage } from "../../../../utils/getPage";
import { notFound } from "next/navigation";
import { getSeo } from "../../../../utils/getSeo";
import { locales } from "../../../i18n"; // ✅ à adapter selon ton projet
import { pageSlugs } from "../../../../utils/pageSlugs"; // ✅ ton nouveau fichie

export default async function Page({ params }) {
  const { locale, slug } = params;

  const uri = slug.join("/");

  console.log("→ Locale reçue :", locale);
  console.log("→ URI :", uri);

  const data = await getPage(uri, locale);
  console.log("→ Data reçue :", data);

  if (!data) notFound();

  return <BlockRenderer blocks={data} />;
}

export async function generateMetadata({ params }) {
  const { locale, slug } = params;
  const uri = slug.join("/");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

  try {
    const seo = await getSeo(uri, locale);

    const defaultTitle = "Cosmopolite by Chez Philippe | Genève";
    const defaultDescription = "";

    return {
      title: seo?.title || defaultTitle,
      description: seo?.metaDesc || defaultDescription,
      openGraph: {
        title: seo?.opengraphTitle || seo?.title || defaultTitle,
        description: seo?.opengraphDescription || seo?.metaDesc || defaultDescription,
        images: seo?.opengraphImage?.sourceUrl ? [{ url: seo.opengraphImage.sourceUrl }] : [],
        url: `${baseUrl}/${locale}/${uri}`,
        siteName: "Cosmopolite",
        locale,
        type: "website"
      },
      twitter: {
        card: "summary_large_image",
        title: seo?.opengraphTitle || seo?.title || defaultTitle,
        description: seo?.opengraphDescription || seo?.metaDesc || defaultDescription,
        images: seo?.opengraphImage?.sourceUrl ? [seo.opengraphImage.sourceUrl] : []
      },
      robots: {
        index: true,
        follow: true
      },
      additionalMetaTags: [
        { name: "googlebot", content: "index, follow" },
        { name: "robots", content: "noarchive" }
      ],
      alternates: {
        canonical: `${baseUrl}/${locale}/${uri}`,
        languages: {
          'x-default': baseUrl,
          ...Object.fromEntries(
            locales.map((lang) => [lang, `${baseUrl}/${lang}/${uri}`])
          )
        }
      }
    };
  } catch (error) {
    console.error("Error generating metadata for", uri, error);
    return {
      title: "Cosmopolite by Chez Philippe | Genève",
      description: ""
    };
  }
}


export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    pageSlugs.map((slug) => ({
      locale,
      slug: [slug],
    }))
  );
}