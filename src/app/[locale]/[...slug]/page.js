//nextJs/src/app/[locale]/[...slug]/page.js
// src/app/[locale]/[...slug]/page.js
import { BlockRenderer } from "@/components/BlockRenderer";
import { getPage } from "@/utils/getPage";
import { getSeo } from "@/utils/getSeo";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { locales } from "i18n";
import PopupModal from "@/components/Popup/PopupModal";
import { getPopup } from "@/utils/getPopup";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getBaseUrl() {
  if (typeof window === "undefined") {
    try {
      const headersList = headers();
      const host = headersList.get("x-forwarded-host") || headersList.get("host");
      const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
      return `${protocol}://${host}`;
    } catch (error) {}
  }
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
}

export default async function Page({ params }) {
  const { locale, slug } = params;
  const uri = slug.join("/");

  const [data, popup] = await Promise.all([
    getPage(uri, locale),
    getPopup(locale),
  ]);

  if (!data || !Array.isArray(data)) {
    console.warn("❌ Données invalides :", data);
    return <div>Page introuvable</div>;
  }

  return (
    <>
      <BlockRenderer blocks={data} />
      {popup?.enabled && popup.showOn === "all" && <PopupModal popup={popup} />}
    </>
  );
}

export async function generateMetadata({ params }) {
  const { locale, slug } = params;
  const uri = slug.join("/");
  const baseUrl = getBaseUrl();

  const seo = await getSeo(uri, locale);
  console.log("📦 SEO reçu (page):", uri, seo);

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
}

