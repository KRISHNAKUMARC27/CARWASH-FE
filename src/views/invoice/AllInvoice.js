import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import {
  createTheme,
  ThemeProvider,
  useTheme,
  Tooltip,
  IconButton,
  Box,
  Stack,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Button,
  MenuItem
} from '@mui/material';
import { Edit, FactCheck } from '@mui/icons-material';
import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import { getRequest, postRequest } from 'utils/fetchRequest';
import { gridSpacing } from 'store/constant';
const BillPayment = Loadable(lazy(() => import('views/invoice/BillPayment')));

const AllInvoice = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMess, setAlertMess] = useState('');
  const [data, setData] = useState([]);
  const [invoice, setInvoice] = useState();
  const [invoiceCreateOpen, setInvoiceCreateOpen] = useState(false);

  const [rowSelection, setRowSelection] = useState({});
  const selectedRows = useMemo(() => Object.keys(rowSelection).map((key) => data[key]), [rowSelection, data]);

  const [settleBillDialogOpen, setSettleBillDialogOpen] = useState(false);
  const [multicredit, setMultiCredit] = useState({});
  const [paymentModes, setPaymentModes] = useState([]);

  useEffect(() => {
    fetchAllInvoiceData();
    getPaymentModes();

    return () => {
      setData([]);
      setPaymentModes([]);
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
    setMultiCredit({});
    setSettleBillDialogOpen(false);
    fetchAllInvoiceData();
  };

  const handleCreditPaymentChange = (field, value) => {
    const updatedData = { ...multicredit, [field]: value };
    setMultiCredit(updatedData);
  };

  const handleMultiPaymentSubmit = async () => {
    if (multicredit.paymentMode == null) {
      alert('Please select a payment mode.');
      return;
    }

    if (multicredit.amount == null || multicredit.amount <= 0) {
      alert('Enter valid amount');
      return;
    }

    const updatedMultiSettleObj = {
      ...multicredit,
      invoiceIds: selectedRows.map((row) => row.id)
    };

    console.log(JSON.stringify(updatedMultiSettleObj));

    try {
      const data = await postRequest(process.env.REACT_APP_API_URL + '/invoice/multiCreditSettlement', updatedMultiSettleObj);
      console.log(data);
      setAlertMess(data.result);
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
      },
      {
        accessorKey: 'creditSettledFlag',
        header: 'Credit Settled ?',
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
          enableRowSelection
          onRowSelectionChange={setRowSelection}
          state={{ rowSelection }}
          muiTablePaperProps={{
            elevation: 0,
            sx: {
              borderRadius: '0',
              background: `linear-gradient(${gradientAngle}deg, ${color1}, ${color2})`
            }
          }}
          renderRowActions={({ row }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <Tooltip arrow placement="right" title="Invoice">
                <IconButton
                  onClick={() => {
                    setInvoice(row.original);
                    setInvoiceCreateOpen(true);
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          renderTopToolbarCustomActions={() =>
            Object.keys(rowSelection).length > 0 && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Tooltip title="Settle Bill">
                  <IconButton
                    onClick={() => {
                      const hasZeroPendingAmount = selectedRows.some((row) => row.pendingAmount === 0);

                      if (hasZeroPendingAmount) {
                        alert('One or more rows have a pending amount of 0.');
                        return;
                      }
                      setSettleBillDialogOpen(true);
                    }}
                  >
                    <FactCheck />
                  </IconButton>
                </Tooltip>
              </Box>
            )
          }
        />
      </ThemeProvider>
      {invoiceCreateOpen && (
        <BillPayment
          invoice={invoice}
          setInvoice={setInvoice}
          invoiceCreateOpen={invoiceCreateOpen}
          handleClose={handleClose}
          setAlertMess={setAlertMess}
          setShowAlert={setShowAlert}
        />
      )}
      {settleBillDialogOpen && (
        <Dialog
          open={settleBillDialogOpen}
          onClose={handleClose}
          scroll={'paper'}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          fullWidth
          maxWidth="md"
        >
          <DialogTitle id="scroll-dialog-title" sx={{ fontSize: '1.0rem' }}>
            Multiple Credit Settlement
          </DialogTitle>

          <DialogContent dividers={scroll === 'paper'}>
            <br></br>
            <Grid container item spacing={gridSpacing} alignItems="center">
              <Grid item xs={4}>
                <TextField
                  label="Credit Amount"
                  variant="outlined"
                  fullWidth
                  required
                  value={multicredit.amount || 0}
                  onChange={(e) => handleCreditPaymentChange('amount', parseFloat(e.target.value) || 0)}
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
                  value={multicredit.paymentMode || ''}
                  onChange={(e) => handleCreditPaymentChange('paymentMode', e.target.value)}
                >
                  {paymentModes
                    .filter((mode) => mode !== 'CREDIT') // Exclude "CREDIT"
                    .map((mode) => (
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
                  value={multicredit.comment || ''}
                  onChange={(e) => handleCreditPaymentChange('comment', e.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleMultiPaymentSubmit} color="secondary">
              Save
            </Button>
            <Button onClick={handleClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default AllInvoice;
