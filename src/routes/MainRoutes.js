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

const AllSpares = Loadable(lazy(() => import('views/spares/AllSpares')));
const CreateSpares = Loadable(lazy(() => import('views/spares/SparesCreate')));
const SparesCategory = Loadable(lazy(() => import('views/spares/SparesCategory')));

const AllService = Loadable(lazy(() => import('views/service/AllService')));
const CreateService = Loadable(lazy(() => import('views/service/ServiceCreate')));
const ServiceCategory = Loadable(lazy(() => import('views/service/ServiceCategory')));

const AllInvoice = Loadable(lazy(() => import('views/invoice/AllInvoice')));
const CreditInvoice = Loadable(lazy(() => import('views/invoice/CreditInvoice')));
const AllInvoiceReceipt = Loadable(lazy(() => import('views/invoice/AllInvoiceReceipt')));

const AllEmployee = Loadable(lazy(() => import('views/employee/AllEmployee')));
const EmployeeCreate = Loadable(lazy(() => import('views/employee/EmployeeCreate')));
const Department = Loadable(lazy(() => import('views/employee/Department')));
const MarkAttendance = Loadable(lazy(() => import('views/attendance/MarkAttendance')));
const AllAttendance = Loadable(lazy(() => import('views/attendance/AllAttendance')));
const AttendanceReports = Loadable(lazy(() => import('views/attendance/AttendanceReports')));

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
    }
  ]
};

export default MainRoutes;
