import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { createTheme, ThemeProvider, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DialogTitle, Button, FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
//import DataRowDialog from 'utils/DataRowDialog';
import { OpenInNew, AddCircle, CurrencyRupee, RequestQuote } from '@mui/icons-material';
//import Alert from 'views/utilities/Alert';
import { lazy } from 'react';

// project imports
import { getRequest, putRequest } from 'utils/fetchRequest';
import Loadable from 'ui-component/Loadable';
import AlertDialog from 'views/utilities/AlertDialog';
const BillPayment = Loadable(lazy(() => import('views/invoice/BillPayment')));
const BillPaymentEstimate = Loadable(lazy(() => import('views/estimate/BillPayment')));
const JobView = Loadable(lazy(() => import('views/job/JobView')));
const JobCardCreate = Loadable(lazy(() => import('views/job/JobCardCreate')));

const StatusCell = ({ cell }) => (
  <Box
    component="span"
    sx={() => ({
      cursor: 'pointer',
      backgroundColor: cell.getValue() === 'OPEN' ? 'green' : 'red',
      borderRadius: '0.35rem',
      //color: "#fff",
      maxWidth: '9ch',
      p: '0.25rem'
      //color: cell.getValue() === 'OPEN' ? 'green' : 'red'
    })}
  >
    {cell.getValue()}
  </Box>
);

const AllJobs = () => {
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
    setSelectedRow({});
    setJobStatusOpen(false);
    setJobInfoOpen(false);
    setJobCardCreateOpen(false);
    setInvoiceCreateOpen(false);
    setEstimateCreateOpen(false);
    setInvoice({});
    setEstimate({});
    fetchAllJobsData();
  };

  const handleSave = () => {
    updateJobCard(selectedRow);
    fetchAllJobsData();
    handleClose();
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
      setSelectedRow({});
      setJobStatusOpen(false);
      fetchAllJobsData();
    } catch (err) {
      console.log(err.message);
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
      setSelectedRow({});
      setJobStatusOpen(false);
    }
  };

  const prepareInitialInvoiceObject = async (payload) => {
    if (payload.invoiceObjId != null) {
      try {
        const invoiceData = await getRequest(process.env.REACT_APP_API_URL + '/invoice/' + payload.invoiceObjId);

        setInvoice(invoiceData);
        setInvoiceCreateOpen(true);
      } catch (err) {
        console.log(err.message);
        getSelectedRowJobSpares(payload);
      }
    } else {
      getSelectedRowJobSpares(payload);
    }
  };

  const prepareInitialEstimateObject = async (payload) => {
    if (payload.estimateObjId != null) {
      try {
        const estimateData = await getRequest(process.env.REACT_APP_API_URL + '/estimate/' + payload.estimateObjId);

        setEstimate(estimateData);
        setEstimateCreateOpen(true);
      } catch (err) {
        console.log(err.message);
        getSelectedRowJobSparesEstimate(payload);
      }
    } else {
      getSelectedRowJobSparesEstimate(payload);
    }
  };

  const getSelectedRowJobSpares = async (payload) => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/jobCard/jobSpares/' + payload.id);

      // Combine updates into one `setInvoice` call
      setInvoice((prevState) => ({
        ...prevState,
        jobId: payload.jobId,
        ownerName: payload.ownerName,
        ownerPhoneNumber: payload.ownerPhoneNumber,
        vehicleRegNo: payload.vehicleRegNo,
        vehicleName: payload.vehicleName,
        grandTotal: data.grandTotalWithGST,
        jobObjId: data.id,
        paymentSplitList: [{ paymentAmount: data.grandTotalWithGST || 0, paymentMode: '' }],
        creditPaymentList: []
      }));

      //setJobSpares(data);
      setInvoiceCreateOpen(true);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getSelectedRowJobSparesEstimate = async (payload) => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/jobCard/jobSpares/' + payload.id);

      setEstimate((prevState) => ({
        ...prevState,
        jobId: payload.jobId,
        ownerName: payload.ownerName,
        ownerPhoneNumber: payload.ownerPhoneNumber,
        vehicleRegNo: payload.vehicleRegNo,
        vehicleName: payload.vehicleName,
        grandTotal: data.grandTotal,
        jobObjId: data.id,
        paymentSplitList: [{ paymentAmount: data.grandTotal || 0, paymentMode: '' }],
        creditPaymentList: []
      }));

      setEstimateCreateOpen(true);
    } catch (err) {
      console.log(err.message);
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

  const globalTheme = useTheme();

  const tableTheme = useMemo(
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
  const color1 = '#fff';
  const color2 = '#c38b81';

  return (
    <div>
      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}

      <ThemeProvider theme={tableTheme}>
        <MaterialReactTable
          columns={columns}
          data={data}
          editingMode="modal"
          enableEditing
          initialState={{
            pagination: { pageSize: 10 } // Set default rows per page to 5
          }}
          muiTablePaperProps={{
            elevation: 0, //change the mui box shadow
            //customize paper styles
            sx: {
              borderRadius: '0',
              background: `linear-gradient(${gradientAngle}deg, ${color1}, ${color2})`
            }
          }}
          // muiTableBodyRowProps={({ row }) => ({
          //   onClick: () => {
          //     //console.log(JSON.stringify(row));
          //     setSelectedRow(row.original);
          //     setJobInfoOpen(true);
          //   },
          //   // sx: { cursor: 'pointer' }
          // })}
          renderRowActions={({ row }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <Tooltip arrow placement="right" title="View Job Card">
                <IconButton
                  onClick={() => {
                    setSelectedRow(row.original);
                    setJobInfoOpen(true);
                  }}
                >
                  <OpenInNew />
                </IconButton>
              </Tooltip>
              <Tooltip arrow placement="right" title="Create Job Card">
                <IconButton
                  onClick={() => {
                    setSelectedRow(row.original);
                    setJobCardCreateOpen(true);
                  }}
                >
                  <AddCircle />
                </IconButton>
              </Tooltip>
              {isAuthorizedForInvoice && row.original.jobStatus === 'CLOSED' && (
                <Tooltip arrow placement="right" title="Invoice">
                  <IconButton
                    onClick={() => {
                      setSelectedRow(row.original);
                      prepareInitialInvoiceObject(row.original);
                    }}
                  >
                    <CurrencyRupee />
                  </IconButton>
                </Tooltip>
              )}
              {isAuthorizedForEstimate && row.original.jobStatus === 'CLOSED' && (
                <Tooltip arrow placement="right" title="Estimate">
                  <IconButton
                    onClick={() => {
                      setSelectedRow(row.original);
                      prepareInitialEstimateObject(row.original);
                    }}
                  >
                    <RequestQuote />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}
        />{' '}
      </ThemeProvider>
      {jobStatusOpen && (
        <Dialog
          open={jobStatusOpen}
          onClose={handleClose}
          scroll={'paper'}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <Box
            sx={{
              bgcolor: '#f44336',
              color: '#FFFFFF',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1.25rem'
            }}
          >
            <DialogTitle id="scroll-dialog-title" sx={{ flexGrow: 1, fontSize: '1.5rem', color: 'white' }}>
              {selectedRow.vehicleRegNo}
            </DialogTitle>
          </Box>
          <DialogContent dividers={scroll === 'paper'}>
            <FormControl variant="outlined" style={{ margin: '1px 0' }}>
              <InputLabel>Job Status</InputLabel>
              <Select value={selectedRow?.jobStatus || ''} onChange={handleJobStatusChange} label="Status">
                <MenuItem value="CLOSED">CLOSED</MenuItem>
                <MenuItem value="OPEN">OPEN</MenuItem>
                <MenuItem value="CANCELLED">CANCELLED</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
            <Button onClick={handleClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {jobCardCreateOpen && (
        <Dialog
          open={jobCardCreateOpen}
          onClose={handleClose}
          scroll={'paper'}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          fullWidth
          maxWidth="lg"
        >
          <Box
            sx={{
              bgcolor: '#f44336',
              color: '#FFFFFF',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1.25rem'
            }}
          >
            <DialogTitle id="scroll-dialog-title" sx={{ flexGrow: 1, fontSize: '1.5rem', color: 'white' }}>
              New JobCard for {selectedRow.vehicleRegNo}
            </DialogTitle>
          </Box>
          <DialogContent dividers={scroll === 'paper'}>
            <JobCardCreate data={selectedRow} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {jobInfoOpen && <JobView open={jobInfoOpen} onClose={handleClose} job={selectedRow} />}
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
    </div>
  );
};

StatusCell.propTypes = {
  cell: PropTypes.shape({
    getValue: PropTypes.func.isRequired
  }).isRequired
};

export default AllJobs;
