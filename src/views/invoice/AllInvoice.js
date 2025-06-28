import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Tooltip, IconButton, Box } from '@mui/material';
import { Edit, FactCheck, Receipt as ReceiptIcon } from '@mui/icons-material';
import { lazy } from 'react';
import AlertDialog from 'views/utilities/AlertDialog';

// project imports
import Loadable from 'ui-component/Loadable';
import { getRequest } from 'utils/fetchRequest';
const BillPayment = Loadable(lazy(() => import('views/invoice/BillPayment')));
const MultiSettle = Loadable(lazy(() => import('views/invoice/MultiSettle')));
const Receipt = Loadable(lazy(() => import('views/invoice/Receipt')));

const AllInvoice = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMess, setAlertMess] = useState('');
  const [alertColor, setAlertColor] = useState('info');

  const [data, setData] = useState([]);
  const [invoice, setInvoice] = useState();
  const [invoiceCreateOpen, setInvoiceCreateOpen] = useState(false);

  const [rowSelection, setRowSelection] = useState({});
  const selectedRows = useMemo(() => Object.keys(rowSelection).map((key) => data[key]), [rowSelection, data]);

  const [settleBillDialogOpen, setSettleBillDialogOpen] = useState(false);
  const [paymentModes, setPaymentModes] = useState([]);

  const [receipt, setReceipt] = useState({});
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  // const roles = JSON.parse(localStorage.getItem('roles')) || [];
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
    setSettleBillDialogOpen(false);
    setReceiptDialogOpen(false);
    fetchAllInvoiceData();
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
  // let color1 = '#e2d7d5';
  // let color2 = '#cf8989';
  // if (roles.includes('INVOICE')) {
  //   color1 = '#e2d7d5';
  //   color2 = '#71acda';
  // }

  return (
    <>
      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}

      {/* <ThemeProvider theme={tableTheme}> */}
      <MaterialReactTable
        columns={columns}
        data={data}
        enableFacetedValues
        //editingMode="modal"
        enableEditing
        enableRowSelection
        onRowSelectionChange={setRowSelection}
        state={{ rowSelection }}
        // muiTablePaperProps={{
        //   elevation: 0,
        //   sx: {
        //     borderRadius: '0',
        //     background: `linear-gradient(${gradientAngle}deg, ${color1}, ${color2})`
        //   }
        // }}
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
              <Tooltip title="Receipt">
                <IconButton
                  onClick={() => {
                    setReceipt((prevState) => ({
                      ...prevState,
                      amount: selectedRows.reduce((sum, row) => sum + (row.grandTotal || 0), 0),
                      invoiceIdList: selectedRows.map((row) => row.invoiceId),
                      ownerName: selectedRows[0].ownerName
                    }));

                    setReceiptDialogOpen(true);
                  }}
                >
                  <ReceiptIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )
        }
      />
      {/* </ThemeProvider> */}
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
      {settleBillDialogOpen && (
        <MultiSettle
          paymentModes={paymentModes}
          settleBillDialogOpen={settleBillDialogOpen}
          selectedRows={selectedRows}
          handleClose={handleClose}
          setAlertMess={setAlertMess}
          setShowAlert={setShowAlert}
        />
      )}
      {receiptDialogOpen && (
        <Receipt
          receipt={receipt}
          setReceipt={setReceipt}
          paymentModes={paymentModes}
          receiptDialogOpen={receiptDialogOpen}
          selectedRows={selectedRows}
          handleClose={handleClose}
          setAlertMess={setAlertMess}
          setShowAlert={setShowAlert}
        />
      )}
    </>
  );
};

export default AllInvoice;
