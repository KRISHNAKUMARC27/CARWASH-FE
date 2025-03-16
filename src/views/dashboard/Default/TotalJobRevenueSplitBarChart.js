import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
//import { useSelector } from 'react-redux';

// material-ui
//import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// third-party
//import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';
import dayjs from 'dayjs';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// chart data
import barchartData from './chart-data/total-growth-bar-chart';
import { getRequest } from 'utils/fetchRequest';

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalJobRevenueSplitBarChart = ({ yearArray }) => {
  const [testCasesStats, setTestCasesStats] = useState();
  const [chartData, setChartData] = useState(barchartData);
  const [timeValue, setTimeValue] = useState(dayjs().year().toString());
  const [displayFlag, setDisplayFlag] = useState(false);

  useEffect(() => {
    fetchTestCasesStats(dayjs().year().toString());

    return () => {
      setTestCasesStats();
    };
  }, []);

  const fetchTestCasesStats = async (uri) => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/stats/yearlyStatsEarningSplit/' + uri);
      setTestCasesStats(data);
      console.log(data);
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
                    <Typography variant="h2">Job Revenue Split</Typography>
                  </Grid>
                  <Grid item>{displayFlag && <Typography variant="h3">{testCasesStats.totalTestCases}</Typography>}</Grid>
                </Grid>
              </Grid>
              <Grid item>
                <TextField id="standard-select-currency" select value={timeValue} onChange={(e) => handleChangeTime(e.target.value)}>
                  {yearArray.map((option) => (
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

TotalJobRevenueSplitBarChart.propTypes = {
  yearArray: PropTypes.array
};

export default TotalJobRevenueSplitBarChart;
