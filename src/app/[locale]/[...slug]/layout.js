//NextJS/src/app/[locale]/[...slug]/layout.js
import { unstable_setRequestLocale } from 'next-intl/server';

export default function LocalePageLayout({ children, params }) {
  unstable_setRequestLocale(params.locale); // ✅ Obligatoire pour la résolution correcte

  const isHomePage = !params.slug || params.slug.length === 0;

  return (
    <div
      id="content"
      className={`content ${isHomePage ? "is-home" : "not-home"}`}
    >
      {children}
    </div>
  );
}
