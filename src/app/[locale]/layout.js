//NextJs/src/app/[locale]/layout.js
import {NextIntlClientProvider} from 'next-intl';
import {unstable_setRequestLocale,getMessages} from 'next-intl/server';
import "../../../styles/globals.css";
import { getMenu } from "../../../utils/getMenu"; // Là sont récupéréés les données du menu
import { getWebsiteSettings } from '../../../utils/getWebsiteSettings';//import des données du site
import { MainMenu } from "../../../components/MainMenu";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import AppIntro from '../../../components/AppIntro/AppIntro.js'; 
import { Footer } from '../../../components/Footer';

config.autoAddCss = false;




export default async function RootLayout({ children, params }) {

  const locale = params.locale; // Correction de la destructuration
  const menuData = await getMenu(locale); // Récupération des données du menu
  const websiteSettings = await getWebsiteSettings(locale);

  // Set the locale for the request
  unstable_setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages(locale);

  // Détection de la homepage
  const isHomePage = params?.slug === undefined || params?.slug?.length === 0;

  return (
  <html lang={locale}>
    <body>
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
          <div
              id="content"
              className={`content ${isHomePage ? "is-home" : "not-home"}`}
            >
            {children}
          </div>
        </NextIntlClientProvider>
        {/*<Footer items={menuData.mainMenuItems} />*/}
      </AppIntro>
    </body>
  </html>
);
}

// Add this export to enable static rendering
export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }];
}