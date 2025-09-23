// utils/getWebsiteSettings.js

export const getWebsiteSettings = async (locale = 'fr') => {
  const query = `
    query WebsiteSettings {
      websiteSettings {
        websiteSettings {
          enLang {
            addressEn
            emailEn
            noBookingTextEn
            titleContactEn
            titleFindEn
            titleFollowEn
            bookingUrlEn
          }
          frLang {
            addressFr
            emailFr
            noBookingTextFr
            titleContactFr
            titleFindFr
            titleFollowFr
            bookingUrlFr
          }
          logoDroit {
            sourceUrl
          }
          socialLinks {
            url
            icon
            platform
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(process.env.WP_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    const { data } = await response.json();
    const settings = data?.websiteSettings?.websiteSettings; // ✅ CORRIGÉ

    const langData = locale === 'en' ? settings.enLang : settings.frLang;

    return {
      ...langData,
      logo: settings.logoDroit?.sourceUrl || null,
      socialLinks: settings.socialLinks || []
    };
  } catch (error) {
    console.error('Error fetching website settings:', error);
    return {
      titleFindFr: '',
      addressFr: '',
      emailFr: '',
      logo: null,
      socialLinks: []
    };
  }
};
