// assets
import { IconKey, IconFileInvoice, IconTableExport, IconTextPlus, IconChartHistogram, IconCards } from '@tabler/icons';

// constant
const icons = {
  IconKey,
  IconFileInvoice,
  IconTableExport,
  IconTextPlus,
  IconChartHistogram,
  IconCards
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //
const allowedRoles = ['INVOICE', 'ADMIN', 'MANAGER'];

const getInvoice = () => {
  const roles = JSON.parse(localStorage.getItem('roles'));

  if (roles && roles.some((role) => allowedRoles.includes(role))) {
    return {
      id: 'invoice',
      title: 'Invoice',
      type: 'group',
      children: [
        {
          id: 'invoice',
          title: 'Invoice',
          type: 'collapse',
          icon: icons.IconFileInvoice,
          children: [
            {
              id: 'allInvoice',
              title: 'All Invoices',
              type: 'item',
              url: '/invoice/table',
              icon: icons.IconTableExport
            },
            {
              id: 'creditInvoice',
              title: 'Credit Invoice',
              type: 'item',
              url: '/invoice/creditInvoice',
              icon: icons.IconCards
            },
            {
              id: 'receipts',
              title: ' Receipts',
              type: 'item',
              url: '/invoice/receipts',
              icon: icons.IconTextPlus
            },
            {
              id: 'reports',
              title: 'Invoice Reports',
              type: 'item',
              url: '/invoice/reports',
              icon: icons.IconChartHistogram
            }
          ]
        }
      ]
    };
  }

  return {};
};

export default getInvoice;
