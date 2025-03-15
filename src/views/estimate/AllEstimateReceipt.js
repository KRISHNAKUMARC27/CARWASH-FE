import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { createTheme, ThemeProvider, useTheme, Tooltip, IconButton, Box } from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';
import AlertDialog from 'views/utilities/AlertDialog';
// project imports
import { getRequest, getBlobRequest } from 'utils/fetchRequest';

const AllEstimateReceipt = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMess, setAlertMess] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchEstimateReceiptData();

    return () => {
      setData([]);
    };
  }, []);

  const fetchEstimateReceiptData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/estimate/receipt');
      setData(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const printReceiptPDF = async (receipt) => {
    try {
      const blob = await getBlobRequest(process.env.REACT_APP_API_URL + '/estimate/receiptPdf/' + receipt.id);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'Receipt_' + receipt.receiptId + '.pdf'); // Use the filename you wish
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setAlertMess('Generated Estimate. Check downloads');
      setShowAlert(true);
    } catch (err) {
      onClose();
      console.log(err.message);
      setAlertMess(err.message);
      setShowAlert(true);
    }
  };

  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'receiptId', //access nested data with dot notation
        header: 'Id',
        size: 50
        //filterVariant: 'multi-select'
      },
      {
        accessorKey: 'amount',
        header: 'Receipt Amt',
        size: 50
      },
      {
        accessorKey: 'estimateIdList',
        header: 'Estimate Ids',
        size: 100,
        Cell: ({ row }) => row.original.estimateIdList?.join(', ') || 'N/A' // Format as comma-separated string
      },
      {
        accessorKey: 'paymentMode',
        header: 'Payment Mode',
        size: 50
      },
      {
        accessorKey: 'comment', //access nested data with dot notation
        header: 'Comment',
        size: 100
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
          muiTablePaperProps={{
            elevation: 0,
            sx: {
              borderRadius: '0',
              background: `linear-gradient(${gradientAngle}deg, ${color1}, ${color2})`
            }
          }}
          renderRowActions={({ row }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <Tooltip arrow placement="right" title="Receipt PDF">
                <IconButton
                  onClick={() => {
                    printReceiptPDF(row.original);
                  }}
                >
                  <PictureAsPdf />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        />
      </ThemeProvider>
    </>
  );
};

export default AllEstimateReceipt;
