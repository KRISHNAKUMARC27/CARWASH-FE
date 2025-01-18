import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { createTheme, ThemeProvider, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DialogTitle, Button, FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip, Grid, TextField } from '@mui/material';
import Box from '@mui/material/Box';
//import DataRowDialog from 'utils/DataRowDialog';
import { OpenInNew, AddCircle, RemoveCircle, CurrencyRupee } from '@mui/icons-material';
//import Alert from 'views/utilities/Alert';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import JobView from 'views/job/JobView';
import JobCardCreate from 'views/job/JobCardCreate';
import { getRequest, putRequest, postRequest } from 'utils/fetchRequest';
import { gridSpacing } from 'store/constant';

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

  const invoiceRole = ['INVOICE'];
  const roles = JSON.parse(localStorage.getItem('roles')) || [];
  const isAuthorizedForInvoice = roles.some((role) => invoiceRole.includes(role));
  const [invoiceCreateOpen, setInvoiceCreateOpen] = useState(false);
  //const [jobSpares, setJobSpares] = React.useState({});
  const [paymentModes, setPaymentModes] = React.useState([]);
  const [invoice, setInvoice] = useState();
  // State to manage confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [remainingAmount, setRemainingAmount] = useState(0); // To store remaining amount dynamically

  useEffect(() => {
    fetchAllJobsData();

    return () => {
      setData([]);
      setJobStatusOpen(false);
      setSelectedRow({});
      setJobInfoOpen(false);
      setJobCardCreateOpen(false);
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

  const handleJobStatusChange = (event) => {
    const updatedData = { ...selectedRow, jobStatus: event.target.value };
    setSelectedRow(updatedData);
  };

  const handleClose = () => {
    setSelectedRow({});
    setConfirmDialogOpen(false);
    setJobStatusOpen(false);
    setJobInfoOpen(false);
    setJobCardCreateOpen(false);
    setInvoiceCreateOpen(false);
    //setJobSpares({});
    setInvoice({});
    fetchAllJobsData();
  };

  const handleSave = () => {
    updateJobCard(selectedRow);
    fetchAllJobsData();
    handleClose();
  };

  const updateJobCard = async (payload) => {
    try {
      await putRequest(process.env.REACT_APP_API_URL + '/jobCard/jobStatus', payload);
      setSelectedRow({});
      setJobStatusOpen(false);
      fetchAllJobsData();
    } catch (err) {
      console.log(err.message);
      setAlertMess(err.message);
      setShowAlert(true);
      setSelectedRow({});
      setJobStatusOpen(false);
    }
  };

  const getSelectedRowJobSpares = async (payload) => {
    try {
      const invoiceData = await getRequest(process.env.REACT_APP_API_URL + '/invoice/jobObjId/' + payload.id);

      setInvoice(invoiceData);
      setInvoiceCreateOpen(true);
    } catch (err) {
      console.log(err.message);
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
          paymentSplitList: [{ paymentAmount: data.grandTotalWithGST || 0, paymentMode: '' }]
        }));

        //setJobSpares(data);
        setInvoiceCreateOpen(true);
      } catch (err) {
        console.log(err.message);
      }
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

  // const handleInvoiceInputChange = (column, value) => {
  //   const updatedData = { ...invoice, [column]: value };
  //   setInvoice(updatedData);
  // };

  // const handlePaymentSplitChange = (index, field, value) => {
  //   const updatedPaymentSplitList = [...invoice.paymentSplitList];
  //   updatedPaymentSplitList[index] = {
  //     ...updatedPaymentSplitList[index],
  //     [field]: value
  //   };
  //   setInvoice((prevState) => ({ ...prevState, paymentSplitList: updatedPaymentSplitList }));
  // };

  const handlePaymentSplitChange = (index, field, value) => {
    const updatedPaymentSplitList = [...invoice.paymentSplitList];

    // Update the specific field in the payment split list
    updatedPaymentSplitList[index] = {
      ...updatedPaymentSplitList[index],
      [field]: value
    };

    // Calculate the pending amount and credit flag
    const totalPaidExcludingCredit = updatedPaymentSplitList
      .filter((split) => split.paymentMode !== 'CREDIT') // Exclude CREDIT payments
      .reduce((sum, split) => sum + (split.paymentAmount || 0), 0); // Sum up payment amounts

    const grandTotal = invoice.grandTotal || 0;
    const pendingAmount = grandTotal - totalPaidExcludingCredit;

    setInvoice((prevState) => ({
      ...prevState,
      paymentSplitList: updatedPaymentSplitList,
      pendingAmount: pendingAmount > 0 ? pendingAmount : 0, // Ensure non-negative pending amount
      creditFlag: updatedPaymentSplitList.some((split) => split.paymentMode === 'CREDIT') // Set creditFlag if CREDIT is used
    }));
  };

  const addPaymentSplitRow = () => {
    const grandTotal = invoice.grandTotal || 0;
    const totalPaid = invoice.paymentSplitList.reduce((sum, split) => sum + (split.paymentAmount || 0), 0);
    const remainingAmount = grandTotal - totalPaid;

    if (remainingAmount <= 0) {
      alert('No remaining amount to allocate. Please adjust the existing payment splits.');
      return;
    }

    // Add a new row with the remaining amount prefilled
    setInvoice((prevState) => ({
      ...prevState,
      paymentSplitList: [
        ...prevState.paymentSplitList,
        { paymentAmount: remainingAmount, paymentMode: '' } // Prefill paymentAmount with remaining value
      ]
    }));
  };

  const removePaymentSplitRow = (index) => {
    const updatedPaymentSplitList = invoice.paymentSplitList.filter((_, i) => i !== index);
    setInvoice((prevState) => ({ ...prevState, paymentSplitList: updatedPaymentSplitList }));
  };

  const handleOpenConfirmDialog = (remaining) => {
    setRemainingAmount(remaining); // Store remaining amount for context
    setConfirmDialogOpen(true);
  };

  // Close the confirmation dialog
  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  // Handle user confirmation (Yes to add CREDIT, No to cancel)
  const handleConfirmAddCredit = () => {
    setConfirmDialogOpen(false); // Close confirmation dialog
    // Add remaining amount as CREDIT
    setInvoice((prevState) => ({
      ...prevState,
      paymentSplitList: [...prevState.paymentSplitList, { paymentAmount: remainingAmount, paymentMode: 'CREDIT' }],
      pendingAmount: remainingAmount,
      creditFlag: true
    }));
    // handleClose();
    // handleInvoiceSave(); // Proceed with saving the invoice
  };

  const handleInvoiceSave = async () => {
    //console.log(invoice);
    if (invoice.grandTotal <= 0) {
      alert('Grant total is 0. Cannot generate bill');
      return;
    }
    const grandTotal = invoice.grandTotal || 0;
    const totalPaid = invoice.paymentSplitList.reduce((sum, split) => sum + (split.paymentAmount || 0), 0);
    const remaining = grandTotal - totalPaid;

    const hasEmptyPaymentMode = invoice.paymentSplitList.some((split) => !split.paymentMode);

    if (hasEmptyPaymentMode) {
      alert('Please select a payment mode for all entries.');
      return;
    }

    if (remaining > 0) {
      // Automatically add CREDIT for the remaining amount
      console.log("I'm still open");
      console.log(invoice);
      handleOpenConfirmDialog(remaining);
      return;
    } else if (remaining < 0) {
      // Show alert if overpayment occurs
      alert('Payment exceeds the grand total. Please adjust the amounts.');
      return;
    }

    try {
      const data = await postRequest(process.env.REACT_APP_API_URL + '/invoice', invoice);
      setAlertMess('Invoice id ' + data.invoiceId + ' saved successfully');
      setShowAlert(true);
      handleClose();
    } catch (err) {
      setAlertMess(err.message);
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
      {showAlert && (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert variant="filled" severity="info" onClose={() => setShowAlert(false)}>
            {alertMess}
          </Alert>
        </Stack>
      )}
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
              {isAuthorizedForInvoice && (
                <Tooltip arrow placement="right" title="Invoice">
                  <IconButton
                    onClick={() => {
                      setSelectedRow(row.original);
                      getSelectedRowJobSpares(row.original);
                      getPaymentModes();
                    }}
                  >
                    <CurrencyRupee />
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
      {invoiceCreateOpen && (
        <Dialog
          open={invoiceCreateOpen}
          onClose={handleClose}
          scroll={'paper'}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle id="scroll-dialog-title" sx={{ fontSize: '1.0rem' }}>
            Invoice Generation for {selectedRow.vehicleRegNo}
          </DialogTitle>

          <DialogContent dividers={scroll === 'paper'}>
            <br></br>
            <Grid container direction="row" spacing={gridSpacing}>
              <Grid item xs={6}>
                <TextField label="Grand Total" required variant="outlined" value={invoice?.grandTotal || 0} />
              </Grid>
              {invoice.paymentSplitList.map((split, index) => (
                <Grid container item spacing={gridSpacing} key={index} alignItems="center">
                  <Grid item xs={5}>
                    <TextField
                      label="Payment Amount"
                      variant="outlined"
                      fullWidth
                      required
                      value={split.paymentAmount}
                      onChange={(e) => handlePaymentSplitChange(index, 'paymentAmount', parseFloat(e.target.value) || 0)}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      select
                      label="Payment Mode"
                      variant="outlined"
                      fullWidth
                      required
                      value={split.paymentMode}
                      onChange={(e) => handlePaymentSplitChange(index, 'paymentMode', e.target.value)}
                    >
                      {paymentModes.map((mode) => (
                        <MenuItem key={mode} value={mode}>
                          {mode}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={2}>
                    {index === 0 ? (
                      <IconButton onClick={addPaymentSplitRow} color="primary">
                        <AddCircle />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => removePaymentSplitRow(index)} color="secondary">
                        <RemoveCircle />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleInvoiceSave} color="secondary">
              Save
            </Button>
            <Button onClick={handleClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {jobInfoOpen && <JobView open={jobInfoOpen} onClose={handleClose} job={selectedRow} />}
      {confirmDialogOpen && (
        <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog}>
          <DialogTitle>Confirm Remaining Amount</DialogTitle>
          <DialogContent>
            <p>
              The remaining amount of <b>{remainingAmount}</b> will be added as CREDIT. Do you want to proceed?
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmAddCredit} color="primary">
              Yes
            </Button>
            <Button onClick={handleCloseConfirmDialog} color="secondary">
              No
            </Button>
          </DialogActions>
        </Dialog>
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
