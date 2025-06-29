// assets
import { IconKey, IconCar, IconTableExport, IconTextPlus, IconChartHistogram } from '@tabler/icons';

// constant
const icons = {
  IconKey,
  IconCar,
  IconTableExport,
  IconTextPlus,
  IconChartHistogram
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
      icon: icons.IconCar,

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
        },
        {
          id: 'reports',
          title: 'Service Reports',
          type: 'item',
          url: '/service/reports',
          icon: icons.IconChartHistogram
        }
      ]
    }
  ]
};

export default service;
