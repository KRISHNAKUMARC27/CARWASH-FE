// assets
import { IconKey, IconIdBadge2, IconTableExport, IconTextPlus } from '@tabler/icons';

// constant
const icons = {
  IconKey,
  IconIdBadge2,
  IconTableExport,
  IconTextPlus
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'Job Card',
  // caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'job',
      title: 'Job Card',
      type: 'collapse',
      icon: icons.IconIdBadge2,

      children: [
        {
          id: 'allJobs',
          title: 'All Jobs',
          type: 'item',
          url: '/card/table',
          icon: icons.IconTableExport
          //target: true
        },
        {
          id: 'createFastCard',
          title: 'Create Fast Card',
          type: 'item',
          url: '/card/createFastCard',
          icon: icons.IconTextPlus
          //target: true
        },
        {
          id: 'createCard',
          title: 'Create New Card',
          type: 'item',
          url: '/card/createCard',
          icon: icons.IconTextPlus
          //target: true
        },
        {
          id: 'updateCard',
          title: 'Update Job Card',
          type: 'item',
          url: '/card/updateCard',
          icon: icons.IconTextPlus
          //target: true
        }
      ]
    }
  ]
};

export default pages;
