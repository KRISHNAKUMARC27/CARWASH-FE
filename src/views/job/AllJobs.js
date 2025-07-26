import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
//import { createTheme, ThemeProvider, useTheme } from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DialogTitle, Button, FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip, Box, useTheme } from '@mui/material';
import { OpenInNew, AddCircle, CurrencyRupee, RequestQuote } from '@mui/icons-material';
//import Alert from 'views/utilities/Alert';
import { lazy } from 'react';

// project imports
import { getRequest, putRequest } from 'utils/fetchRequest';
import { prepareInitialInvoiceObject, prepareInitialEstimateObject } from 'utils/JobPaymentUtils';

import Loadable from 'ui-component/Loadable';
import AlertDialog from 'views/utilities/AlertDialog';
import StatusCell from './StatusCell';
const BillPayment = Loadable(lazy(() => import('views/invoice/BillPayment')));
const BillPaymentEstimate = Loadable(lazy(() => import('views/estimate/BillPayment')));
const JobView = Loadable(lazy(() => import('views/job/JobView')));
const JobCardCreate = Loadable(lazy(() => import('views/job/JobCardCreate')));

const AllJobs = () => {
  const theme = useTheme();

  const [data, setData] = useState([]);
  const [jobStatusOpen, setJobStatusOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [jobInfoOpen, setJobInfoOpen] = useState(false);
  const [jobCardCreateOpen, setJobCardCreateOpen] = useState(false);

  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');

  const roles = JSON.parse(localStorage.getItem('roles')) || [];
  const invoiceRole = ['INVOICE', 'ADMIN', 'MANAGER'];
  const estimateRole = ['ESTIMATE', 'ADMIN', 'MANAGER'];
  const isAuthorizedForInvoice = roles.some((role) => invoiceRole.includes(role));
  const isAuthorizedForEstimate = roles.some((role) => estimateRole.includes(role));
  const isAuthorizedForOpeningClosedJobs = roles.some((role) => ['ADMIN'].includes(role));

  const [invoiceCreateOpen, setInvoiceCreateOpen] = useState(false);
  const [invoice, setInvoice] = useState();

  const [estimateCreateOpen, setEstimateCreateOpen] = useState(false);
  const [estimate, setEstimate] = useState();

  const [paymentModes, setPaymentModes] = useState([]);

  useEffect(() => {
    fetchAllJobsData();
    getPaymentModes();

    return () => {
      setData([]);
      setJobStatusOpen(false);
      setSelectedRow({});
      setJobInfoOpen(false);
      setJobCardCreateOpen(false);
      setPaymentModes([]);
    };
  }, []);

  const fetchAllJobsData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/jobCard');
      setData(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getPaymentModes = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/config/paymentmodes');
      setPaymentModes(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleJobStatusChange = (event) => {
    const updatedData = { ...selectedRow, jobStatus: event.target.value };
    setSelectedRow(updatedData);
  };

  const handleClose = () => {
    fetchAllJobsData();
    setSelectedRow({});
    setJobStatusOpen(false);
    setJobInfoOpen(false);
    setJobCardCreateOpen(false);
    setInvoiceCreateOpen(false);
    setEstimateCreateOpen(false);
    setInvoice({});
    setEstimate({});
  };

  const handleSave = () => {
    updateJobCard(selectedRow);
  };

  const updateJobCard = async (payload) => {
    if (payload.jobStatus === 'OPEN') {
      if (!isAuthorizedForOpeningClosedJobs) {
        setAlertMess('Not authorized to Re-Open the job');
        setAlertColor('error');
        setShowAlert(true);
        return;
      }
    }
    try {
      await putRequest(process.env.REACT_APP_API_URL + '/jobCard/jobStatus', payload);
      handleClose();
    } catch (err) {
      console.log(err.message);
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
      handleClose();
    }
  };

  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'jobId', //access nested data with dot notation
        header: 'JobCard No.',
        size: 50
      },
      {
        accessorKey: 'jobStatus', //access nested data with dot notation
        header: 'Status',
        size: 50,
        filterVariant: 'select',
        filterSelectOptions: ['OPEN', 'CLOSED', 'CANCELLED'],
        Header: <i style={{ color: 'blue' }}>Status</i>,
        Cell: StatusCell,
        muiTableBodyCellProps: ({ cell }) => ({
          onClick: () => {
            //console.log(cell);
            //console.log(cell.row.original);
            setSelectedRow(cell.row.original);
            setJobStatusOpen(true);
          }
        })
      },
      {
        accessorKey: 'ownerName', //access nested data with dot notation
        header: 'Owner',
        size: 100
      },
      {
        accessorKey: 'ownerPhoneNumber', //normal accessorKey
        header: 'Phone',
        size: 100
      },
      {
        accessorKey: 'vehicleRegNo',
        header: 'Reg. No.',
        size: 100
      },
      {
        accessorKey: 'vehicleName',
        header: 'Vehicle',
        size: 50
      },
      {
        accessorKey: 'kiloMeters',
        header: 'kiloMeters',
        size: 50
      },
      {
        accessorKey: 'jobCreationDate',
        header: 'Job Open Date',
        size: 150
      },
      {
        accessorKey: 'jobCloseDate',
        header: 'Job Closed Date',
        size: 150
      },
      {
        accessorKey: 'ownerAddress',
        header: 'Address',
        size: 150
      },
      {
        accessorKey: 'nextFreeCheckKms',
        header: 'Next FreeCheck KMs',
        size: 50
      },
      {
        accessorKey: 'nextServiceKms',
        header: 'Next Service KMs',
        size: 50
      }
    ],
    []
  );

  // const globalTheme = useTheme();

  // const tableTheme = useMemo(
  //   () =>
  //     createTheme({
  //       palette: {
  //         mode: globalTheme.palette.mode, //let's use the same dark/light mode as the global theme
  //         primary: globalTheme.palette.secondary, //swap in the secondary color as the primary for the table
  //         info: {
  //           main: 'rgb(255,122,0)' //add in a custom color for the toolbar alert background stuff
  //         },
  //         background: {
  //           default: 'rgba(0, 0, 0, 0)' // set background color to fully transparent
  //           // set background color to transparent
  //           // globalTheme.palette.mode === "light"
  //           //   ? "rgb(254,255,244)" //random light yellow color for the background in light mode
  //           //   : "#000", //pure black table in dark mode for fun
  //         }
  //       },
  //       typography: {
  //         button: {
  //           textTransform: 'none', //customize typography styles for all buttons in table by default
  //           fontSize: '1.2rem'
  //         }
  //       },
  //       components: {
  //         MuiTooltip: {
  //           styleOverrides: {
  //             tooltip: {
  //               fontSize: '1.1rem' //override to make tooltip font size larger
  //             }
  //           }
  //         },
  //         MuiSwitch: {
  //           styleOverrides: {
  //             thumb: {
  //               color: 'pink' //change the color of the switch thumb in the columns show/hide menu to pink
  //             }
  //           }
  //         }
  //       }
  //     }),
  //   [globalTheme]
  // );
  // const gradientAngle = 195;
  // const color1 = '#fff';
  // let color2 = '#c38b81';
  // if (roles.includes('INVOICE')) {
  //   color2 = '#71acda';
  // }
  return (
    <Box>
      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}

      {/* <ThemeProvider theme={tableTheme}> */}
      <MaterialReactTable
        columns={columns}
        data={data}
        editingMode="modal"
        enableEditing
        initialState={{ pagination: { pageSize: 10 } }}
        // muiTablePaperProps={{
        //   elevation: 0,
        //   sx: {
        //     borderRadius: 0,
        //     background: `linear-gradient(${gradientAngle}deg, ${color1}, ${color2})`
        //   }
        // }}
        renderRowActions={({ row }) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* Row 1: View + Create */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="View Job Card" arrow placement="top">
                <IconButton
                  onClick={() => {
                    setSelectedRow(row.original);
                    setJobInfoOpen(true);
                  }}
                >
                  <OpenInNew />
                </IconButton>
              </Tooltip>
              <Tooltip title="Create Job Card" arrow placement="top">
                <IconButton
                  onClick={() => {
                    setSelectedRow(row.original);
                    setJobCardCreateOpen(true);
                  }}
                >
                  <AddCircle />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Row 2: Invoice + Estimate */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {isAuthorizedForInvoice && row.original.jobStatus === 'CLOSED' && (
                <Tooltip title="Invoice" arrow placement="top">
                  <IconButton
                    onClick={() => {
                      setSelectedRow(row.original);
                      prepareInitialInvoiceObject(row.original, setInvoice, setInvoiceCreateOpen, getRequest);
                    }}
                  >
                    <CurrencyRupee />
                  </IconButton>
                </Tooltip>
              )}
              {isAuthorizedForEstimate && row.original.jobStatus === 'CLOSED' && (
                <Tooltip title="Estimate" arrow placement="top">
                  <IconButton
                    onClick={() => {
                      setSelectedRow(row.original);
                      prepareInitialEstimateObject(row.original, setEstimate, setEstimateCreateOpen, getRequest);
                    }}
                  >
                    <RequestQuote />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        )}
      />
      {/* </ThemeProvider> */}

      {/* Dialog: Update Job Status */}
      {jobStatusOpen && (
        <Dialog open={jobStatusOpen} onClose={handleClose} scroll="paper" fullWidth maxWidth="sm">
          <Box sx={{ bgcolor: theme.palette.info.main, color: theme.palette.success.contrastText, p: 1 }}>
            <DialogTitle sx={{ fontSize: '1.5rem', color: 'white' }}>{selectedRow.vehicleRegNo}</DialogTitle>
          </Box>
          <DialogContent dividers>
            <FormControl fullWidth margin="normal">
              <InputLabel>Job Status</InputLabel>
              <Select value={selectedRow?.jobStatus || ''} onChange={handleJobStatusChange} label="Job Status">
                <MenuItem value="CLOSED">CLOSED</MenuItem>
                <MenuItem value="OPEN">OPEN</MenuItem>
                <MenuItem value="CANCELLED">CANCELLED</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="error">
              Close
            </Button>
            <Button onClick={handleSave} color="success">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Dialog: Create JobCard */}
      {jobCardCreateOpen && (
        <Dialog open={jobCardCreateOpen} onClose={handleClose} scroll="paper" fullWidth maxWidth="lg">
          <Box sx={{ bgcolor: theme.palette.info.main, color: theme.palette.success.contrastText, p: 2 }}>
            <DialogTitle sx={{ fontSize: '1.5rem', color: 'white' }}>New JobCard for {selectedRow.vehicleRegNo}</DialogTitle>
          </Box>
          <DialogContent dividers>
            <JobCardCreate data={selectedRow} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="error">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Dialog: View Job Info */}
      {jobInfoOpen && <JobView open={jobInfoOpen} onClose={handleClose} job={selectedRow} />}

      {/* Dialog: Create Invoice */}
      {invoiceCreateOpen && (
        <BillPayment
          invoice={invoice}
          setInvoice={setInvoice}
          paymentModes={paymentModes}
          invoiceCreateOpen={invoiceCreateOpen}
          handleClose={handleClose}
          setAlertMess={setAlertMess}
          setShowAlert={setShowAlert}
          setAlertColor={setAlertColor}
        />
      )}

      {/* Dialog: Create Estimate */}
      {estimateCreateOpen && (
        <BillPaymentEstimate
          estimate={estimate}
          setEstimate={setEstimate}
          paymentModes={paymentModes}
          estimateCreateOpen={estimateCreateOpen}
          handleClose={handleClose}
          setAlertMess={setAlertMess}
          setShowAlert={setShowAlert}
          setAlertColor={setAlertColor}
        />
      )}
    </Box>
  );
};

export default AllJobs;
