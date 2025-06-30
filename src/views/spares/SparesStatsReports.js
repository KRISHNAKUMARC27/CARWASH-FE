import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Tabs, Tab, Typography, Grid, Button, Box, Divider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import isoWeek from 'dayjs/plugin/isoWeek';
import MainCard from 'ui-component/cards/MainCard';
import { getRequest } from 'utils/fetchRequest';
import { generateColors } from 'utils/UtilityMethods';
import CategoryAccordion from 'views/utilities/CategoryAccordion';
dayjs.extend(isoWeek);

ChartJS.register(CategoryScale, ArcElement, LinearScale, BarElement, Title, Tooltip, Legend);

const SparesStatsReports = () => {
  const [jobSparesStatsData, setjobSparesStatsData] = useState({});

  const [tabValue, setTabValue] = useState(0);

  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day')); // Default: Last 7 days
  const [endDate, setEndDate] = useState(dayjs()); // Default: Today

  useEffect(() => {
    fetchJobServiceStatsData('daily', dayjs().format('YYYY-MM-DD'));
  }, []);

  const fetchJobServiceStatsData = async (type, param) => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/jobStats/spares/report/${type}/${param}`;
      const data = await getRequest(url);
      setjobSparesStatsData(data);
    } catch (err) {
      console.error('Error fetching jobSparesStats data:', err);
    }
  };

  const fetchDateRangeData = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/jobStats/spares/report/daterange?startDate=${startDate.format(
        'YYYY-MM-DD'
      )}&endDate=${endDate.format('YYYY-MM-DD')}`;
      const data = await getRequest(url);
      setjobSparesStatsData(data);
    } catch (err) {
      console.error('Error fetching jobSparesStats data:', err);
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

    fetchJobServiceStatsData(newValue === 0 ? 'daily' : newValue === 1 ? 'weekly' : newValue === 2 ? 'monthly' : 'yearly', param);
  };

  const generateCategoryToAmountChart = () => {
    const categoryToAmount = jobSparesStatsData.categoryToAmount || {};
    const labels = Object.keys(categoryToAmount).slice(0, 10);
    const values = Object.values(categoryToAmount).slice(0, 10);
    const colors = generateColors(labels.length);

    return {
      labels,
      datasets: [
        {
          label: 'Top 10 Revenue by Category',
          data: values,
          backgroundColor: colors
        }
      ]
    };
  };

  const generateCategoryToQtyChart = () => {
    const categoryToQty = jobSparesStatsData.categoryToQty || {};
    const labels = Object.keys(categoryToQty).slice(0, 10);
    const values = Object.values(categoryToQty).slice(0, 10);
    const colors = generateColors(labels.length);
    return {
      labels,
      datasets: [
        {
          label: 'Top 10 Qty by Category',
          data: values,
          backgroundColor: colors
        }
      ]
    };
  };

  const generateSparesLabourToAmountChart = () => {
    const sparesLabourToAmount = jobSparesStatsData.sparesLabourToAmount || {};
    const labels = Object.keys(sparesLabourToAmount).slice(0, 10);
    const values = Object.values(sparesLabourToAmount).slice(0, 10);
    const colors = generateColors(labels.length);

    return {
      labels,
      datasets: [
        {
          label: 'Top 10 Revenue by Category',
          data: values,
          backgroundColor: colors
        }
      ]
    };
  };

  const generateSparesLabourToQtyChart = () => {
    const sparesLabourToQty = jobSparesStatsData.sparesLabourToQty || {};
    const labels = Object.keys(sparesLabourToQty).slice(0, 10);
    const values = Object.values(sparesLabourToQty).slice(0, 10);
    const colors = generateColors(labels.length);
    return {
      labels,
      datasets: [
        {
          label: 'Top 10 Qty by Category',
          data: values,
          backgroundColor: colors
        }
      ]
    };
  };

  return (
    <MainCard title="Revenue from Spares Report">
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
            Get Service Data
          </Button>
        </Grid>

        {/* Tabs */}
        <Grid item xs={12}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab label="Daily" />
            <Tab label="Weekly" />
            <Tab label="Monthly" />
            <Tab label="Yearly" />
          </Tabs>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6">Qty by Category</Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <Doughnut data={generateCategoryToQtyChart()} />
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography variant="h6">Revenue by Category</Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <Doughnut data={generateCategoryToAmountChart()} />
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography variant="h6">Qty by Spares</Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <Doughnut data={generateSparesLabourToQtyChart()} />
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography variant="h6">Revenue by Spares</Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <Doughnut data={generateSparesLabourToAmountChart()} />
          </Box>
        </Grid>
        <Divider />
        <Divider />
        <Grid item xs={12} md={6}>
          <CategoryAccordion
            title="Max Qty by Category"
            jobTitle="Spares"
            data={jobSparesStatsData.maxQtyByCategory || {}}
            valueKey="qty"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CategoryAccordion
            title="Max Amount by Category"
            jobTitle="Spares"
            data={jobSparesStatsData.maxAmountByCategory || {}}
            valueKey="amount"
          />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default SparesStatsReports;
