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
const allowedRoles = ['INVOICE', 'ESTIMATE', 'ADMIN', 'MANAGER'];

const getUtilities = () => {
  const roles = JSON.parse(localStorage.getItem('roles'));

  if (roles && roles.some((role) => allowedRoles.includes(role))) {
    return {
      id: 'utilities',
      title: 'Spares',
      type: 'group',
      children: [
        {
          id: 'spares',
          title: 'Spares Inventory',
          type: 'collapse',
          icon: icons.IconIdBadge2,
          children: [
            {
              id: 'allSpares',
              title: 'All Spares',
              type: 'item',
              url: '/spares/table',
              icon: icons.IconTableExport
            },
            {
              id: 'createSpares',
              title: 'Add New Spares',
              type: 'item',
              url: '/spares/createSpares',
              icon: icons.IconTextPlus
            },
            {
              id: 'sparesCategory',
              title: 'Spares Category',
              type: 'item',
              url: '/spares/sparesCategory',
              icon: icons.IconTextPlus
            }
          ]
        }
      ]
    };
  }

  return {};
};

export default getUtilities;
