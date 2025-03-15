import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { createTheme, ThemeProvider, useTheme, Tooltip, IconButton, Box } from '@mui/material';
import { Edit, FactCheck } from '@mui/icons-material';
import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import { getRequest } from 'utils/fetchRequest';
import AlertDialog from 'views/utilities/AlertDialog';
const BillPayment = Loadable(lazy(() => import('views/estimate/BillPayment')));
const MultiSettle = Loadable(lazy(() => import('views/estimate/MultiSettle')));

const CreditEstimate = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMess, setAlertMess] = useState('');
  const [data, setData] = useState([]);
  const [estimate, setEstimate] = useState();
  const [estimateCreateOpen, setEstimateCreateOpen] = useState(false);

  const [rowSelection, setRowSelection] = useState({});
  const selectedRows = useMemo(() => Object.keys(rowSelection).map((key) => data[key]), [rowSelection, data]);

  const [settleBillDialogOpen, setSettleBillDialogOpen] = useState(false);
  const [paymentModes, setPaymentModes] = useState([]);

  useEffect(() => {
    fetchCreditOpenEstimateData();
    getPaymentModes();

    return () => {
      setData([]);
      setPaymentModes([]);
    };
  }, []);

  const fetchCreditOpenEstimateData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/estimate/findByCreditFlag');
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
    setEstimateCreateOpen(false);
    setEstimate({});
    setSettleBillDialogOpen(false);
    fetchCreditOpenEstimateData();
  };

  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'estimateId', //access nested data with dot notation
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
      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}
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
              <Tooltip arrow placement="right" title="Estimate">
                <IconButton
                  onClick={() => {
                    setEstimate(row.original);
                    setEstimateCreateOpen(true);
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
      {estimateCreateOpen && (
        <BillPayment
          estimate={estimate}
          setEstimate={setEstimate}
          paymentModes={paymentModes}
          estimateCreateOpen={estimateCreateOpen}
          handleClose={handleClose}
          setAlertMess={setAlertMess}
          setShowAlert={setShowAlert}
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
    </>
  );
};

export default CreditEstimate;
