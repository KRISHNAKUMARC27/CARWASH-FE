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

const externalWork = {
  id: 'externalWork',
  title: 'ExternalWork',
  type: 'group',
  children: [
    {
      id: 'externalWork',
      title: 'External Work',
      type: 'collapse',
      icon: icons.IconIdBadge2,

      children: [
        {
          id: 'allLabor',
          title: 'All External Work',
          type: 'item',
          url: '/externalWork/table',
          icon: icons.IconTableExport
          //target: true
        },
        {
          id: 'createExternalWork',
          title: 'Add New External Work',
          type: 'item',
          url: '/externalWork/createExternalWork',
          icon: icons.IconTextPlus
          //target: true
        },
        {
          id: 'externalWorkCategory',
          title: 'External Work Category',
          type: 'item',
          url: '/externalWork/externalWorkCategory',
          icon: icons.IconTextPlus
          //target: true
        }
      ]
    }
  ]
};

export default externalWork;
