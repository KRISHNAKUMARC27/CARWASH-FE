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

const getAppointment = () => {
  const roles = JSON.parse(localStorage.getItem('roles'));

  if (roles && roles.some((role) => allowedRoles.includes(role))) {
    return {
      id: 'appointment',
      title: 'Appointment',
      type: 'group',
      children: [
        {
          id: 'appointment',
          title: 'Appointment',
          type: 'collapse',
          icon: icons.IconIdBadge2,
          children: [
            {
              id: 'createAppointment',
              title: 'Create Appointment',
              type: 'item',
              url: '/appointment/createAppointment',
              icon: icons.IconUserCheck
            },
            {
              id: 'allAppointments',
              title: 'All Appointments',
              type: 'item',
              url: '/appointment/table',
              icon: icons.IconTableExport
            }
          ]
        }
      ]
    };
  }

  return {};
};

export default getAppointment;
