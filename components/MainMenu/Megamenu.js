// components/MainMenu/Megamenu.js
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

export const Megamenu = ({ items = [], onClose, settings }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsHiding(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  if (!settings) return null;

  const isFr = settings?.titleFindFr !== undefined;
  const titleFind = isFr ? settings.titleFindFr : settings.titleFindEn;
  const address = isFr ? settings.addressFr : settings.addressEn;
  const titleContact = isFr ? settings.titleContactFr : settings.titleContactEn;
  const email = isFr ? settings.emailFr : settings.emailEn;
  const titleFollow = isFr ? settings.titleFollowFr : settings.titleFollowEn;
  const noBookingText = isFr ? settings.noBookingTextFr : settings.noBookingTextEn;
  const logo = settings.logo || null;

  return (
    <div
      className={`fixed inset-0 z-[999] pointer-events-auto bg-[#FAF5E9] text-[#4C4442] flex items-center 
        transition-transform duration-500 ease-in-out 
        ${isVisible && !isHiding ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
    >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-x-6 h-full px-6 py-8 overflow-y-auto">

        {/* Mobile : Logo en haut */}
        {logo && (
          <div className="block md:hidden mb-8 mx-auto">
            <Image
              src={logo}
              alt="Le Cosmopolite Genève"
              width={200}
              height={100}
            />
          </div>
        )}

        {/* Colonne gauche : menu principal */}
        <div className="md:col-span-6 flex flex-col justify-center items-start space-y-6 md:space-y-8">
          <ul className="text-left text-3xl md:text-5xl font-bold uppercase">
            {items.map((item, index) => (
              <li key={item.id} className="mb-3 md:mb-4">
                <Link
                  href={item.destination?.url || "#"}
                  onClick={handleClose}
                  className="group flex items-baseline text-left transition-opacity duration-200 hover:text-[#B60032]"
                >
                  <span className="mr-4 text-base font-light w-10 inline-block">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne droite : infos site (et logo sur desktop) */}
        <div className="md:col-span-6 mt-12 md:mt-0 border-t md:border-t-0 md:border-l border-[#0C0C0C]/30 px-0 md:px-10 py-8 flex flex-col items-start justify-start text-sm space-y-8 md:space-y-10">
          {/* Logo desktop */}
          {logo && (
            <div className="hidden md:block mb-6">
              <Image
                src={logo}
                alt="Le Cosmopolite Genève"
                width={420}
                height={200}
              />
            </div>
          )}

          {titleFind && (
            <div>
              <h4 className="uppercase font-bold text-base md:text-2xl mb-1 md:mb-2">{titleFind}</h4>
              <p>
                <a 
                href="https://www.google.ch/maps/dir//Pl.+du+Molard+11,+1204+Gen%C3%A8ve,+Suisse/@46.2030913,6.1479932,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x478c652e96788399:0xfcb2c179f850282e!2m2!1d6.1479932!2d46.2030913?entry=ttu&g_ep=EgoyMDI1MDYwNC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                title="nous trouver sur Google Maps"
                className="underline hover:text-[#B60032] duration-200"
                >
                {address}
                </a>
              </p>
            </div>
          )}

          {titleContact && (
            <div>
              <h4 className="uppercase font-bold text-base md:text-2xl mb-1 md:mb-2">{titleContact}</h4>
              <p>
                <a href={`mailto:${email}`} className="underline hover:text-[#B60032] duration-200">
                  {email}
                </a>
              </p>
            </div>
          )}

          {titleFollow && settings.socialLinks?.length > 0 && (
            <div>
              <h4 className="uppercase font-bold text-base md:text-2xl mb-1 md:mb-2">{titleFollow}</h4>
              <div className="flex gap-4">
                {settings.socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl hover:text-[#B60032] duration-200"
                  >
                    {link.platform.toLowerCase() === "instagram" && (
                      <>
                        <FontAwesomeIcon icon={faInstagram} />
                        <span className="ml-2">@lecosmopolitegeneve</span>
                      </>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          {noBookingText && (
            <div>
              <h4 className="uppercase font-bold text-base md:text-2xl mb-1 md:mb-2">{noBookingText}</h4>
            </div>
          )}
        </div>

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-3xl z-50"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
};
