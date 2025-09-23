// NextJs/components/MainMenu/index.js
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import { Megamenu } from "@/components/MainMenu/Megamenu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import LogoIcon from "@/public/img/le-cosmo_black.svg";
import LogoIconWhite from "@/public/img/le-cosmo_creme.svg";

export const MainMenu = ({ items = [], websiteSettings = {} }) => {
  const locale = useLocale();
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // garde ta logique : champs suffixés par langue
  const bookingUrl =
    locale === "fr"
      ? websiteSettings?.bookingUrlFr
      : websiteSettings?.bookingUrlEn;

  const bookingLabel = locale === "fr" ? "Réserver" : "Book now";

  const toggleMenu = () => setIsMenuOpen((s) => !s);

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // même détection que chez toi
  const isHomePage =
    pathname === "/" || pathname === `/${locale}` || pathname === `/${locale}/`;

  return (
    <>
      <div
        className={`navbar fixed left-0 right-0 top-0 z-30 lg:h-[140px] h-[100px] transition-all duration-300 ${
          isHomePage ? "bg-transparent" : `bg-[#FAF5E9] ${hasScrolled ? "shadow-md" : ""}`
        }`}
      >
        <div className="container mx-auto px-2 sm:px-5 lg:px-5 flex items-center justify-between h-full">
          {/* Burger à gauche */}
          <button
            onClick={toggleMenu}
            className={`text-2xl mr-2 lg:mr-4 transition-colors duration-200 ${
              isHomePage ? "text-[#FAF5E9]" : "text-black"
            }`}
            aria-label="Ouvrir le menu"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>

          {/* Logo (identique à ton sizing d’origine) */}
          <div className="flex items-center justify-center h-full">
            <a href="/" className="block h-full flex items-center" aria-label="Accueil">
              <Image
                priority
                src={isHomePage ? LogoIconWhite : LogoIcon}
                alt="Le Cosmopolite"
                className="h-[28px] sm:h-[70px] lg:h-[80px] max-w-[220px] object-contain"
              />
            </a>
          </div>

          {/* Zone droite : conserve ta couleur spéciale FR/EN */}
          <div
            className={`flex-1 flex justify-end items-center text-sm transition-colors duration-200 ${
              // 👇 on garde exactement ta règle : blanc sur home, noir en sm et ailleurs
              isHomePage ? "text-[#FAF5E9] sm:text-black" : "text-black"
            }`}
          >
            {bookingUrl && (
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-[#7A6D64] bg-[#7A6D64] text-[#FAF5E9] px-2 py-2 lg:px-5 text-[9px] md:text-[12px] tracking-[0.2em] md:tracking-[0.25em] uppercase mr-2"
                aria-label={bookingLabel}
              >
                {bookingLabel}
              </a>
            )}

            {/* Le LanguageSwitcher garde ses couleurs héritées comme avant */}
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <Megamenu items={items} settings={websiteSettings} onClose={toggleMenu} />
      )}
    </>
  );
};
