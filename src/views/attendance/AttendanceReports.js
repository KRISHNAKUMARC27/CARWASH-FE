import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { getRequest } from 'utils/fetchRequest';
import { Tabs, Tab, Typography, Grid, Button, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import MainCard from 'ui-component/cards/MainCard';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AttendanceReports = () => {
  const [attendanceData, setAttendanceData] = useState({});
  const [leaveData, setLeaveData] = useState({});
  const [workingDaysData, setWorkingDaysData] = useState({});

  const [tabValue, setTabValue] = useState(0);
  // const [leaveTabValue, setLeaveTabValue] = useState(0);
  // const [workingDaysTabValue, setWorkingDaysTabValue] = useState(0);

  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day')); // Default: Last 7 days
  const [endDate, setEndDate] = useState(dayjs()); // Default: Today

  useEffect(() => {
    fetchAttendanceData('daily', dayjs().format('YYYY-MM-DD'));
    fetchWorkingDaysData('daily', dayjs().format('YYYY-MM-DD'));
    fetchLeaveData('daily', dayjs().format('YYYY-MM-DD'));
  }, []);

  const fetchAttendanceData = async (type, param) => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/employee/attendance/${type}/${param}`;
      const data = await getRequest(url);
      setAttendanceData(data);
    } catch (err) {
      console.error('Error fetching attendance data:', err);
    }
  };

  const fetchWorkingDaysData = async (type, param) => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/employee/attendance/day/${type}/${param}`;
      const data = await getRequest(url);
      setWorkingDaysData(data);
    } catch (err) {
      console.error('Error fetching working days data:', err);
    }
  };

  const fetchLeaveData = async (type, param) => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/employee/leave/${type}/${param}`;
      const data = await getRequest(url);
      setLeaveData(data);
    } catch (err) {
      console.error('Error fetching leave data:', err);
    }
  };

  const fetchLeaveDateRangeData = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/employee/leave/daterange?startDate=${startDate.format(
        'YYYY-MM-DD'
      )}&endDate=${endDate.format('YYYY-MM-DD')}`;
      const data = await getRequest(url);
      setLeaveData(data);
    } catch (err) {
      console.error('Error fetching leave data:', err);
    }
  };

  const fetchDateRangeData = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/employee/attendance/daterange?startDate=${startDate.format(
        'YYYY-MM-DD'
      )}&endDate=${endDate.format('YYYY-MM-DD')}`;
      const data = await getRequest(url);
      setAttendanceData(data);
    } catch (err) {
      console.error('Error fetching attendance data:', err);
    }
  };

  const fetchWorkingDaysDateRangeData = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/employee/attendance/day/daterange?startDate=${startDate.format(
        'YYYY-MM-DD'
      )}&endDate=${endDate.format('YYYY-MM-DD')}`;
      const data = await getRequest(url);
      setWorkingDaysData(data);
    } catch (err) {
      console.error('Error fetching working days data:', err);
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

    fetchAttendanceData(newValue === 0 ? 'daily' : newValue === 1 ? 'weekly' : newValue === 2 ? 'monthly' : 'yearly', param);
    fetchLeaveData(newValue === 0 ? 'daily' : newValue === 1 ? 'weekly' : newValue === 2 ? 'monthly' : 'yearly', param);
    fetchWorkingDaysData(newValue === 0 ? 'daily' : newValue === 1 ? 'weekly' : newValue === 2 ? 'monthly' : 'yearly', param);
  };

  // const handleLeaveTabChange = (event, newValue) => {
  //   setLeaveTabValue(newValue);

  //   let param;
  //   const today = dayjs();
  //   const year = today.year();
  //   const month = today.month() + 1;
  //   const date = today.format('YYYY-MM-DD');
  //   const week = today.isoWeek();

  //   switch (newValue) {
  //     case 0:
  //       param = date;
  //       break;
  //     case 1:
  //       param = `${year}/${week}`;
  //       break;
  //     case 2:
  //       param = `${year}/${month}`;
  //       break;
  //     case 3:
  //       param = `${year}`;
  //       break;
  //     default:
  //       return;
  //   }

  //   fetchLeaveData(newValue === 0 ? 'daily' : newValue === 1 ? 'weekly' : newValue === 2 ? 'monthly' : 'yearly', param);
  // };

  // const handleWorkingDaysTabChange = (event, newValue) => {
  //   setWorkingDaysTabValue(newValue);

  //   let param;
  //   const today = dayjs();
  //   const year = today.year();
  //   const month = today.month() + 1;
  //   const date = today.format('YYYY-MM-DD');
  //   const week = today.isoWeek();

  //   switch (newValue) {
  //     case 0:
  //       param = date;
  //       break;
  //     case 1:
  //       param = `${year}/${week}`;
  //       break;
  //     case 2:
  //       param = `${year}/${month}`;
  //       break;
  //     case 3:
  //       param = `${year}`;
  //       break;
  //     default:
  //       return;
  //   }

  //   fetchWorkingDaysData(newValue === 0 ? 'daily' : newValue === 1 ? 'weekly' : newValue === 2 ? 'monthly' : 'yearly', param);
  // };

  const generateChartData = () => {
    const labels = Object.keys(attendanceData.workingHours || {});
    const values = Object.values(attendanceData.workingHours || {});

    return {
      labels,
      datasets: [
        {
          label: 'Working Hours',
          data: values,
          backgroundColor: ['#3e95cd'],
          borderColor: ['#3e95cd'],
          borderWidth: 1
        }
      ]
    };
  };

  const generateLeaveChartData = () => {
    const labels = Object.keys(leaveData.leaveCount || {});
    const values = Object.values(leaveData.leaveCount || {});

    return {
      labels,
      datasets: [
        {
          label: 'Leave Count',
          data: values,
          backgroundColor: ['#8e5ea2'],
          borderColor: ['#8e5ea2'],
          borderWidth: 1
        }
      ]
    };
  };

  const generateWorkingDaysChartData = () => {
    const labels = Object.keys(workingDaysData.workingDaysPerEmployee || {});
    const values = Object.values(workingDaysData.workingDaysPerEmployee || {});

    return {
      labels,
      datasets: [
        {
          label: 'Working Days Per Employee',
          data: values,
          backgroundColor: ['#ff6384'],
          borderColor: ['#ff6384'],
          borderWidth: 1
        }
      ]
    };
  };

  return (
    <MainCard title="Attendance/Leave Report">
      <Grid container spacing={4}>
        {/* Date Range Controls */}
        <Grid container item spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <DatePicker label="Start Date" value={startDate} onChange={(newValue) => setStartDate(newValue)} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DatePicker label="End Date" value={endDate} onChange={(newValue) => setEndDate(newValue)} fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => {
                fetchDateRangeData();
                fetchLeaveDateRangeData();
                fetchWorkingDaysDateRangeData();
              }}
            >
              Fetch Range Data
            </Button>
          </Grid>
        </Grid>

        {/* Attendance Section */}
        <Grid item xs={12}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab label="Daily" />
            <Tab label="Weekly" />
            <Tab label="Monthly" />
            <Tab label="Yearly" />
          </Tabs>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h2" gutterBottom>
            Attendance
          </Typography>
          <Typography variant="h6">Total Present: {attendanceData.totalPresent || 0}</Typography>
          <Typography variant="h6">Total Absent: {attendanceData.totalAbsent || 0}</Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <Bar data={generateChartData()} />
          </Box>
        </Grid>

        {/* Leave Section */}
        <Grid item xs={12}>
          <Typography variant="h2" gutterBottom>
            Leave
          </Typography>
          {/* <Tabs value={leaveTabValue} onChange={handleLeaveTabChange} variant="scrollable" scrollButtons="auto">
            <Tab label="Daily" />
            <Tab label="Weekly" />
            <Tab label="Monthly" />
            <Tab label="Yearly" />
          </Tabs> */}
          <Typography variant="h6">Total Absent: {leaveData.totalAbsent || 0}</Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <Bar data={generateLeaveChartData()} />
          </Box>
        </Grid>

        {/* Working Days Section */}
        <Grid item xs={12}>
          <Typography variant="h2" gutterBottom>
            Working Days
          </Typography>
          {/* <Tabs value={workingDaysTabValue} onChange={handleWorkingDaysTabChange} variant="scrollable" scrollButtons="auto">
            <Tab label="Daily" />
            <Tab label="Weekly" />
            <Tab label="Monthly" />
            <Tab label="Yearly" />
          </Tabs> */}
          <Typography variant="h6">Total Present: {workingDaysData.totalPresent || 0}</Typography>
          <Typography variant="h6">Total Absent: {workingDaysData.totalAbsent || 0}</Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <Bar data={generateWorkingDaysChartData()} />
          </Box>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default AttendanceReports;
