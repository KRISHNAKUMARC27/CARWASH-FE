import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
//import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

//import ChartDataMonth from './chart-data/total-order-month-line-chart';
import ChartDataYear from './chart-data/total-order-year-line-chart';

// assets
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
//import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { getRequest } from 'utils/fetchRequest';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&>div': {
    position: 'relative',
    zIndex: 5
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.primary[800],
    borderRadius: '50%',
    zIndex: 1,
    top: -85,
    right: -95,
    [theme.breakpoints.down('sm')]: {
      top: -105,
      right: -140
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    zIndex: 1,
    width: 210,
    height: 210,
    background: theme.palette.primary[800],
    borderRadius: '50%',
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down('sm')]: {
      top: -155,
      right: -70
    }
  }
}));

// ==============================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||============================== //

function TotalExpenseLineChartCard() {
  const theme = useTheme();
  const [expenseStats, setExpenseStats] = useState();
  const [chartData, setChartData] = useState(ChartDataYear);
  const [timeValue, setTimeValue] = useState('D');
  const [displayFlag, setDisplayFlag] = useState(false);

  useEffect(() => {
    fetchExpenseStats('D');

    return () => {
      setExpenseStats();
    };
  }, []);

  const fetchExpenseStats = async (uri) => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/stats/revenueExpenses/' + uri);
      setExpenseStats(data);
      setChartData(data.chartData);
      setDisplayFlag(true);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleChangeTime = (newValue) => {
    switch (newValue) {
      case 'D':
        setDisplayFlag(false);
        fetchExpenseStats('D');
        break;
      case 'W':
        setDisplayFlag(false);
        fetchExpenseStats('W');
        break;
      case 'M':
        setDisplayFlag(false);
        fetchExpenseStats('M');
        break;
      case 'Y':
        setDisplayFlag(false);
        fetchExpenseStats('Y');
        break;
      default:
        setDisplayFlag(false);
        fetchExpenseStats('D');
        break;
    }
    setTimeValue(newValue);
  };

  return (
    <>
      {/* {isLoading ? (
        <SkeletonTotalOrderCard />
      ) : ( */}
      <CardWrapper border={false} content={false}>
        <Box sx={{ p: 2.25 }}>
          <Grid container direction="column">
            <Grid item>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Avatar
                    variant="rounded"
                    sx={{
                      ...theme.typography.commonAvatar,
                      ...theme.typography.largeAvatar,
                      backgroundColor: theme.palette.primary[800],
                      color: '#fff',
                      mt: 1
                    }}
                  >
                    <CurrencyRupeeIcon fontSize="inherit" />
                  </Avatar>
                </Grid>
                <Grid item>
                  <Button
                    disableElevation
                    variant={timeValue === 'D' ? 'contained' : 'text'}
                    size="small"
                    sx={{ color: 'inherit', mr: 1 }}
                    onClick={() => handleChangeTime('D')}
                  >
                    Day
                  </Button>
                  <Button
                    disableElevation
                    variant={timeValue === 'W' ? 'contained' : 'text'}
                    size="small"
                    sx={{ color: 'inherit', mr: 1 }}
                    onClick={() => handleChangeTime('W')}
                  >
                    Week
                  </Button>
                  <Button
                    disableElevation
                    variant={timeValue === 'M' ? 'contained' : 'text'}
                    size="small"
                    sx={{ color: 'inherit', mr: 1 }}
                    onClick={() => handleChangeTime('M')}
                  >
                    Month
                  </Button>
                  <Button
                    disableElevation
                    variant={timeValue === 'Y' ? 'contained' : 'text'}
                    size="small"
                    sx={{ color: 'inherit' }}
                    onClick={() => handleChangeTime('Y')}
                  >
                    Year
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sx={{ mb: 0.75 }}>
              <Grid container alignItems="center">
                <Grid item xs={6}>
                  <Grid container alignItems="center">
                    <Grid item>
                      {displayFlag && (
                        <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                          {/* {'₹ '}  */}
                          {expenseStats.grandTotalSum}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 500,
                          color: theme.palette.primary[200]
                        }}
                      >
                        Total Expenses
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  {displayFlag && <Chart {...chartData} />}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </CardWrapper>
      {/* )} */}
    </>
  );
}

TotalExpenseLineChartCard.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalExpenseLineChartCard;
