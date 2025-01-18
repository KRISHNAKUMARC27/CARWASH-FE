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
const allowedRoles = ['INVOICE'];

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
          icon: icons.IconIdBadge2,
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
              icon: icons.IconTextPlus
            }
          ]
        }
      ]
    };
  }

  return {};
};

export default getInvoice;
