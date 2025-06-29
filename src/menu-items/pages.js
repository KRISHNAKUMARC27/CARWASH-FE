// assets
import { IconKey, IconClipboard, IconTableExport, IconClipboardPlus, IconEdit } from '@tabler/icons';

// constant
const icons = {
  IconKey,
  IconClipboard,
  IconTableExport,
  IconClipboardPlus,
  IconEdit
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
      icon: icons.IconClipboard,

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
          icon: icons.IconClipboard
          //target: true
        },
        {
          id: 'createCard',
          title: 'Create New Card',
          type: 'item',
          url: '/card/createCard',
          icon: icons.IconClipboardPlus
          //target: true
        },
        {
          id: 'updateCard',
          title: 'Update Job Card',
          type: 'item',
          url: '/card/updateCard',
          icon: icons.IconEdit
          //target: true
        }
      ]
    }
  ]
};

export default pages;
