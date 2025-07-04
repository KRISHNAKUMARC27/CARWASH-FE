import React, { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { getRequest } from 'utils/fetchRequest';
import { Tabs, Tab, Typography, Grid, Button, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import MainCard from 'ui-component/cards/MainCard';
import { generateColors } from 'utils/UtilityMethods';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

ChartJS.register(CategoryScale, ArcElement, LinearScale, BarElement, Title, Tooltip, Legend);

const InvoiceReports = () => {
  const [invoiceData, setInvoiceData] = useState({});

  const [tabValue, setTabValue] = useState(0);

  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day')); // Default: Last 7 days
  const [endDate, setEndDate] = useState(dayjs()); // Default: Today

  useEffect(() => {
    fetchInvoiceData('daily', dayjs().format('YYYY-MM-DD'));
  }, []);

  const fetchInvoiceData = async (type, param) => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/invoice/report/${type}/${param}`;
      const data = await getRequest(url);
      setInvoiceData(data);
    } catch (err) {
      console.error('Error fetching invoice data:', err);
    }
  };

  const fetchDateRangeData = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/invoice/report/daterange?startDate=${startDate.format(
        'YYYY-MM-DD'
      )}&endDate=${endDate.format('YYYY-MM-DD')}`;
      const data = await getRequest(url);
      setInvoiceData(data);
    } catch (err) {
      console.error('Error fetching invoice data:', err);
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

    fetchInvoiceData(newValue === 0 ? 'daily' : newValue === 1 ? 'weekly' : newValue === 2 ? 'monthly' : 'yearly', param);
  };

  const generateTotalInvoiceChart = () => {
    return {
      labels: ['Total Invoice Amount'],
      datasets: [
        {
          label: 'Total',
          data: [invoiceData.total || 0],
          backgroundColor: ['#3e95cd']
        }
      ]
    };
  };

  const generateByPendingAmount = () => {
    return {
      labels: ['Total Credit Pending Amount'],
      datasets: [
        {
          label: 'Credit',
          data: [invoiceData.byCredit || 0],
          backgroundColor: ['#8e5ea2']
        }
      ]
    };
  };

  const generateByCreditOrNotJobs = () => {
    const byCredit = invoiceData.byCredit || {};
    const labels = Object.keys(byCredit);
    const values = Object.values(byCredit);
    const colors = generateColors(labels.length);

    return {
      labels,
      datasets: [
        {
          label: 'Credit/Not Jobs',
          data: values,
          backgroundColor: colors
        }
      ]
    };
  };

  return (
    <MainCard title="Invoice Report">
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
            Get Invoice
          </Button>
        </Grid>

        {/* Tabs */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Invoice
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
          <Typography variant="h6">Total Invoice Amount</Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <Doughnut data={generateTotalInvoiceChart()} />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6">Credit/Not Jobs</Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <Bar data={generateByCreditOrNotJobs()} />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6">By Credit Pending Amount</Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <Bar data={generateByPendingAmount()} />
          </Box>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default InvoiceReports;
