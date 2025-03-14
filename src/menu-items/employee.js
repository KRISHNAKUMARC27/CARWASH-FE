// assets
import { IconKey, IconUsers, IconApps, IconUserCircle, IconUserPlus, IconCoinRupee } from '@tabler/icons';

// constant
const icons = {
  IconKey,
  IconUsers,
  IconApps,
  IconUserCircle,
  IconUserPlus,
  IconCoinRupee
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
            },
            {
              id: 'settleSalary',
              title: ' Salary Settle',
              type: 'item',
              url: '/employee/settleSalary',
              icon: icons.IconCoinRupee
            }
          ]
        }
      ]
    };
  }

  return {};
};

export default getEmployee;
