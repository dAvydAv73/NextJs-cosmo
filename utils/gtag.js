// src/lib/gtag.js
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url) => {
  if (!GA_ID || typeof window === "undefined") return;
  window.gtag?.("event", "page_view", {
    page_location: url,
  });
};

export const gaEvent = ({ action, category, label, value }) => {
  if (!GA_ID || typeof window === "undefined") return;
  window.gtag?.("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
};
