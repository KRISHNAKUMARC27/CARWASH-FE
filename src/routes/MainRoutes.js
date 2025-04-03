import { lazy } from 'react';
import PrivateRoute from 'auth/PrivateRoute'; // Import the PrivateRoute component

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

const CreateCard = Loadable(lazy(() => import('views/job/JobCardCreate')));
const AllJobs = Loadable(lazy(() => import('views/job/AllJobs')));
const JobCardUpdate = Loadable(lazy(() => import('views/job/JobCardUpdate')));
const JobCardFastCreate = Loadable(lazy(() => import('views/job/JobCardFastCreate')));

const AllSpares = Loadable(lazy(() => import('views/spares/AllSpares')));
const CreateSpares = Loadable(lazy(() => import('views/spares/SparesCreate')));
const SparesCategory = Loadable(lazy(() => import('views/spares/SparesCategory')));

const AllService = Loadable(lazy(() => import('views/service/AllService')));
const CreateService = Loadable(lazy(() => import('views/service/ServiceCreate')));
const ServiceCategory = Loadable(lazy(() => import('views/service/ServiceCategory')));

const AllInvoice = Loadable(lazy(() => import('views/invoice/AllInvoice')));
const CreditInvoice = Loadable(lazy(() => import('views/invoice/CreditInvoice')));
const AllInvoiceReceipt = Loadable(lazy(() => import('views/invoice/AllInvoiceReceipt')));
const InvoiceReports = Loadable(lazy(() => import('views/invoice/InvoiceReports')));

const AllEstimate = Loadable(lazy(() => import('views/estimate/AllEstimate')));
const CreditEstimate = Loadable(lazy(() => import('views/estimate/CreditEstimate')));
const AllEstimateReceipt = Loadable(lazy(() => import('views/estimate/AllEstimateReceipt')));
const EstimateReports = Loadable(lazy(() => import('views/estimate/EstimateReports')));

const AllEmployee = Loadable(lazy(() => import('views/employee/AllEmployee')));
const EmployeeCreate = Loadable(lazy(() => import('views/employee/EmployeeCreate')));
const Department = Loadable(lazy(() => import('views/employee/Department')));
const SettleSalary = Loadable(lazy(() => import('views/employee/SettleSalary')));

const MarkAttendance = Loadable(lazy(() => import('views/attendance/MarkAttendance')));
const AllAttendance = Loadable(lazy(() => import('views/attendance/AllAttendance')));
const AttendanceReports = Loadable(lazy(() => import('views/attendance/AttendanceReports')));

const AppointmentCreate = Loadable(lazy(() => import('views/appointment/AppointmentCreate')));
const AllAppointment = Loadable(lazy(() => import('views/appointment/AllAppointment')));

const AllExpense = Loadable(lazy(() => import('views/expense/AllExpense')));
const ExpenseCreate = Loadable(lazy(() => import('views/expense/ExpenseCreate')));
const ExpenseCategory = Loadable(lazy(() => import('views/expense/ExpenseCategory')));
const ExpenseReports = Loadable(lazy(() => import('views/expense/ExpenseReports')));

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: (
        <PrivateRoute allowedRoles={['MANAGER', 'ADMIN', 'JOBCARD', 'INVOICE', 'ESTIMATE']}>
          <JobCardUpdate />
        </PrivateRoute>
      )
    },
    {
      path: 'dashboard/default',
      element: (
        <PrivateRoute allowedRoles={['MANAGER', 'ADMIN', 'INVOICE', 'ESTIMATE']}>
          <DashboardDefault />
        </PrivateRoute>
      )
    },
    {
      path: 'card/table',
      element: (
        <PrivateRoute allowedRoles={['MANAGER', 'ADMIN', 'JOBCARD', 'INVOICE', 'ESTIMATE']}>
          <AllJobs />
        </PrivateRoute>
      )
    },
    {
      path: 'card/createFastCard',
      element: (
        <PrivateRoute allowedRoles={['MANAGER', 'ADMIN', 'JOBCARD', 'INVOICE', 'ESTIMATE']}>
          <JobCardFastCreate />
        </PrivateRoute>
      )
    },
    {
      path: 'card/createCard',
      element: (
        <PrivateRoute allowedRoles={['MANAGER', 'ADMIN', 'JOBCARD', 'INVOICE', 'ESTIMATE']}>
          <CreateCard />
        </PrivateRoute>
      )
    },
    {
      path: 'card/updateCard',
      element: (
        <PrivateRoute allowedRoles={['MANAGER', 'ADMIN', 'JOBCARD', 'INVOICE', 'ESTIMATE']}>
          <JobCardUpdate />
        </PrivateRoute>
      )
    },
    {
      path: 'spares/table',
      element: (
        <PrivateRoute allowedRoles={['MANAGER', 'ADMIN', 'SPARES']}>
          <AllSpares />
        </PrivateRoute>
      )
    },
    {
      path: 'spares/createSpares',
      element: (
        <PrivateRoute allowedRoles={['MANAGER', 'ADMIN', 'SPARES']}>
          <CreateSpares />
        </PrivateRoute>
      )
    },
    {
      path: 'spares/sparesCategory',
      element: (
        <PrivateRoute allowedRoles={['MANAGER', 'ADMIN', 'SPARES']}>
          <SparesCategory />
        </PrivateRoute>
      )
    },
    {
      path: 'service/table',
      element: (
        <PrivateRoute allowedRoles={['MANAGER', 'ADMIN', 'INVOICE', 'ESTIMATE']}>
          <AllService />
        </PrivateRoute>
      )
    },
    {
      path: 'service/createService',
      element: (
        <PrivateRoute allowedRoles={['MANAGER', 'ADMIN', 'INVOICE', 'ESTIMATE']}>
          <CreateService />
        </PrivateRoute>
      )
    },
    {
      path: 'service/serviceCategory',
      element: (
        <PrivateRoute allowedRoles={['MANAGER', 'ADMIN', 'INVOICE', 'ESTIMATE']}>
          <ServiceCategory />
        </PrivateRoute>
      )
    },
    {
      path: 'invoice/table',
      element: (
        <PrivateRoute allowedRoles={['MANAGER', 'ADMIN', 'INVOICE']}>
          <AllInvoice />
        </PrivateRoute>
      )
    },
    {
      path: 'invoice/creditInvoice',
      element: (
        <PrivateRoute allowedRoles={['MANAGER', 'ADMIN', 'INVOICE']}>
          <CreditInvoice />
        </PrivateRoute>
      )
    },
    {
      path: 'invoice/receipts',
      element: (
        <PrivateRoute allowedRoles={['MANAGER', 'ADMIN', 'INVOICE']}>
          <AllInvoiceReceipt />
        </PrivateRoute>
      )
    },
    {
      path: 'invoice/reports',
      element: (
        <PrivateRoute allowedRoles={['MANAGER', 'ADMIN', 'INVOICE']}>
          <InvoiceReports />
        </PrivateRoute>
      )
    },
    {
      path: 'estimate/table',
      element: (
        <PrivateRoute allowedRoles={['MANAGER', 'ADMIN', 'ESTIMATE']}>
          <AllEstimate />
        </PrivateRoute>
      )
    },
    {
      path: 'estimate/creditEstimate',
      element: (
        <PrivateRoute allowedRoles={['MANAGER', 'ADMIN', 'ESTIMATE']}>
          <CreditEstimate />
        </PrivateRoute>
      )
    },
    {
      path: 'estimate/receipts',
      element: (
        <PrivateRoute allowedRoles={['MANAGER', 'ADMIN', 'ESTIMATE']}>
          <AllEstimateReceipt />
        </PrivateRoute>
      )
    },
    {
      path: 'estimate/reports',
      element: (
        <PrivateRoute allowedRoles={['MANAGER', 'ADMIN', 'ESTIMATE']}>
          <EstimateReports />
        </PrivateRoute>
      )
    },
    {
      path: 'employee/table',
      element: (
        <PrivateRoute allowedRoles={['ADMIN']}>
          <AllEmployee />
        </PrivateRoute>
      )
    },
    {
      path: 'employee/createEmployee',
      element: (
        <PrivateRoute allowedRoles={['ADMIN']}>
          <EmployeeCreate />
        </PrivateRoute>
      )
    },
    {
      path: 'employee/department',
      element: (
        <PrivateRoute allowedRoles={['ADMIN']}>
          <Department />
        </PrivateRoute>
      )
    },
    {
      path: 'employee/settleSalary',
      element: (
        <PrivateRoute allowedRoles={['ADMIN']}>
          <SettleSalary />
        </PrivateRoute>
      )
    },
    {
      path: 'attendance/markAttendance',
      element: (
        <PrivateRoute allowedRoles={['ADMIN', 'MANAGER']}>
          <MarkAttendance />
        </PrivateRoute>
      )
    },
    {
      path: 'attendance/table',
      element: (
        <PrivateRoute allowedRoles={['ADMIN']}>
          <AllAttendance />
        </PrivateRoute>
      )
    },
    {
      path: 'attendance/reports',
      element: (
        <PrivateRoute allowedRoles={['ADMIN']}>
          <AttendanceReports />
        </PrivateRoute>
      )
    },
    {
      path: 'appointment/createAppointment',
      element: (
        <PrivateRoute allowedRoles={['ADMIN', 'MANAGER']}>
          <AppointmentCreate />
        </PrivateRoute>
      )
    },
    {
      path: 'appointment/table',
      element: (
        <PrivateRoute allowedRoles={['ADMIN', 'MANAGER']}>
          <AllAppointment />
        </PrivateRoute>
      )
    },
    {
      path: 'expense/table',
      element: (
        <PrivateRoute allowedRoles={['ADMIN', 'MANAGER']}>
          <AllExpense />
        </PrivateRoute>
      )
    },
    {
      path: 'expense/createExpense',
      element: (
        <PrivateRoute allowedRoles={['ADMIN', 'MANAGER']}>
          <ExpenseCreate />
        </PrivateRoute>
      )
    },
    {
      path: 'expense/expenseCategory',
      element: (
        <PrivateRoute allowedRoles={['ADMIN', 'MANAGER']}>
          <ExpenseCategory />
        </PrivateRoute>
      )
    },
    {
      path: 'expense/reports',
      element: (
        <PrivateRoute allowedRoles={['ADMIN', 'MANAGER']}>
          <ExpenseReports />
        </PrivateRoute>
      )
    }
  ]
};

export default MainRoutes;
