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
const allowedRoles = ['ESTIMATE'];

const getEstimate = () => {
  const roles = JSON.parse(localStorage.getItem('roles'));

  if (roles && roles.some((role) => allowedRoles.includes(role))) {
    return {
      id: 'estimate',
      title: 'Estimate',
      type: 'group',
      children: [
        {
          id: 'estimate',
          title: 'Estimate',
          type: 'collapse',
          icon: icons.IconIdBadge2,
          children: [
            {
              id: 'allEstimate',
              title: 'All Estimates',
              type: 'item',
              url: '/estimate/table',
              icon: icons.IconTableExport
            },
            {
              id: 'creditEstimate',
              title: 'Credit Estimate',
              type: 'item',
              url: '/estimate/creditEstimate',
              icon: icons.IconTextPlus
            },
            {
              id: 'receipts',
              title: ' Receipts',
              type: 'item',
              url: '/estimate/receipts',
              icon: icons.IconTextPlus
            }
          ]
        }
      ]
    };
  }

  return {};
};

export default getEstimate;
