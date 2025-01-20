import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import {
  createTheme,
  ThemeProvider,
  useTheme,
  Tooltip,
  IconButton,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Button,
  MenuItem,
  Stack,
  Alert
} from '@mui/material';
import { Edit, AddCircle, RemoveCircle } from '@mui/icons-material';
import { getRequest, postRequest } from 'utils/fetchRequest';
import { gridSpacing } from 'store/constant';

const AllInvoice = () => {
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');
  const [data, setData] = useState([]);
  const [paymentModes, setPaymentModes] = React.useState([]);
  const [invoice, setInvoice] = useState();
  const [invoiceCreateOpen, setInvoiceCreateOpen] = useState(false);
  // State to manage confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [remainingAmount, setRemainingAmount] = useState(0); // To store remaining amount dynamically

  useEffect(() => {
    fetchAllInvoiceData();
    return () => {
      setData([]);
    };
  }, []);

  const fetchAllInvoiceData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/invoice');
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

  const handleClose = () => {
    setInvoiceCreateOpen(false);
    setInvoice({});
    setConfirmDialogOpen(false);
    setRemainingAmount(0);
    fetchAllInvoiceData();
  };

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

  // Handle changes in credit payments
  const handleCreditPaymentChange = (index, field, value) => {
    const updatedCreditPaymentList = [...invoice.creditPaymentList];

    // Update the specific field in the credit payment list
    updatedCreditPaymentList[index] = {
      ...updatedCreditPaymentList[index],
      [field]: value
    };

    // Calculate new pending amount

    setInvoice((prevState) => ({
      ...prevState,
      creditPaymentList: updatedCreditPaymentList
    }));
  };

  // Add a new credit payment row
  const addCreditPaymentRow = () => {
    setInvoice((prevState) => ({
      ...prevState,
      creditPaymentList: [
        ...(prevState.creditPaymentList || []), // Safely fallback to an empty array
        { amount: 0, paymentMode: '', comment: '' } // New credit payment row
      ]
    }));
  };

  // Remove a credit payment row
  const removeCreditPaymentRow = (index) => {
    const updatedCreditPaymentList = invoice.creditPaymentList.filter((_, i) => i !== index);

    // Recalculate pendingAmount after removing a row
    const totalCreditPayments = updatedCreditPaymentList.reduce((sum, credit) => sum + (credit.amount || 0), 0);
    const newPendingAmount = (invoice.grandTotal || 0) - totalCreditPayments;

    setInvoice((prevState) => ({
      ...prevState,
      creditPaymentList: updatedCreditPaymentList,
      pendingAmount: newPendingAmount > 0 ? newPendingAmount : 0,
      creditSettledFlag: newPendingAmount === 0
    }));
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

    const updatedCreditPaymentList = [...invoice.creditPaymentList];
    const hasEmptyPaymentModeCredit = updatedCreditPaymentList.some((split) => !split.paymentMode);

    if (hasEmptyPaymentModeCredit) {
      alert('Please select a payment mode for all entries.');
      return;
    }

    const totalCreditPayments = updatedCreditPaymentList.reduce((sum, credit) => sum + (credit.amount || 0), 0);

    const updatedPaymentSplitList = [...invoice.paymentSplitList];

    const totalPaidExcludingCredit = updatedPaymentSplitList
      .filter((split) => split.paymentMode !== 'CREDIT') // Exclude CREDIT payments
      .reduce((sum, split) => sum + (split.paymentAmount || 0), 0); // Sum up payment amounts

    const newPendingAmount = grandTotal - totalPaidExcludingCredit - totalCreditPayments;

    console.log('GrandTotal ' + grandTotal);
    console.log('totalPaidExcludingCredit ' + totalPaidExcludingCredit);
    console.log('totalCreditPayments' + totalCreditPayments);
    console.log('newPendingAmount ' + newPendingAmount);

    const updatedInvoice = {
      ...invoice,
      pendingAmount: newPendingAmount > 0 ? newPendingAmount : 0,
      creditSettledFlag: newPendingAmount === 0
    };

    try {
      const data = await postRequest(process.env.REACT_APP_API_URL + '/invoice', updatedInvoice);
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
        accessorKey: 'invoiceId', //access nested data with dot notation
        header: 'Id',
        size: 50
        //filterVariant: 'multi-select'
      },
      {
        accessorKey: 'jobId', //normal accessorKey
        header: 'JobCard No.',
        size: 50
      },
      {
        accessorKey: 'grandTotal',
        header: 'Bill Amt',
        size: 50
      },
      {
        accessorKey: 'pendingAmount',
        header: 'Pending',
        size: 50
      },
      {
        accessorKey: 'ownerName', //access nested data with dot notation
        header: 'Owner',
        size: 50
      },
      {
        accessorKey: 'vehicleName',
        header: 'Vehicle',
        size: 50
      },
      {
        accessorKey: 'vehicleRegNo',
        header: 'Reg. No.',
        size: 50
      },
      {
        accessorKey: 'ownerPhoneNumber', //normal accessorKey
        header: 'Phone',
        size: 100
      },
      {
        accessorKey: 'billCloseDate',
        header: 'Bill Close Date',
        size: 100
      },
      {
        accessorKey: 'creditFlag',
        header: 'Credit ?',
        size: 100,
        filterVariant: 'multi-select',
        Cell: ({ cell }) => (cell.getValue() ? 'Yes' : 'No')
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
  const color1 = '#e2d7d5';
  const color2 = '#cf8989';

  return (
    <>
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
          enableFacetedValues
          //editingMode="modal"
          enableEditing
          muiTablePaperProps={{
            elevation: 0,
            sx: {
              borderRadius: '0',
              //backgroundColor: "#344767",
              background: `linear-gradient(${gradientAngle}deg, ${color1}, ${color2})`
            }
          }}
          renderRowActions={({ row }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <Tooltip arrow placement="right" title="Invoice">
                <IconButton
                  onClick={() => {
                    setInvoice(row.original);
                    getPaymentModes();
                    setInvoiceCreateOpen(true);
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        />{' '}
      </ThemeProvider>
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
            Invoice Generation for {invoice.vehicleRegNo}
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
            <br></br>
            {invoice.creditFlag && (
              <Grid container direction="row" spacing={gridSpacing}>
                {(invoice.creditPaymentList || []).map((credit, index) => (
                  <Grid container item spacing={gridSpacing} key={index} alignItems="center">
                    <Grid item xs={4}>
                      <TextField
                        label="Credit Amount"
                        variant="outlined"
                        fullWidth
                        required
                        value={credit.amount}
                        onChange={(e) => handleCreditPaymentChange(index, 'amount', parseFloat(e.target.value) || 0)}
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        select
                        label="Payment Mode"
                        variant="outlined"
                        fullWidth
                        required
                        value={credit.paymentMode}
                        onChange={(e) => handleCreditPaymentChange(index, 'paymentMode', e.target.value)}
                      >
                        {paymentModes.map((mode) => (
                          <MenuItem key={mode} value={mode}>
                            {mode}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Comment"
                        variant="outlined"
                        fullWidth
                        value={credit.comment}
                        onChange={(e) => handleCreditPaymentChange(index, 'comment', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton onClick={() => removeCreditPaymentRow(index)} color="secondary">
                        <RemoveCircle />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button onClick={addCreditPaymentRow} color="primary" startIcon={<AddCircle />}>
                    Add Credit Payment
                  </Button>
                </Grid>
              </Grid>
            )}
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
    </>
  );
};

export default AllInvoice;
