// assets
import { IconKey, IconCalendar, IconTableExport, IconTextPlus, IconUserCheck } from '@tabler/icons';

// constant
const icons = {
  IconKey,
  IconCalendar,
  IconTableExport,
  IconTextPlus,
  IconUserCheck
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //
const allowedRoles = ['ADMIN', 'MANAGER'];

const getServicePackage = () => {
  const roles = JSON.parse(localStorage.getItem('roles'));

  if (roles && roles.some((role) => allowedRoles.includes(role))) {
    return {
      id: 'package',
      title: 'Package',
      type: 'group',
      children: [
        {
          id: 'package',
          title: 'Package',
          type: 'collapse',
          icon: icons.IconCalendar,
          children: [
            {
              id: 'createPackage',
              title: 'Create Package',
              type: 'item',
              url: '/package/createPackage',
              icon: icons.IconUserCheck
            },
            {
              id: 'allPackages',
              title: 'All Packages',
              type: 'item',
              url: '/package/table',
              icon: icons.IconTableExport
            }
          ]
        }
      ]
    };
  }

  return {};
};

export default getServicePackage;
