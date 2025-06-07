import * as React from 'react';
import {
  TextField,
  Typography,
  Grid,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  createTheme,
  ThemeProvider,
  useTheme,
  Box,
  //IconButton,
  Tooltip
} from '@mui/material';
//import DownloadIcon from '@mui/icons-material/Download';
import { MaterialReactTable } from 'material-react-table';

import AlertDialog from 'views/utilities/AlertDialog';
import PropTypes from 'prop-types';
import { getRequest, getBlobRequest } from 'utils/fetchRequest';

function JobView({ open, onClose, job }) {
  const [jobSpares, setJobSpares] = React.useState({});
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');

  React.useEffect(() => {
    getJobSpares(job.id);
    return () => {
      setJobSpares({});
    };
  }, [job]);

  const getJobSpares = async (id) => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/jobCard/jobSpares/' + id);
      setJobSpares(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  // const downloadJobCardPDF = async () => {
  //   try {
  //     const blob = await getBlobRequest(process.env.REACT_APP_API_URL + '/jobCard/pdf/' + job.id);
  //     const downloadUrl = window.URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = downloadUrl;
  //     link.setAttribute('download', 'Job_' + job.jobId + '_' + job.vehicleRegNo + '.pdf'); // Use the filename you wish
  //     //link.setAttribute('download', response.headers.get('Content-Disposition').split('filename=')[1] || 'download.pdf');
  //     document.body.appendChild(link);
  //     link.click();
  //     link.parentNode.removeChild(link);
  //   } catch (err) {
  //     console.log(err.message);
  //     onClose();
  //     console.log(err.message);
  //     setAlertMess(err.message);
  //     setShowAlert(true);
  //   }
  // };

  const printBillPDF = async () => {
    try {
      const blob = await getBlobRequest(process.env.REACT_APP_API_URL + '/jobCard/billPdf/' + job.id);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'Bill_' + job.jobId + '_' + job.vehicleRegNo + '.pdf'); // Use the filename you wish
      //link.setAttribute('download', response.headers.get('Content-Disposition').split('filename=')[1] || 'download.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.log(err.message);
      setAlertMess(err.message);
      setShowAlert(true);
    }
  };

  const jobSparesColumn = React.useMemo(
    () => [
      {
        accessorKey: 'sparesAndLabour',
        header: 'Spares/Services',
        size: 250
      },
      {
        accessorKey: 'qty',
        header: 'Quantity',
        size: 100
      },
      {
        accessorKey: 'rate',
        header: 'Rate',
        size: 100
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        size: 100
      }
    ],
    []
  );

  const globalTheme = useTheme();
  const tableTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: globalTheme.palette.mode, //let's use the same dark/light mode as the global theme
          primary: globalTheme.palette.secondary, //swap in the secondary color as the primary for the table
          info: {
            main: 'rgb(255,122,0)' //add in a custom color for the toolbar alert background stuff
          },
          background: {
            default: 'rgba(0, 0, 0, 0)' // set background color to fully transparent
            // set background color to transparent
            // globalTheme.palette.mode === "light"
            //   ? "rgb(254,255,244)" //random light yellow color for the background in light mode
            //   : "#000", //pure black table in dark mode for fun
          }
        },
        typography: {
          button: {
            textTransform: 'none', //customize typography styles for all buttons in table by default
            fontSize: '1.2rem'
          }
        },
        components: {
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                fontSize: '1.1rem' //override to make tooltip font size larger
              }
            }
          },
          MuiSwitch: {
            styleOverrides: {
              thumb: {
                color: 'pink' //change the color of the switch thumb in the columns show/hide menu to pink
              }
            }
          }
        }
      }),
    [globalTheme]
  );
  const gradientAngle = 195;
  const color1 = '#faf4f3';
  const color2 = '#f2f0f6';

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogTitle>
          <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            gap={1}
          >
            <Typography variant="h5" fontWeight={600}>
              {`JobCard: ${job.jobId} Vehicle No.: ${job.vehicleRegNo}`}
            </Typography>
            <Tooltip title="Print Bill">
              <Button onClick={printBillPDF} variant="outlined" size="small">
                Print Bill
              </Button>
            </Tooltip>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ bgcolor: 'white', color: 'black' }}>
          <Grid container spacing={2}>
            {/* Owner Details */}
            <Grid item xs={12} sm={6}>
              <TextField label="Owner Name" fullWidth variant="outlined" value={job.ownerName || ''} InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Owner PhoneNumber"
                fullWidth
                variant="outlined"
                value={job.ownerPhoneNumber || ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Owner Address"
                fullWidth
                multiline
                minRows={2}
                variant="outlined"
                value={job.ownerAddress || ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Vehicle Details */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Vehicle Reg. No."
                fullWidth
                variant="outlined"
                value={job.vehicleRegNo || ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Vehicle Name" fullWidth variant="outlined" value={job.vehicleName || ''} InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Vehicle K.Ms" fullWidth variant="outlined" value={job.kiloMeters || ''} InputProps={{ readOnly: true }} />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Job Spares Table */}
            <Grid item xs={12}>
              <ThemeProvider theme={tableTheme}>
                <MaterialReactTable
                  columns={jobSparesColumn}
                  data={jobSpares.jobSparesInfo || []}
                  muiTablePaperProps={{
                    elevation: 0,
                    sx: {
                      borderRadius: 0,
                      background: `linear-gradient(${gradientAngle}deg, ${color1}, ${color2})`
                    }
                  }}
                />
              </ThemeProvider>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Job Services Table */}
            <Grid item xs={12}>
              <ThemeProvider theme={tableTheme}>
                <MaterialReactTable
                  columns={jobSparesColumn}
                  data={jobSpares.jobServiceInfo || []}
                  muiTablePaperProps={{
                    elevation: 0,
                    sx: {
                      borderRadius: 0,
                      background: `linear-gradient(${gradientAngle}deg, ${color1}, ${color2})`
                    }
                  }}
                />
              </ThemeProvider>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Totals */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Total Spares Value"
                fullWidth
                variant="outlined"
                value={jobSpares.totalSparesValue || ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Total Service Value"
                fullWidth
                variant="outlined"
                value={jobSpares.totalServiceValue || ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Grand Total"
                fullWidth
                variant="outlined"
                value={jobSpares.grandTotal || ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={'info'} alertMess={alertMess} />}
    </>
  );
}

JobView.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  job: PropTypes.object.isRequired
};

export default JobView;
