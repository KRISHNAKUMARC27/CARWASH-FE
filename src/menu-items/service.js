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

const service = {
  id: 'service',
  title: 'Service',
  type: 'group',
  children: [
    {
      id: 'service',
      title: 'Service',
      type: 'collapse',
      icon: icons.IconIdBadge2,

      children: [
        {
          id: 'allService',
          title: 'All Service',
          type: 'item',
          url: '/service/table',
          icon: icons.IconTableExport
          //target: true
        },
        {
          id: 'createService',
          title: 'Add New Service',
          type: 'item',
          url: '/service/createService',
          icon: icons.IconTextPlus
          //target: true
        },
        {
          id: 'serviceCategory',
          title: 'Service Category',
          type: 'item',
          url: '/service/serviceCategory',
          icon: icons.IconTextPlus
          //target: true
        }
      ]
    }
  ]
};

export default service;
