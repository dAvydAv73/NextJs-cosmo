//src/i18n.js
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['fr', 'en'];
export const defaultLocale = 'fr';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

// Si vous avez besoin de configurer le localePrefix, faites-le ici
export const localePrefix = 'always'; // ou 'as-needed'