import React, { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { getRequest } from 'utils/fetchRequest';
import { Tabs, Tab, Typography, Grid, Button, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import MainCard from 'ui-component/cards/MainCard';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const PaymentsReports = () => {
  const [paymentsData, setPaymentsData] = useState({});

  const [tabValue, setTabValue] = useState(0);

  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day')); // Default: Last 7 days
  const [endDate, setEndDate] = useState(dayjs()); // Default: Today

  useEffect(() => {
    fetchPaymentsData('daily', dayjs().format('YYYY-MM-DD'));
  }, []);

  const fetchPaymentsData = async (type, param) => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/payments/report/${type}/${param}`;
      const data = await getRequest(url);
      setPaymentsData(data);
    } catch (err) {
      console.error('Error fetching payments data:', err);
    }
  };

  const fetchDateRangeData = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/payments/report/daterange?startDate=${startDate.format(
        'YYYY-MM-DD'
      )}&endDate=${endDate.format('YYYY-MM-DD')}`;
      const data = await getRequest(url);
      setPaymentsData(data);
    } catch (err) {
      console.error('Error fetching payments data:', err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);

    let param;
    const today = dayjs();
    const year = today.year();
    const month = today.month() + 1;
    const date = today.format('YYYY-MM-DD');
    const week = today.isoWeek();

    switch (newValue) {
      case 0:
        param = date;
        break;
      case 1:
        param = `${year}/${week}`;
        break;
      case 2:
        param = `${year}/${month}`;
        break;
      case 3:
        param = `${year}`;
        break;
      default:
        return;
    }

    fetchPaymentsData(newValue === 0 ? 'daily' : newValue === 1 ? 'weekly' : newValue === 2 ? 'monthly' : 'yearly', param);
  };

  const generateTotalPaymentsChart = () => {
    return {
      labels: ['Total Payments'],
      datasets: [
        {
          label: 'Total',
          data: [paymentsData.total || 0],
          backgroundColor: ['#3e95cd']
        }
      ]
    };
  };

  const generateByTypeChart = () => {
    const byType = paymentsData.byType || {};
    const labels = Object.keys(byType);
    const values = Object.values(byType);

    return {
      labels,
      datasets: [
        {
          label: 'Payments by Type',
          data: values,
          backgroundColor: labels.map(() => '#8e5ea2')
        }
      ]
    };
  };

  const generateByPaymentModeChart = () => {
    const byPayment = paymentsData.byPaymentMode || {};
    const labels = Object.keys(byPayment);
    const values = Object.values(byPayment);

    return {
      labels,
      datasets: [
        {
          label: 'By Payment Mode',
          data: values,
          backgroundColor: labels.map(() => '#3cba9f')
        }
      ]
    };
  };

  const generateByCreditOrNotChart = () => {
    const byPayment = paymentsData.isCredit || {};
    const labels = Object.keys(byPayment);
    const values = Object.values(byPayment);

    return {
      labels,
      datasets: [
        {
          label: 'Credit vs Regular',
          data: values,
          backgroundColor: labels.map(() => '#cdc741')
        }
      ]
    };
  };

  return (
    <MainCard title="Payments Report">
      <Grid container spacing={2}>
        {/* Date Range Pickers and Button */}
        <Grid item xs={12} sm={6} md={4}>
          <DatePicker label="Start Date" value={startDate} onChange={(newValue) => setStartDate(newValue)} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DatePicker label="End Date" value={endDate} onChange={(newValue) => setEndDate(newValue)} fullWidth />
        </Grid>
        <Grid item xs={12} md={4}>
          <Button fullWidth variant="contained" color="primary" onClick={() => fetchDateRangeData()}>
            Get Payments
          </Button>
        </Grid>

        {/* Tabs */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Payments
          </Typography>
          <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab label="Daily" />
            <Tab label="Weekly" />
            <Tab label="Monthly" />
            <Tab label="Yearly" />
          </Tabs>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6">Total Payments</Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <Doughnut data={generateTotalPaymentsChart()} />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6">By Type</Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <Bar data={generateByTypeChart()} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">By Payment Mode</Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <Bar data={generateByPaymentModeChart()} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Credit vs Regular payments</Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <Bar data={generateByCreditOrNotChart()} />
          </Box>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default PaymentsReports;
