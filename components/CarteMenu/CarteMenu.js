"use client";

import React, { useEffect, useState, useRef } from "react";

const slugify = (str) =>
  str
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const CarteMenu = ({ menus }) => {
  const [activeId, setActiveId] = useState(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    if (!menus || menus.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          const id = visibleEntry.target.id;
          console.log("✅ Active section:", id);
          setActiveId(id);
        }
      },
      {
        rootMargin: "-45% 0px -50% 0px", // centre de l'écran
        threshold: 0.1,
      }
    );

    Object.values(sectionRefs.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      Object.values(sectionRefs.current).forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [menus]);

  if (!Array.isArray(menus)) return null;

  return (
    <div className="carte-menu px-4">
      {/* Navigation sticky */}
      <nav className="sticky lg:h-[140px] h-[100px] z-20 bg-[#FAF5E9] py-4 mb-6 border-b border-gray-300">
        <ul className="flex flex-wrap gap-4 justify-center text-sm font-bold">
          {menus.map((menu, i) => {
            const slug = slugify(menu.title);
            const isActive = activeId === slug;
            return (
              <li key={i}>
                <a
                  href={`#${slug}`}
                  className={`uppercase px-2 py-1 ${
                    isActive ? "text-[#B60032]" : "text-gray-700"
                  }`}
                >
                  {menu.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sections */}
      {menus.map((menu, i) => {
        const slug = slugify(menu.title);
        return (
          <div
            key={i}
            id={slug}
            ref={(el) => (sectionRefs.current[slug] = el)}
            className="mb-12 scroll-mt-[160px] min-h-[300px]"
          >
            <h2 className="text-4xl font-bold mb-4 uppercase">{menu.title}</h2>
            {menu.sections.map((section, j) => (
              <div key={j} className="mb-8">
                <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, k) => (
                    <li key={k} className="flex flex-col border-b pb-3">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.title}</span>
                        {item.price && <span>{item.price} .-</span>}
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-600">{item.description}</p>
                      )}
                      {item.accompagne && (
                        <p className="text-xs italic text-gray-400">
                          {item.accompagne}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default CarteMenu;
