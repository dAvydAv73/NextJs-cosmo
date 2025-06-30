//NextJs/src/app/[locale]/page.js
import { unstable_setRequestLocale } from 'next-intl/server';
import { BlockRenderer } from "../../../components/BlockRenderer";
import { getPage } from "../../../utils/getPage";
import { notFound } from "next/navigation";
import { getSeo } from "../../../utils/getSeo";
import { locales } from '../../i18n';

const defaultLocale = 'fr'; // Par exemple, si le français est votre langue par défaut

// Forcer le rendu dynamique
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home({ params: { locale } }) {
  console.log('Rendering Home component with locale:', locale);
  unstable_setRequestLocale(locale);

  const slug = locale === 'en' ? "/home" : "/accueil";


  console.log('Fetching page data for slug:', slug);

  try {
    const data = await getPage(slug);
    //console.log('Received page data:', JSON.stringify(data, null, 2));

    if (!data) {
      //console.log('No data received, calling notFound()');
      notFound();
    }

    if (!Array.isArray(data)) {
      console.error('Received data is not an array:', data);
      throw new Error('Invalid data format');
    }

    return <BlockRenderer blocks={data} />;
  } catch (error) {
    //console.error('Error in Home component:', error);
    throw error;
  }
}
export async function generateMetadata({ params: { locale } }) {
  unstable_setRequestLocale(locale);

  const slug = locale === 'en' ? "/home" : "/accueil";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

  try {
    const seo = await getSeo(slug, locale);

    const defaultTitle = "Cosmopolite by Chez Philippe | Genève";
    const defaultDescription = "";

    return {
      title: seo?.title || defaultTitle,
      description: seo?.metaDesc || defaultDescription,
      openGraph: {
        title: seo?.opengraph.title || defaultTitle,
        description: seo?.opengraph.description || defaultDescription,
        images: seo?.opengraph.image ? [{ url: seo.opengraph.image }] : [],
        url: `${baseUrl}/${locale}`,
        siteName: "Cosmopolite",
        locale,
        type: "website"
      },
      twitter: {
        card: "summary_large_image",
        title: seo?.twitter.title || defaultTitle,
        description: seo?.twitter.description || defaultDescription,
        images: seo?.twitter.image ? [seo.twitter.image] : []
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
  } catch (error) {
    console.error('Error generating metadata:', error);

    return {
      title: "Cosmopolite by Chez Philippe | Genève",
      description: ""
    };
  }
}


export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}