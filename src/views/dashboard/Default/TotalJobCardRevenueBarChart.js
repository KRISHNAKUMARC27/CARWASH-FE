//import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
//import { useSelector } from 'react-redux';

// material-ui
//import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// third-party
//import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// chart data
import barchartData from './chart-data/total-growth-bar-chart';
import { getRequest } from 'utils/fetchRequest';

const status = [
  {
    value: '2028',
    label: '2028'
  },
  {
    value: '2027',
    label: '2027'
  },
  {
    value: '2026',
    label: '2026'
  },
  {
    value: '2025',
    label: '2025'
  },
  {
    value: '2024',
    label: '2024'
  },
  {
    value: '2023',
    label: '2023'
  }
];

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalJobCardRevenueBarChart = () => {
  const [testCasesStats, setTestCasesStats] = useState();
  const [chartData, setChartData] = useState(barchartData);
  const [timeValue, setTimeValue] = useState('2024');
  const [displayFlag, setDisplayFlag] = useState(false);

  useEffect(() => {
    fetchTestCasesStats('2024');

    return () => {
      setTestCasesStats();
    };
  }, []);

  const fetchTestCasesStats = async (uri) => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/stats/yearlyBarStatsTotalRevenue/' + uri);
      setTestCasesStats(data);
      setChartData(data.chartData);
      setDisplayFlag(true);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleChangeTime = (newValue) => {
    setDisplayFlag(false);
    fetchTestCasesStats(newValue);
    setTimeValue(newValue);
  };

  return (
    <>
      <MainCard>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Grid container direction="column" spacing={1}>
                  <Grid item>
                    <Typography variant="h2">Total Job Revenue</Typography>
                  </Grid>
                  <Grid item>{displayFlag && <Typography variant="h3">{testCasesStats.totalTestCases}</Typography>}</Grid>
                </Grid>
              </Grid>
              <Grid item>
                <TextField id="standard-select-currency" select value={timeValue} onChange={(e) => handleChangeTime(e.target.value)}>
                  {status.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {displayFlag && <Chart {...chartData} />}
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
};

// TotalGrowthBarChart.propTypes = {
//   isLoading: PropTypes.bool
// };

export default TotalJobCardRevenueBarChart;
