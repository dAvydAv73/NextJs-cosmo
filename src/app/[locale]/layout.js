//NextJs/src/app/[locale]/layout.js
import {NextIntlClientProvider} from 'next-intl';
import {unstable_setRequestLocale,getMessages} from 'next-intl/server';
import "../../../styles/globals.css";
import { getMenu } from "@/utils/getMenu"; // Là sont récupéréés les données du menu
import { getWebsiteSettings } from '@/utils/getWebsiteSettings';//import des données du site
import { MainMenu } from "@/components/MainMenu";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import AppIntro from '@/components/AppIntro/AppIntro.js'; 
import ContentWrapper from '@/components/ContentWrapper/ContentWrapper';
import Script from "next/script";

// importe ton listener
import GAListener from "@/components/GAListener"; // grâce à index.js

config.autoAddCss = false;

export default async function RootLayout({ children, params }) {
  const locale = params.locale;
  unstable_setRequestLocale(locale);

  const [menuData, websiteSettings, messages] = await Promise.all([
    getMenu(locale),
    getWebsiteSettings(locale),
    getMessages(locale),
  ]);

  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const isProd = process.env.NODE_ENV === "production";

  return (
    <html lang={locale}>
      <head>
        {isProd && GA_ID && (
          <>
            {/* Loader gtag */}
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            {/* Init + consent par défaut basique (modifiable si tu as un CMP) */}
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                // Consent Mode v2 par défaut, à ouvrir via ton bandeau si besoin
                gtag('consent', 'default', {
                    ad_storage: 'granted',
                    analytics_storage: 'granted',
                    ad_user_data: 'granted',
                    ad_personalization: 'granted'
                });
                gtag('config', '${GA_ID}', {
                  anonymize_ip: true,
                  send_page_view: false
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body>
        {/* écoute les changements d'URL côté client */}
        {isProd && GA_ID && <GAListener />}

        <AppIntro>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <MainMenu
              websiteSettings={websiteSettings}
              callToActionDestination={menuData.callToActionDestination}
              callToActionLabel={menuData.callToActionLabel}
              callToActionEmail={menuData.callToActionEmail}
              callToAction2Label={menuData.callToAction2Label}
              callToAction2Destination={menuData.callToAction2Destination}
              items={menuData.mainMenuItems}
            />
            <ContentWrapper>{children}</ContentWrapper>
          </NextIntlClientProvider>
        </AppIntro>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }];
}