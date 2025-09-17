// components/Popup/PopupModal.js
"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useLocale } from "next-intl";

const keyFromVersion = (startDate) =>
  `cosmoPopupDismissedUntil:${startDate || "v1"}`;

const isWithinWindow = (start, end) => {
  const now = Date.now();
  const s = start ? new Date(start).getTime() : null;
  const e = end ? new Date(end).getTime() : null;
  if (s && now < s) return false;
  if (e && now > e) return false;
  return true;
};

function formatDismiss(locale, n) {
  if (locale === "en") {
    return `Don’t show again for ${n} ${n > 1 ? "days" : "day"}`;
  }
  // FR
  return `Ne plus afficher pendant ${n} ${n > 1 ? "jours" : "jour"}`;
}

export default function PopupModal({ popup }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef(null);
  const locale = useLocale();

  const {
    enabled,
    startDate,
    endDate,
    dismissDays = 7,
    image,
    content,
  } = popup || {};

  const storageKey = useMemo(() => keyFromVersion(startDate), [startDate]);
  const dismissLabel = formatDismiss(locale, dismissDays);

  // Conditions d’ouverture
  useEffect(() => {
    if (!enabled) return;
    if (!isWithinWindow(startDate, endDate)) return;
    if (typeof window === "undefined") return;

    const until = window.localStorage.getItem(storageKey);
    if (until && Number(until) > Date.now()) return; // déjà “dismissed”
    setOpen(true);
  }, [enabled, startDate, endDate, storageKey]);

  // Scroll lock + ESC + focus
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);

    const firstFocusable = dialogRef.current?.querySelector(
      'button, a, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleClose = useCallback(() => {
    if (typeof window !== "undefined") {
      const until = Date.now() + dismissDays * 24 * 60 * 60 * 1000;
      window.localStorage.setItem(storageKey, String(until));
    }
    setOpen(false);
  }, [dismissDays, storageKey]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Fermer"
        onClick={handleClose}
        className="absolute inset-0 bg-black/60"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative mx-4 w-full max-w-[980px] shadow-xl overflow-hidden"
      >
        {/* Close */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Fermer la pop-up"
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center
                     bg-black/30 text-white md:bg-transparent md:text-black"
        >
          ✕
        </button>

        {/* Grille : image à gauche (desktop), contenu à droite */}
        <div className="grid grid-cols-1 md:grid-cols-[48%_52%] items-stretch">
          {/* Image mobile (carrée) */}
          <div className="md:hidden">
            <div className="relative w-full pt-[100%] bg-neutral-200">
              {image?.sourceUrl && (
                <img
                  src={image.sourceUrl}
                  alt={image.altText || ""}
                  className="absolute inset-0 w-full h-full object-cover"
                  width={image?.mediaDetails?.width}
                  height={image?.mediaDetails?.height}
                />
              )}
            </div>
          </div>

          {/* Image desktop (même hauteur que colonne texte) */}
          <div className="relative hidden md:block">
            {image?.sourceUrl ? (
              <img
                src={image.sourceUrl}
                alt={image.altText || ""}
                className="w-full h-full object-cover"
                width={image?.mediaDetails?.width}
                height={image?.mediaDetails?.height}
              />
            ) : (
              <div className="w-full h-full bg-neutral-200" />
            )}
          </div>

          {/* Colonne texte */}
          <div className="bg-[#FAF5E9] p-4 md:p-10 flex flex-col">
            {content?.subtitle && (
              <p className="uppercase tracking-[0.12em] text-sm text-neutral-600 mb-2 md:mb-4">
                {content.subtitle}
              </p>
            )}

            {content?.title && (
              <h3
                id="popup-title"
                className="text-2xl md:text-5xl font-extrabold mb-3 md:mb-6 uppercase"
              >
                {content.title}
              </h3>
            )}

            {content?.description && (
              <div
                className="prose max-w-none text-[13px] md:text-base leading-relaxed md:leading-7 mb-5
                           overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical]
                           [-webkit-line-clamp:4] md:[-webkit-line-clamp:5]"
                dangerouslySetInnerHTML={{ __html: content.description }}
              />
            )}

            <div className="mt-auto flex items-center">
              {content?.cta?.enabled &&
                content?.cta?.label &&
                content?.cta?.url && (
                  <a
                    href={content.cta.url}
                    className="inline-block border border-[#7A6D64] bg-[#7A6D64] text-[#FAF5E9]
                               px-5 py-2 text-[11px] md:text-[12px] tracking-[0.2em] md:tracking-[0.25em] uppercase"
                  >
                    {content.cta.label}
                  </a>
                )}
            </div>

            {/* Lien dismiss (i18n) */}
            <button
              type="button"
              onClick={handleClose}
              className="mt-3 self-start text-[11px] underline underline-offset-4 text-black/40 hover:text-black/60 transition"
            >
              {dismissLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
