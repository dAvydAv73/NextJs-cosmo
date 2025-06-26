//nextJs/src/app/[locale]/[...slug]/page.js

import { BlockRenderer } from "../../../../components/BlockRenderer";
import { getPage } from "../../../../utils/getPage";
import { notFound } from "next/navigation";
import { getSeo } from "../../../../utils/getSeo";
import { locales } from "../../../i18n"; // ✅ à adapter selon ton projet
import { pageSlugs } from "../../../../utils/pageSlugs"; // ✅ ton nouveau fichie

export default async function Page({ params }) {
  const { locale, slug } = params;
  console.log('→ Locale reçue :', locale);

  const uri = slug.join("/");
  const data = await getPage(uri, locale); // ✅ locale transmise enfin correctement
  if (!data) notFound();

  return <BlockRenderer blocks={data} />;
}

export async function generateMetadata({ params }) {
  const { locale, slug } = params;
  const uri = slug.join("/");
  const seo = await getSeo(uri, locale);
  return {
    title: seo?.title || "",
    description: seo?.metaDesc || "",
  };
}

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    pageSlugs.map((slug) => ({
      locale,
      slug: [slug],
    }))
  );
}