import { BlockRenderer } from "components/BlockRenderer";
import { MainMenu } from "components/MainMenu";
import Head from "next/head";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';

export const Page = (props) => {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState(props.mainMenuItems);

  useEffect(() => {
    const determineLanguage = () => {
      console.log('router.asPath:', router.asPath, 'type:', typeof router.asPath);

      // Vérifiez d'abord l'URL
      if (typeof router.asPath === 'string') {
        const pathParts = router.asPath.split('/');
        console.log('pathParts:', pathParts);
        const pathLanguage = pathParts[1];
        if (pathLanguage === 'fr' || pathLanguage === 'en') {
          return pathLanguage;
        }
      } else {
        console.error('router.asPath is not a string:', router.asPath);
      }
      
      // Si l'URL ne contient pas la langue, vérifiez le cookie
      const cookieLanguage = getCookie('next_locale');
      console.log('cookieLanguage:', cookieLanguage);
      if (cookieLanguage) {
        return cookieLanguage;
      }
      
      // Par défaut, retournez 'en'
      return 'en';
    };

    const language = determineLanguage();
    console.log('Determined language:', language);
    
    // Sélectionnez les éléments du menu en fonction de la langue
    if (language === 'fr') {
      setMenuItems(props.mainMenuItemsFr);
    } else {
      setMenuItems(props.mainMenuItemsEn);
    }
  }, [router.asPath, props.mainMenuItemsFr, props.mainMenuItemsEn]);

  return (
    <div>
      <Head>
        <title>{props.seo.title}</title>
        <meta name="description" content={props.seo.metaDesc} />
      </Head>
      <MainMenu
        items={menuItems}
        callToActionEmail={props.callToActionEmail}
        callToActionLabel={props.callToActionLabel}
        callToAction2Label={props.callToAction2Label}
        callToAction2Destination={props.callToAction2Destination}
      />
      <BlockRenderer blocks={props.blocks} />
    </div>
  );
};