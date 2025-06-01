import { useEffect, useState } from 'react';

// material-ui
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Divider
} from '@mui/material';
import dayjs from 'dayjs';

// project imports
//import EarningCard from './EarningCard';
//import PopularCard from './PopularCard';
import TotalRevenueLineChartCard from './TotalRevenueLineChartCard';
import TotalJobsLineChartCard from './TotalJobsLineChartCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
//import TotalGrowthBarChart from './TotalGrowthBarChart';
import SparesEvents from './SparesEvents';
import { gridSpacing } from 'store/constant';
import TotalJobCardBarChart from './TotalJobCardBarChart';
import TotalJobCardRevenueBarChart from './TotalJobCardRevenueBarChart';
import TotalJobRevenueSplitBarChart from './TotalJobRevenueSplitBarChart';
// ==============================|| DEFAULT DASHBOARD ||============================== //
import { getRequest } from 'utils/fetchRequest';
import Loadable from 'ui-component/Loadable';
import { lazy } from 'react';
import TotalExpenseLineChartCard from './TotalExpenseLineChartCard';
const AppointmentCreate = Loadable(lazy(() => import('views/appointment/AppointmentCreate')));

const currentYear = dayjs().year();
const yearArray = Array.from({ length: 6 }, (_, i) => {
  const year = currentYear - i;
  return {
    value: year.toString(),
    label: year.toString()
  };
});

const Dashboard = () => {
  const [totalJobCards, setTotalJobCards] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  const [displayFlag, setDisplayFlag] = useState(false);
  const roles = JSON.parse(localStorage.getItem('roles') || '[]');

  const [appointment, setAppointment] = useState({});
  const [appointmentUpdateOpen, setAppointmentUpdateOpen] = useState(false);

  useEffect(() => {
    fetchTotalJobCardsData();
    fetchUpcomingAppointmentsData();
  }, []);

  const fetchTotalJobCardsData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/stats/totalJobCards');
      setTotalJobCards(data);
      setDisplayFlag(true);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchUpcomingAppointmentsData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/appointments/upcoming');
      setUpcomingAppointments(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleRowClick = (appointment) => {
    setAppointment(appointment);
    setAppointmentUpdateOpen(true);
  };

  const handleClose = () => {
    setAppointmentUpdateOpen(false);
  };

  const renderAppointmentsTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Appointment Date & Time</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Service</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {upcomingAppointments.map((appointment) => (
            <TableRow key={appointment.id} onClick={() => handleRowClick(appointment)} style={{ cursor: 'pointer' }}>
              <TableCell>{appointment.appointmentDateTime}</TableCell>
              <TableCell>{appointment.customerName}</TableCell>
              <TableCell>{appointment.phone}</TableCell>
              <TableCell>{appointment.service}</TableCell>
              <TableCell>{appointment.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <>
      <Grid container spacing={gridSpacing}>
        {upcomingAppointments.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h4">Upcoming Appointments</Typography>
            {renderAppointmentsTable()}
          </Grid>
        )}
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item lg={4} md={12} sm={12} xs={12}>
              <TotalJobsLineChartCard />
            </Grid>
            <Grid item lg={4} md={12} sm={12} xs={12}>
              <Grid container spacing={gridSpacing}>
                <Grid item sm={6} xs={12} md={6} lg={12}>
                  {displayFlag && <TotalIncomeLightCard totalJobCards={totalJobCards.total} name={'Total JobCards'} />}
                </Grid>
                <Grid item sm={6} xs={12} md={6} lg={12}>
                  {displayFlag && <TotalIncomeLightCard totalJobCards={totalJobCards.open} name={'Total Open JobCards'} />}
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={4} md={12} sm={12} xs={12}>
              <Grid container spacing={gridSpacing}>
                <Grid item sm={6} xs={12} md={6} lg={12}>
                  {displayFlag && <TotalIncomeLightCard totalJobCards={totalJobCards.closed} name={'Total Closed JobCards'} />}
                </Grid>
                <Grid item sm={6} xs={12} md={6} lg={12}>
                  {displayFlag && <TotalIncomeLightCard totalJobCards={totalJobCards.cancelled} name={'Total Cancelled JobCards'} />}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {roles.includes('ADMIN') && (
          <>
            <Grid item xs={12}>
              <Grid container spacing={gridSpacing}>
                <Grid item lg={4} md={12} sm={12} xs={12}>
                  <TotalRevenueLineChartCard />
                </Grid>
                <Grid item lg={4} md={12} sm={12} xs={12}>
                  <TotalExpenseLineChartCard />
                </Grid>
                <Grid item lg={4} md={12} sm={12} xs={12}></Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12} md={12}>
                  <TotalJobRevenueSplitBarChart yearArray={yearArray} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12} md={12}>
                  <TotalJobCardRevenueBarChart yearArray={yearArray} />
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={12}>
              <TotalJobCardBarChart yearArray={yearArray} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={12}>
              {/* <TotalGrowthBarChart isLoading={isLoading} /> */}
              <SparesEvents></SparesEvents>
            </Grid>
            {/* <Grid item xs={12} md={4}>
            <PopularCard isLoading={isLoading} />
          </Grid> */}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={12}>
              {renderAppointmentsTable()}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Dialog open={appointmentUpdateOpen} onClose={handleClose} aria-labelledby="data-row-dialog-title" fullWidth maxWidth="lg">
        <DialogContent dividers style={{ backgroundColor: 'white', color: 'black' }}>
          {' '}
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h2">{'Updating Appointment: ' + appointment.customerName}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <AppointmentCreate
                    data={appointment}
                    setAppointmentUpdateOpen={setAppointmentUpdateOpen}
                    fetchAllAppointmentData={fetchUpcomingAppointmentsData}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Dashboard;
