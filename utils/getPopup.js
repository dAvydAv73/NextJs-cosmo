// utils/getPopup.js
export const getPopup = async (locale = "fr") => {
  const query = `
    query PopUp {
      popUp {
        popup {
          enabled
          startDate
          endDate
          dismissDays
          showOn
          image { sourceUrl altText mediaDetails { width height } }
          fr { title subtitle description cta { enabled label url } }
          en { title subtitle description cta { enabled label url } }
        }
      }
    }
  `;

  try {
    const res = await fetch(process.env.WP_GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
      cache: "no-store",
    });

    // parse robuste + logs utiles
    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      console.error("[getPopup] Non-JSON response (first 300 chars):", text.slice(0, 300));
      return null;
    }

    const { data, errors } = json;
    if (errors?.length) {
      console.error("[getPopup] GraphQL errors:", JSON.stringify(errors, null, 2));
      return null;
    }

    const raw = data?.popUp?.popup;
    if (!raw) return null;

    const lang = locale === "en" ? raw.en : raw.fr;

    return {
      enabled: !!raw.enabled,
      startDate: raw.startDate || null,
      endDate: raw.endDate || null,
      dismissDays: Number(raw.dismissDays ?? 7),
      showOn: raw.showOn || "home",
      image: raw.image || null,
      content: {
        title: lang?.title || "",
        subtitle: lang?.subtitle || "",
        description: lang?.description || "",
        cta: {
          enabled: !!lang?.cta?.enabled,
          label: lang?.cta?.label || "",
          url: lang?.cta?.url || "",
        },
      },
    };
  } catch (e) {
    console.error("getPopup error", e);
    return null;
  }
};
