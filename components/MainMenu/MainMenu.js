"use client";

import React, { useState, useEffect } from "react";
import { ButtonLink } from "../ButtonLink";
import Image from "next/image";
import LogoIcon from "../../public/img/philippe_chevrier_officiel_logo.svg";
import LogoIconWhite from "../../public/img/philippe_chevrier_officiel_logo_white.svg";

import { LanguageSwitcher } from "../LanguageSwitcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useLocale } from "next-intl";



export const MainMenu = ({
  items,

}) => {
  const locale = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // État pour gérer l'ouverture du menu

  useEffect(() => {
    //console.log("Menu Items received:", items);
  }, [items]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 640) {
        const currentScrollY = window.scrollY;
        setIsScrolled(currentScrollY > 50);
      } else {
        setIsScrolled(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <div
        className={`navbar fixed left-0 right-0 bottom-0 sm:top-0 sm:bottom-auto z-30 transition-all duration-300 
        ${isScrolled 
          ? 'bg-neutral-50 border-t sm:border-b border-gray-300 shadow-md scrolled' 
          : 'bg-transparent border-t sm:border-b border-transparent'
        }
        h-[110px] sm:h-[140px]`}
      >
        <div className="container mx-auto px-5 flex items-center justify-between h-[110px] sm:h-[140px]">
          <div className="flex-1">
            <LanguageSwitcher />
          </div>
          <div
            className={`logoLink flex-3 transition-opacity duration-300 ${
              isScrolled ? "opacity-100" : "opacity-0"
            }`}
          >
            <a href="/" title="Philippe Chevrier - Home">
              <Image
                priority
                src={LogoIcon}
                height={90}
                width={260}
                className="w-logo-sm sm:w-logo-md lg:w-logo-lg h-auto"
                alt="Philippe Chevrier"
              />
            </a>
          </div>
          <div className="flex-1 flex justify-end items-center main-menu">
            {(items || []).map((item) => (
              <div key={item.id} className="relative group animate-slideLeft">
                <a
                  href={item.destination}
                  className={`p-5 block transition-colors duration-300 px-1 py-1 ${
                    isScrolled ? "text-[#4C4442]" : "text-white drop-shadow-md"
                  }`}
                >
                  {item.label}
                </a>
                {!!item.subMenuItems?.length && (
                  <div className="group-hover:block hidden bg-slate-800 text-right absolute right-0 top-full -mt-3">
                    {item.subMenuItems.map((subMenuItem) => (
                      <a
                        key={subMenuItem.id}
                        href={subMenuItem.destination}
                        className="block whitespace-nowrap p-5 hover:bg-slate-700 text-white"
                      >
                        {subMenuItem.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <button
              onClick={toggleMenu}
              className={`ml-4 text-2xl ${
                isScrolled ? "text-[#4C4442]" : "text-white"
              }`}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
        </div>
      </div>

      {/* Full-screen menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#4C4442] bg-opacity-95 z-40 flex flex-col items-center justify-center text-white">
          <button
            onClick={toggleMenu}
            className="absolute top-5 right-5 text-3xl text-white"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <Image
            src={LogoIconWhite}
            height={135}
            width={390}
            className="mb-16"
            alt="Philippe Chevrier"
          />
          <nav>
            <ul className="space-y-4 text-center text-base">
            {(items || []).map((item) => (
              <div key={item.id} className="relative group ">
                <a
                  href={item.destination?.url || '#'} // Ajout de la vérification
                  className={`p-5 block transition-colors duration-300 px-1 py-1 text-white uppercase font-lato tracking-wider"
                  }`}
                >
                  {item.label}
                </a>
                {item.subMenuItems?.length > 0 && (
                  <div className="group-hover:block hidden bg-slate-800 text-right absolute right-0 top-full -mt-3">
                    {item.subMenuItems.map((subMenuItem) => (
                      <a
                        key={subMenuItem.id}
                        href={subMenuItem.destination?.url || '#'}
                        className="block whitespace-nowrap p-5 hover:bg-slate-700 text-white"
                      >
                        {subMenuItem.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
};
