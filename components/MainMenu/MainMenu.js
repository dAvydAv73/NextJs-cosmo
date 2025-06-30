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
          className={`navbar fixed left-0 right-0 top-0 z-30 lg:h-[140px] h-[100px] transition-all duration-300 ${
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

          {/* Logo */}
          <div className="flex items-center justify-center h-full">
          <a href="/" className="block h-full flex items-center">
            <Image
              priority
              src={isHomePage ? LogoIconWhite : LogoIcon}
              alt="Le Cosmopolite"
              className="h-[60px] sm:h-[70px] lg:h-[80px] max-w-[220px] object-contain"
            />
          </a>
        </div>

          {/* Language switcher à droite */}
          <div className={`flex-1 flex justify-end items-center text-sm transition-colors duration-200 ${
            isHomePage ? "text-[#FAF5E9] sm:text-black" : "text-black"
          }`}>

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
