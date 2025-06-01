import React, { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { getRequest } from 'utils/fetchRequest';
import { Tabs, Tab, Typography, Grid, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import MainCard from 'ui-component/cards/MainCard';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

ChartJS.register(CategoryScale, ArcElement, LinearScale, BarElement, Title, Tooltip, Legend);

const ExpenseReports = () => {
  const [expenseData, setExpenseData] = useState({});

  const [tabValue, setTabValue] = useState(0);

  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day')); // Default: Last 7 days
  const [endDate, setEndDate] = useState(dayjs()); // Default: Today

  useEffect(() => {
    fetchExpenseData('daily', dayjs().format('YYYY-MM-DD'));
  }, []);

  const fetchExpenseData = async (type, param) => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/expense/report/${type}/${param}`;
      const data = await getRequest(url);
      setExpenseData(data);
    } catch (err) {
      console.error('Error fetching expense data:', err);
    }
  };

  const fetchDateRangeData = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/expense/report/daterange?startDate=${startDate.format(
        'YYYY-MM-DD'
      )}&endDate=${endDate.format('YYYY-MM-DD')}`;
      const data = await getRequest(url);
      setExpenseData(data);
    } catch (err) {
      console.error('Error fetching expense data:', err);
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

    fetchExpenseData(newValue === 0 ? 'daily' : newValue === 1 ? 'weekly' : newValue === 2 ? 'monthly' : 'yearly', param);
  };

  const generateTotalExpenseChart = () => {
    return {
      labels: ['Total Expense'],
      datasets: [
        {
          label: 'Total',
          data: [expenseData.total || 0],
          backgroundColor: ['#3e95cd']
        }
      ]
    };
  };

  const generateByTypeChart = () => {
    const byType = expenseData.byType || {};
    const labels = Object.keys(byType);
    const values = Object.values(byType);

    return {
      labels,
      datasets: [
        {
          label: 'Expense by Type',
          data: values,
          backgroundColor: labels.map(() => '#8e5ea2')
        }
      ]
    };
  };

  const generateByPaymentModeChart = () => {
    const byPayment = expenseData.byPaymentMode || {};
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

  return (
    <MainCard title="Expense Report">
      <Grid container spacing={2}>
        {/* Date Range Picker */}
        <Grid item lg={5} md={5} sm={5} xs={5}>
          <DatePicker label="Start Date" value={startDate} onChange={(newValue) => setStartDate(newValue)} />
        </Grid>
        <Grid item lg={5} md={5} sm={5} xs={5}>
          <DatePicker label="End Date" value={endDate} onChange={(newValue) => setEndDate(newValue)} />
        </Grid>
        <Grid item lg={2} md={2} sm={2} xs={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              fetchDateRangeData();
            }}
          >
            Get Expense
          </Button>
        </Grid>
        {/* Tabs for predefined filters */}
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Typography variant="h2">Expense</Typography>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Daily" />
            <Tab label="Weekly" />
            <Tab label="Monthly" />
            <Tab label="Yearly" />
          </Tabs>
        </Grid>

        {/* Chart */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6">Total Expense</Typography>
          <Doughnut data={generateTotalExpenseChart()} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6">By Payment Mode</Typography>
          <Bar data={generateByPaymentModeChart()} />
        </Grid>
        <Grid item xs={12} md={12}>
          <Typography variant="h6">By Type</Typography>
          <Bar data={generateByTypeChart()} />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default ExpenseReports;
