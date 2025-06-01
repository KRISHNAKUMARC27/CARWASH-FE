// assets
import { IconLicense, IconChartHistogram, IconCoinRupee, IconFileSymlink, IconCategory } from '@tabler/icons';

// constant
const icons = {
  IconLicense,
  IconChartHistogram,
  IconCoinRupee,
  IconFileSymlink,
  IconCategory
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //
const allowedRoles = ['ADMIN'];

const getFinancials = () => {
  const roles = JSON.parse(localStorage.getItem('roles'));

  if (roles && roles.some((role) => allowedRoles.includes(role))) {
    return {
      id: 'financials',
      title: 'Financials',
      type: 'group',
      children: [
        {
          id: 'financials',
          title: 'Financials',
          type: 'collapse',
          icon: icons.IconCoinRupee,
          children: [
            {
              id: 'allPayments',
              title: 'All Payments',
              type: 'item',
              url: '/financials/table',
              icon: icons.IconLicense
            }
          ]
        }
      ]
    };
  }

  return {};
};

export default getFinancials;
