import {NextIntlClientProvider} from 'next-intl';
import {unstable_setRequestLocale,getMessages} from 'next-intl/server';
import { Lato, Libre_Bodoni } from "next/font/google";
import "../../../styles/globals.css";
import { getMenu } from "../../../utils/getMenu"; // Une seule importation de getMenu
import { MainMenu } from "../../../components/MainMenu";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Footer } from '../../../components/Footer';

config.autoAddCss = false;

// Configuration pour les polices Google Fonts
const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
  variable: "--font-lato",
});

const libreBodoni = Libre_Bodoni({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-libre-bodoni",
});

export default async function RootLayout({ children, params }) {
  const locale = params.locale; // Correction de la destructuration
  const menuData = await getMenu(locale); // Récupération des données du menu

  // Set the locale for the request
  unstable_setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages(locale);

  return (
    <html lang={locale} className={`${lato.variable} ${libreBodoni.variable}`}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <MainMenu
            callToActionDestination={menuData.callToActionDestination}
            callToActionLabel={menuData.callToActionLabel}
            callToActionEmail={menuData.callToActionEmail}
            callToAction2Label={menuData.callToAction2Label}
            callToAction2Destination={menuData.callToAction2Destination}
            items={menuData.mainMenuItems}
          />
          <div className="content" id="content">
            {children}
          </div>
        </NextIntlClientProvider>
        <Footer items={menuData.mainMenuItems} />
      </body>
    </html>
  );
}

// Add this export to enable static rendering
export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }];
}