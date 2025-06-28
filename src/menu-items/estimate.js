// assets
import { IconKey, IconReceipt, IconTableExport, IconTextPlus, IconChartHistogram } from '@tabler/icons';

// constant
const icons = {
  IconKey,
  IconReceipt,
  IconTableExport,
  IconTextPlus,
  IconChartHistogram
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //
const allowedRoles = ['ESTIMATE', 'ADMIN', 'MANAGER'];

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
          icon: icons.IconReceipt,
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
            },
            {
              id: 'reports',
              title: 'Estimate Reports',
              type: 'item',
              url: '/estimate/reports',
              icon: icons.IconChartHistogram
            }
          ]
        }
      ]
    };
  }

  return {};
};

export default getEstimate;
