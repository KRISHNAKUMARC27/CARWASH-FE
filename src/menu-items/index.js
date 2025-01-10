import dashboard from './dashboard';
import pages from './pages';
import getUtilities from './utilities';
// import labor from './labor';
// import externalWork from './externalwork';
import service from './service';
//import other from './other';

// ==============================|| MENU ITEMS ||============================== //

// The below menu items is NOT USED.
const menuItems = {
  items: [dashboard, pages, service, getUtilities()]
};

export default menuItems;
