import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';
import dayjs from 'dayjs';

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

const currentYear = dayjs().year();
const yearArray = Array.from({ length: 6 }, (_, i) => {
  const year = currentYear - i;
  return {
    value: year.toString(),
    label: year.toString()
  };
});

const Dashboard = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalJobCards, setTotalJobCards] = useState(0);

  const [displayFlag, setDisplayFlag] = useState(false);
  const roles = JSON.parse(localStorage.getItem('roles') || '[]');

  useEffect(() => {
    fetchTotalRevenueData();
    fetchTotalJobCardsData();
  }, []);

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

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={12} sm={12} xs={12}>
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
              <Grid item lg={4} md={12} sm={12} xs={12}>
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
                <TotalJobRevenueSplitBarChart yearArray={yearArray} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} md={12}>
                <TotalJobCardRevenueBarChart yearArray={yearArray} />
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={12}>
            <TotalJobCardBarChart yearArray={yearArray} />
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
