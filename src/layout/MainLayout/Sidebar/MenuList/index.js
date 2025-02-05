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
import getEmployee from 'menu-items/employee';

import { useEffect } from 'react';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  // const [adminMenu, setAdminMenu] = useState(null);
  //const [invoiceMenu, setInvoiceMenu] = useState(null);

  const calculateMenus = () => {
    const roles = JSON.parse(localStorage.getItem('roles')) || [];
    const dynamicMenus = [];

    if (roles.includes('INVOICE')) {
      dynamicMenus.push(getInvoice());
    }

    if (roles.includes('ADMIN')) {
      dynamicMenus.push(getEmployee());
    }

    return dynamicMenus;
  };

  // Function to calculate utilities menu dynamically
  // const calculateAdminMenu = () => {
  //   const roles = JSON.parse(localStorage.getItem('roles')) || [];
  //   if (roles.some((role) => ['ADMIN'].includes(role))) {
  //     return getEmployee(); // Only include utilities if roles contain allowedRoles
  //   }
  //   return null;
  // };
  // const calculateInvoiceMenu = () => {
  //   const roles = JSON.parse(localStorage.getItem('roles')) || [];
  //   if (roles.some((role) => ['INVOICE'].includes(role))) {
  //     return getInvoice(); // Only include utilities if roles contain allowedRoles
  //   }
  //   return null;
  // };

  // Update utilitiesMenu state on initial load and when roles change
  useEffect(() => {
    //setAdminMenu(calculateAdminMenu());
    //setInvoiceMenu(calculateInvoiceMenu());

    // Add a listener for storage changes (e.g., when localStorage is updated)
    const handleStorageChange = () => {
      //setAdminMenu(calculateUtilities());
      //   setInvoiceMenu(calculateInvoiceMenu());
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Combine all menu items dynamically
  const menuItems = [dashboard, pages, service, getUtilities(), ...calculateMenus()];
  // if (adminMenu) {
  //   menuItems.push(adminMenu);
  // }
  // if (invoiceMenu) {
  //   menuItems.push(invoiceMenu);
  // }

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
