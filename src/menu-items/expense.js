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
const allowedRoles = ['ADMIN', 'MANAGER'];

const getExpense = () => {
  const roles = JSON.parse(localStorage.getItem('roles'));

  if (roles && roles.some((role) => allowedRoles.includes(role))) {
    return {
      id: 'expense',
      title: 'Expense',
      type: 'group',
      children: [
        {
          id: 'expense',
          title: 'Expense',
          type: 'collapse',
          icon: icons.IconCoinRupee,
          children: [
            {
              id: 'allExpense',
              title: 'All Expense',
              type: 'item',
              url: '/expense/table',
              icon: icons.IconLicense
            },
            {
              id: 'createExpense',
              title: 'New Expense',
              type: 'item',
              url: '/expense/createExpense',
              icon: icons.IconFileSymlink
            },
            {
              id: 'expenseCategory',
              title: 'Expense Category',
              type: 'item',
              url: '/expense/expenseCategory',
              icon: icons.IconCategory
              //target: true
            },
            {
              id: 'reports',
              title: 'Expense Reports',
              type: 'item',
              url: '/expense/reports',
              icon: icons.IconChartHistogram
            }
          ]
        }
      ]
    };
  }

  return {};
};

export default getExpense;
