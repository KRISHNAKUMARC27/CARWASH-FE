import dashboard from './dashboard';
import pages from './pages';
import getUtilities from './utilities';
// import labor from './labor';
// import externalWork from './externalwork';
import service from './service';
import getInvoice from './invoice';
import getEmployee from './employee';
import getAttendance from './attendance';
import getAppointment from './appointment';
import getExpense from './expense';
import getEstimate from './estimate';
import getFinancials from './financials';
//import other from './other';

// ==============================|| MENU ITEMS ||============================== //

// The below menu items is NOT USED.
const menuItems = {
  items: [
    dashboard,
    pages,
    getInvoice(),
    service,
    getUtilities(),
    getEmployee(),
    getAttendance(),
    getAppointment(),
    getExpense(),
    getEstimate(),
    getFinancials()
  ]
};

export default menuItems;
