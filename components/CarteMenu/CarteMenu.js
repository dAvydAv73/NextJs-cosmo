"use client";

import React, { useEffect, useState, useRef } from "react";

const slugify = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const scrollToId = (id, offset = 140) => {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: y, behavior: "smooth" });
};

// ... imports et fonctions identiques ...

const CarteMenu = ({ menus }) => {
  const [activeId, setActiveId] = useState(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    if (!menus || menus.length === 0) return;
    const sections = Object.values(sectionRefs.current);
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) setActiveId(visibleEntry.target.id);
      },
      {
        rootMargin: "-50% 0px -40% 0px",
        threshold: 0.1,
      }
    );

    sections.forEach((section) => section && observer.observe(section));
    return () => {
      sections.forEach((section) => section && observer.unobserve(section));
    };
  }, [menus]);

  if (!Array.isArray(menus)) return null;

  return (
    <div className="carte-menu px-4 pt-[30px] lg:pt-[40px] min-h-[100vh]">
      {/* Sticky Navigation */}
      <nav className="sticky top-[100px] lg:top-[140px] z-20 bg-[#FAF5E9] py-2 border-b border-gray-300">
        <ul className="container mx-auto flex flex-wrap gap-4 justify-center text-sm font-bold">
          {menus.map((menu, i) => {
            const slug = slugify(menu.title);
            const isActive = activeId === slug;
            return (
              <li key={i}>
                <button
                  onClick={() => scrollToId(slug, window.innerWidth < 1024 ? 100 : 140)}
                  className={`uppercase px-2 py-1 ${
                    isActive ? "text-[#B60032]" : "text-gray-700"
                  }`}
                >
                  {menu.title}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Content */}
      <div className="container mx-auto">
        {menus.map((menu, i) => {
          const slug = slugify(menu.title);
          return (
            <div
              key={i}
              id={slug}
              ref={(el) => (sectionRefs.current[slug] = el)}
              className="mb-12 pt-[100px]"
            >
              <h2 className="text-4xl font-bold mb-6 uppercase">{menu.title}</h2>

              {menu.sections.map((section, j) => (
                <div key={j} className="mb-10">
                  <h3 className="text-xl font-semibold mb-4 uppercase">{section.title}</h3>
                  <ul className="space-y-4">
                    {section.items.map((item, k) => (
                      <li
                        key={k}
                        className="grid grid-cols-12 gap-4 border-b pb-4"
                      >
                        <div className="col-span-11 sm:col-span-10">
                          <span className="block">{item.title}</span>
                          {item.description && (
                            <p className="text-sm text-gray-600">{item.description}</p>
                          )}
                          {item.accompagne && (
                            <p className="text-xs italic text-gray-400">{item.accompagne}</p>
                          )}
                        </div>
                        <div className="col-span-1 sm:col-span-2 flex justify-end items-end text-sm text-black whitespace-nowrap">
                          {item.price && <span>{item.price} .-</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Note sur les prix */}
              <p className="text-xs text-gray-500 italic mt-4 border-t pt-2">
                Prix en francs suisses / Prices in Swiss francs
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CarteMenu;
