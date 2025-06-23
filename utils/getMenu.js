export const getMenu = async (locale = 'en') => {
  const params = {
    query: `
    query MenuQuery {
      acfOptionsMainMenu {
        mainMenu {
          enLang {
            menuItems {
              menuItem {
                destination {
                  url
                }
                label
              }
            }
          }
          frLang {
            menuItems {
              menuItem {
                destination {
                  url
                }
                label
              }
            }
          }
        }
      }
    }
    `
  };

  try {
    const response = await fetch(process.env.WP_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const { data } = await response.json();
    console.log("Raw API Response:", data);

    // Sélectionner les données selon la langue
    const langData = locale === 'en' 
      ? data.acfOptionsMainMenu.mainMenu.enLang.menuItems 
      : data.acfOptionsMainMenu.mainMenu.frLang.menuItems;

    const mappedItems = mapMainMenuItems(langData);
    //console.log("Mapped Menu Items:", mappedItems);

    return {
      mainMenuItems: mappedItems,
    };
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return {
      mainMenuItems: [],
    };
  }
};

export const mapMainMenuItems = (menuItems) => {
  if (!menuItems) return [];

  return menuItems.map(item => {
    const menuItem = item.menuItem;
    if (!menuItem || !menuItem.destination) return null;

    // Extraire le label de l'URL (vous pourriez vouloir ajouter le label dans votre requête GraphQL)
    const urlParts = menuItem.destination.url.split('/');
    const label = urlParts[urlParts.length - 2] || 'Home';

    return {
      id: crypto.randomUUID(),
      destination: menuItem.destination,
      label: menuItem.label,
      subMenuItems: []
    };
  }).filter(Boolean); // Enlever les items null
};