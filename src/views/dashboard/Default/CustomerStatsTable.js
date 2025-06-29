import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Grid, Button, Table, TableBody, TableHead, TableRow, TableCell } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getRequest } from 'utils/fetchRequest';
import MainCard from 'ui-component/cards/MainCard';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

const CustomerStatsTable = () => {
  const [data, setData] = useState({});

  const [tabValue, setTabValue] = useState(0);

  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day')); // Default: Last 7 days
  const [endDate, setEndDate] = useState(dayjs()); // Default: Today

  useEffect(() => {
    fetchData('daily', dayjs().format('YYYY-MM-DD'));
  }, []);

  const fetchData = async (type, param) => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/customerStats/report/${type}/${param}`;
      const data = await getRequest(url);
      setData(data);
    } catch (err) {
      console.error('Error fetching customerStats data:', err);
    }
  };

  const fetchDateRangeData = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/customerStats/report/daterange?startDate=${startDate.format(
        'YYYY-MM-DD'
      )}&endDate=${endDate.format('YYYY-MM-DD')}`;
      const data = await getRequest(url);
      setData(data);
    } catch (err) {
      console.error('Error fetching customerStats data:', err);
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

    fetchData(newValue === 0 ? 'daily' : newValue === 1 ? 'weekly' : newValue === 2 ? 'monthly' : 'yearly', param);
  };

  return (
    <MainCard title="Customer Stats">
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
            Get Customer Stats
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

        <Grid item xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Customer</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Top Service Spend{' '}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.maxGrandTotalByCustomer?.map((entry, index) => {
                const [name, total] = Object.entries(entry)[0];
                return (
                  <TableRow key={index}>
                    <TableCell>{name}</TableCell>
                    <TableCell align="right">{total}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Customer</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Visit Count
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.visitCountByCustomer?.map((entry, index) => {
                const [name, count] = Object.entries(entry)[0];
                return (
                  <TableRow key={index}>
                    <TableCell>{name}</TableCell>
                    <TableCell align="right">{count}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Customer</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Total Contribution by Customer
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.totalContributionByCustomer?.map((entry, index) => {
                const [name, count] = Object.entries(entry)[0];
                return (
                  <TableRow key={index}>
                    <TableCell>{name}</TableCell>
                    <TableCell align="right">{count}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default CustomerStatsTable;
