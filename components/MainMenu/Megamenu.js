// components/MainMenu/Megamenu.js
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

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

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
      className={`fixed inset-0 z-40 bg-[#FAF5E9] text-[#4C4442] flex items-center 
        transition-transform duration-500 ease-out 
        ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
    >
      <div className="container mx-auto grid grid-cols-12 gap-x-6 h-full">

        {/* Colonne gauche : menu principal */}
        <div className="col-span-6 flex items-center">
          <ul className="space-y-6 text-left text-5xl font-bold uppercase">
            {items.map((item, index) => (
              <li key={item.id} className="flex items-baseline">
                <span className="mr-4 text-lg font-light w-10">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Link
                  href={item.destination?.url || "#"}
                  className="transition-opacity duration-200 hover:opacity-60"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne droite : infos site */}
        <div className="col-span-6 px-10 py-8 relative overflow-y-auto flex items-center border-l border-[#0C0C0C]/30">
          <div className="w-full">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-3xl"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            {logo && (
              <div className="mb-16">
                <Image
                  src={logo}
                  alt="Le Cosmopolite Genève"
                  width={420}
                  height={200}
                />
              </div>
            )}

            <div className="space-y-12 text-sm">
              {titleFind && (
                <div>
                  <h4 className="uppercase font-bold text-2xl mb-2">
                    {titleFind}
                  </h4>
                  <p>{address}</p>
                </div>
              )}
              {titleContact && (
                <div>
                  <h4 className="uppercase font-bold text-2xl mb-2">
                    {titleContact}
                  </h4>
                  <p>
                    <a href={`mailto:${email}`} className="underline">
                      {email}
                    </a>
                  </p>
                </div>
              )}
              {titleFollow && settings.socialLinks?.length > 0 && (
                <div>
                  <h4 className="uppercase font-bold text-2xl mb-2">
                    {titleFollow}
                  </h4>
                  <div className="flex gap-4">
                    {settings.socialLinks.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-2xl"
                      >
                        {link.platform.toLowerCase() === "instagram" && (
                          <FontAwesomeIcon icon={faInstagram} />
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {noBookingText && (
                <div>
                  <h4 className="uppercase font-bold text-2xl mb-2">
                    {noBookingText}
                  </h4>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
