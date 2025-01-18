// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import dashboard from 'menu-items/dashboard';
import pages from 'menu-items/pages';
import getUtilities from 'menu-items/utilities';
// import labor from 'menu-items/labor';
// import externalWork from 'menu-items/externalwork';
import service from 'menu-items/service';
import getInvoice from 'menu-items/invoice';

import { useState, useEffect } from 'react';

const allowedRoles = ['MANAGER'];

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const [utilitiesMenu, setUtilitiesMenu] = useState(null);

  // Function to calculate utilities menu dynamically
  const calculateUtilities = () => {
    const roles = JSON.parse(localStorage.getItem('roles')) || [];
    if (roles.some((role) => allowedRoles.includes(role))) {
      return getUtilities(); // Only include utilities if roles contain allowedRoles
    }
    return null;
  };

  // Update utilitiesMenu state on initial load and when roles change
  useEffect(() => {
    setUtilitiesMenu(calculateUtilities());

    // Add a listener for storage changes (e.g., when localStorage is updated)
    const handleStorageChange = () => {
      setUtilitiesMenu(calculateUtilities());
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Combine all menu items dynamically
  const menuItems = [dashboard, pages, getInvoice(), service];
  if (utilitiesMenu) {
    menuItems.push(utilitiesMenu);
  }

  // Render menu items
  const navItems = menuItems.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            {/* Menu Items Error */}
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
