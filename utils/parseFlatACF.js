
export function parseMenusFromFlatData(data) {
  const menus = [];

  if (!Array.isArray(data.menus)) return menus;

  data.menus.forEach((menuKey, menuIndex) => {
    const menu = {
      title: menuKey,
      sections: [],
    };

    const sectionCount = Number(data[`menus_${menuIndex}_sections`] || 0);
    for (let s = 0; s < sectionCount; s++) {
      const section = {
        title: data[`menus_${menuIndex}_sections_${s}_section_title`] || "",
        items: [],
      };

      const itemCount = Number(data[`menus_${menuIndex}_sections_${s}_items`] || 0);
      for (let i = 0; i < itemCount; i++) {
        section.items.push({
          title: data[`menus_${menuIndex}_sections_${s}_items_${i}_item_title`] || "",
          description: data[`menus_${menuIndex}_sections_${s}_items_${i}_item_description`] || "",
          price: data[`menus_${menuIndex}_sections_${s}_items_${i}_item_price`] || "",
          accompagne: data[`menus_${menuIndex}_sections_${s}_items_${i}_accompagne`] || "",
        });
      }

      menu.sections.push(section);
    }

    menus.push(menu);
  });

  return menus;
}
