// assets
import { IconKey, IconUsers, IconApps, IconUserCircle, IconUserPlus } from '@tabler/icons';

// constant
const icons = {
  IconKey,
  IconUsers,
  IconApps,
  IconUserCircle,
  IconUserPlus
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
          icon: icons.IconUserCircle,
          children: [
            {
              id: 'allEmployee',
              title: 'All Employee',
              type: 'item',
              url: '/employee/table',
              icon: icons.IconUsers
            },
            {
              id: 'createEmployee',
              title: 'New Employee',
              type: 'item',
              url: '/employee/createEmployee',
              icon: icons.IconUserPlus
            },
            {
              id: 'department',
              title: ' Department',
              type: 'item',
              url: '/employee/department',
              icon: icons.IconApps
            }
          ]
        }
      ]
    };
  }

  return {};
};

export default getEmployee;
