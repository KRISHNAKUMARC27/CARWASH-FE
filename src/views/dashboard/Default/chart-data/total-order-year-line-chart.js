// ===========================|| DASHBOARD - TOTAL ORDER YEAR CHART ||=========================== //

const chartData = {
  type: 'line',
  height: 90,
  options: {
    chart: {
      sparkline: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#fff'],
    fill: {
      type: 'solid',
      opacity: 1
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    yaxis: {
      min: 2000,
      max: 100000
    },
    tooltip: {
      theme: 'dark',
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: 'Total Order'
      },
      marker: {
        show: false
      }
    }
  },
  series: [
    {
      name: 'series1',
      data: [0, 44, 9, 54, 45, 66, 41, 69]
    }
  ]
};

export default chartData;
