// assets
import { IconKey, IconIdBadge2, IconTableExport, IconTextPlus } from '@tabler/icons';

// constant
const icons = {
  IconKey,
  IconIdBadge2,
  IconTableExport,
  IconTextPlus
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //
const allowedRoles = ['ADMIN'];

const getEmployee = () => {
  const roles = JSON.parse(localStorage.getItem('roles'));

  if (roles && roles.some((role) => allowedRoles.includes(role))) {
    return {
      id: 'employee',
      title: 'Employee',
      type: 'group',
      children: [
        {
          id: 'employee',
          title: 'Employee',
          type: 'collapse',
          icon: icons.IconIdBadge2,
          children: [
            {
              id: 'allEmployee',
              title: 'All Employee',
              type: 'item',
              url: '/employee/table',
              icon: icons.IconTableExport
            },
            {
              id: 'createEmployee',
              title: 'New Employee',
              type: 'item',
              url: '/employee/createEmployee',
              icon: icons.IconTextPlus
            },
            {
              id: 'department',
              title: ' Department',
              type: 'item',
              url: '/employee/department',
              icon: icons.IconTextPlus
            }
          ]
        }
      ]
    };
  }

  return {};
};

export default getEmployee;
