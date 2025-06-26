"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Megamenu } from "./Megamenu";
import LogoIcon from "../../public/img/le-cosmo_black.svg";
import LogoIconWhite from "../../public/img/le-cosmo_creme.svg";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useLocale } from "next-intl";

export const MainMenu = ({ items, websiteSettings }) => {
  const locale = useLocale();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10); // tu peux ajuster le seuil
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = pathname === "/" || pathname === `/${locale}`;

  return (
    <>
      <div
          className={`navbar fixed left-0 right-0 top-0 z-30 h-[140px] transition-all duration-300 ${
            isHomePage
              ? "bg-transparent"
              : `bg-[#FAF5E9] ${hasScrolled ? "shadow-md" : ""}`
          }`}
        >
        <div className="container mx-auto px-5 flex items-center justify-between h-full">
          {/* Megamenu icon à gauche */}
          <button
            onClick={toggleMenu}
            className={`text-2xl mr-4 transition-colors duration-200 ${
              isHomePage ? "text-[#FAF5E9]" : "text-black"
            }`}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>

          {/* Logo au centre */}
          <div className="logoLink flex justify-center">
            <a href="/" title="Accueil - Le Cosmopolite">
              <Image
                priority
                src={isHomePage ? LogoIconWhite : LogoIcon}
                height={90}
                width={260}
                className="w-logo-sm sm:w-logo-md lg:w-logo-lg h-auto"
                alt="Le Cosmopolite"
              />
            </a>
          </div>

          {/* Language switcher à droite */}
          <div className="flex-1 flex justify-end items-center text-sm text-black">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <Megamenu
          items={items}
          settings={websiteSettings}
          onClose={toggleMenu}
        />
      )}
    </>
  );
};
