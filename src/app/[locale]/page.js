//NextJs/src/app/[locale]/page.js
// src/app/[locale]/page.js

import { unstable_setRequestLocale } from 'next-intl/server';
import { BlockRenderer } from "@/components/BlockRenderer";
import { getPage } from "@/utils/getPage";
import { getSeo } from "@/utils/getSeo";
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

export default async function Home({ params: { locale } }) {
  unstable_setRequestLocale(locale);

  const slug = locale === "en" ? "home" : "accueil";

  try {
    const [data, popup] = await Promise.all([
      getPage(slug),
      getPopup(locale),
    ]);
    console.log("POPUP DEBUG ->", JSON.stringify(popup, null, 2));

    if (!data || !Array.isArray(data)) {
      console.warn("❌ Données invalides :", data);
      return <div>Page introuvable</div>;
    }

    return (
      <>
        <BlockRenderer blocks={data} />
        {popup?.enabled && (popup.showOn === "home" || popup.showOn === "all") && (
          <PopupModal popup={popup} />
        )}
      </>
    );
  } catch (error) {
    console.error("❌ Erreur dans Home :", error);
    return <div>Erreur serveur</div>;
  }
}

export async function generateMetadata({ params: { locale } }) {
  const slug = locale === "en" ? "home" : "accueil";
  const baseUrl = getBaseUrl();

  const seo = await getSeo(slug, locale);
  console.log("📦 SEO reçu (home) :", seo);

  const defaultTitle = "Cosmopolite by Chez Philippe | Genève";
  const defaultDescription = "";

  return {
    title: seo?.title || defaultTitle,
    description: seo?.metaDesc || defaultDescription,
    openGraph: {
      title: seo?.opengraph?.title || defaultTitle,
      description: seo?.opengraph?.description || defaultDescription,
      images: seo?.opengraph?.image ? [{ url: seo.opengraph.image }] : [],
      url: `${baseUrl}/${locale}`,
      siteName: "Cosmopolite",
      locale,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.twitter?.title || defaultTitle,
      description: seo?.twitter?.description || defaultDescription,
      images: seo?.twitter?.image ? [seo.twitter.image] : []
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
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'x-default': baseUrl,
        ...Object.fromEntries(
          locales.map((lang) => [lang, `${baseUrl}/${lang}`])
        )
      }
    }
  };
}