// assets
import { IconKey, IconIdBadge2, IconTableExport, IconTextPlus, IconUserCheck } from '@tabler/icons';

// constant
const icons = {
  IconKey,
  IconIdBadge2,
  IconTableExport,
  IconTextPlus,
  IconUserCheck
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //
const allowedRoles = ['ADMIN', 'MANAGER'];

const getAttendance = () => {
  const roles = JSON.parse(localStorage.getItem('roles'));

  if (roles && roles.some((role) => allowedRoles.includes(role))) {
    return {
      id: 'attendance',
      title: 'Attendance',
      type: 'group',
      children: [
        {
          id: 'attendance',
          title: 'Attendance',
          type: 'collapse',
          icon: icons.IconIdBadge2,
          children: [
            {
              id: 'markAttendance',
              title: 'Mark Attendance',
              type: 'item',
              url: '/attendance/markAttendance',
              icon: icons.IconUserCheck
            },
            {
              id: 'allAttendance',
              title: 'All Attendance',
              type: 'item',
              url: '/attendance/table',
              icon: icons.IconTableExport
            },
            {
              id: 'reports',
              title: 'Reports',
              type: 'item',
              url: '/attendance/reports',
              icon: icons.IconTextPlus
            }
          ]
        }
      ]
    };
  }

  return {};
};

export default getAttendance;
