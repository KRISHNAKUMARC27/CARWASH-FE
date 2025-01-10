import { useEffect, useState } from 'react';

// material-ui
import { Grid, InputLabel, Select, MenuItem, Button } from '@mui/material';

// project imports
//import EarningCard from './EarningCard';
//import PopularCard from './PopularCard';
import TotalRevenueLineChartCard from './TotalRevenueLineChartCard';
import TotalJobsLineChartCard from './TotalJobsLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
//import TotalGrowthBarChart from './TotalGrowthBarChart';
import SparesEvents from './SparesEvents';
import { gridSpacing } from 'store/constant';
import TotalJobCardBarChart from './TotalJobCardBarChart';
import TotalJobCardRevenueBarChart from './TotalJobCardRevenueBarChart';
import TotalJobRevenueSplitBarChart from './TotalJobRevenueSplitBarChart';
// ==============================|| DEFAULT DASHBOARD ||============================== //
import { getRequest } from 'utils/fetchRequest';

const monthList = [
  { id: 1, value: 'January' },
  { id: 2, value: 'February' },
  { id: 3, value: 'March' },
  { id: 4, value: 'April' },
  { id: 5, value: 'May' },
  { id: 6, value: 'June' },
  { id: 7, value: 'July' },
  { id: 8, value: 'August' },
  { id: 9, value: 'September' },
  { id: 10, value: 'October' },
  { id: 11, value: 'November' },
  { id: 12, value: 'December' }
];

const yearList = [{ id: 2024 }, { id: 2025 }, { id: 2026 }, { id: 2027 }, { id: 2028 }, { id: 2029 }];

const Dashboard = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalJobCards, setTotalJobCards] = useState(0);
  const [reportInput, setReportInput] = useState({ month: 12, year: 2024 });

  const [displayFlag, setDisplayFlag] = useState(false);
  const roles = JSON.parse(localStorage.getItem('roles') || '[]');

  useEffect(() => {
    fetchTotalRevenueData();
    fetchTotalJobCardsData();
  }, []);

  const handleReportInputMonthChange = (event) => {
    const updatedData = { ...reportInput, month: event.target.value };
    setReportInput(updatedData);
  };

  const handleReportInputYearChange = (event) => {
    const updatedData = { ...reportInput, year: event.target.value };
    setReportInput(updatedData);
  };

  const fetchTotalRevenueData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/stats/totalRevenue');
      setTotalRevenue(data);
      setDisplayFlag(true);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchTotalJobCardsData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/stats/totalJobCards');
      setTotalJobCards(data);
      setDisplayFlag(true);
    } catch (err) {
      console.error(err.message);
    }
  };

  const convertToCSV = (array) => {
    if (!array || !array.length) {
      return '';
    }

    const headers = Object.keys(array[0]); // Get headers from the keys of the first object
    const rows = array.map((obj) => headers.map((header) => `"${obj[header]}"`).join(',')); // Map each object to a CSV row

    return [headers.join(','), ...rows].join('\n'); // Join headers and rows with line breaks
  };

  const downloadReport = async () => {
    try {
      const data = await getRequest(`${process.env.REACT_APP_API_URL}/stats/jobCardReport/${reportInput.month}/${reportInput.year}`);
      if (data && Array.isArray(data)) {
        // Convert data to CSV
        const csvContent = convertToCSV(data);

        // Create a Blob and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const fileName = `JobCardReport_${reportInput.month}_${reportInput.year}.csv`;

        if (window.navigator.msSaveBlob) {
          // For IE browser
          window.navigator.msSaveBlob(blob, fileName);
        } else {
          // For other browsers
          const link = document.createElement('a');
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        console.error('Unexpected data format received');
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
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
              <Grid item lg={4} md={6} sm={6} xs={12}>
                <TotalRevenueLineChartCard />
              </Grid>
              <Grid item lg={4} md={12} sm={12} xs={12}>
                <Grid container spacing={gridSpacing}>
                  <Grid item sm={6} xs={12} md={6} lg={12}>
                    {displayFlag && <TotalIncomeDarkCard totalRevenue={totalRevenue.total} name={'Total Income'} />}
                  </Grid>
                  <Grid item sm={6} xs={12} md={6} lg={12}>
                    {displayFlag && <TotalIncomeDarkCard totalRevenue={totalRevenue.totalSparesWorth} name={'Total Spares Worth'} />}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item lg={4} md={12} sm={12} xs={12}>
                <Grid container spacing={gridSpacing}>
                  <Grid item sm={6} xs={12} md={6} lg={12}>
                    {displayFlag && <TotalIncomeDarkCard totalRevenue={totalRevenue.spares} name={'Total Income From Spares'} />}
                  </Grid>
                  <Grid item sm={6} xs={12} md={6} lg={12}>
                    {displayFlag && <TotalIncomeDarkCard totalRevenue={totalRevenue.labor} name={'Total Income From Labor'} />}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} md={12}>
                <TotalJobRevenueSplitBarChart />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} md={12}>
                <TotalJobCardRevenueBarChart />
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
      <Grid item xs={6}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={12}>
            <TotalJobCardBarChart />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            {' '}
            <InputLabel id="demo-select-medium" required>
              Month
            </InputLabel>
            <Select
              labelId="demo-select-medium"
              id="demo-select-medium"
              value={reportInput.month || ''}
              label="Month"
              onChange={handleReportInputMonthChange}
            >
              {monthList.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.value}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12}>
            {' '}
            <InputLabel id="demo-select-medium" required>
              Year
            </InputLabel>
            <Select
              labelId="demo-select-medium"
              id="demo-select-medium"
              value={reportInput.year || ''}
              label="Month"
              onChange={handleReportInputYearChange}
            >
              {yearList.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.id}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="error" onClick={() => downloadReport()}>
              Download Report
            </Button>
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
    </Grid>
  );
};

export default Dashboard;
