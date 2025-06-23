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

  const slug = locale === 'en' ? "/home" : "/";
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

  const slug = locale === 'en' ? "/home" : "/";
 const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    
  try {
    const seo = await getSeo(slug);
    
    const alternateLanguages = locales.map(lang => ({
      hrefLang: lang,
      href: `${baseUrl}/${lang}` // Inclure toujours la langue dans l'URL, même pour la langue par défaut
    }));

    return {
      title: seo?.title || "Philippe Chevrier | Site Officiel",
      description: seo?.metaDesc || "",
      alternates: {
        canonical: `${baseUrl}/${locale}`, // Ajouter la locale ici aussi
        languages: {
          'x-default': baseUrl, // URL par défaut sans locale
          ...Object.fromEntries(alternateLanguages.map(({ hrefLang, href }) => [hrefLang, href]))
        }
      },
      openGraph: {
        title: seo?.opengraphTitle || seo?.title || "Philippe Chevrier | Site Officiel",
        description: seo?.opengraphDescription || seo?.metaDesc || "",
        url: `${baseUrl}/${locale}`, // Inclure la locale dans l'URL Open Graph
        siteName: 'Philippe Chevrier',
        images: seo?.opengraphImage?.sourceUrl ? [{ url: seo.opengraphImage.sourceUrl }] : [],
        locale: locale,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: seo?.opengraphTitle || seo?.title,
        description: seo?.opengraphDescription || seo?.metaDesc,
        images: seo?.opengraphImage?.sourceUrl ? [seo.opengraphImage.sourceUrl] : [],
      },
      // Balises meta pour les robots et Googlebot
      robots: {
        index: true, // true pour autoriser l'indexation, false pour l'interdire
        follow: true, // true pour suivre les liens, false pour l'interdire
      },
      additionalMetaTags: [
        {
          name: 'googlebot',
          content: 'index, follow', // Directive pour Googlebot
        },
        {
          name: 'robots',
          content: 'noarchive', // Directive pour éviter la mise en cache de la page
        }
      ]
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "Philippe Chevrier | Site Officiel",
      description: "",
    };
  }
}