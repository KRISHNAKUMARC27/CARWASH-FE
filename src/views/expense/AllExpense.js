import React, { useMemo, useState, useEffect, lazy } from 'react';
import { MaterialReactTable } from 'material-react-table';
import {
  createTheme,
  ThemeProvider,
  useTheme,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Grid,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  Button
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { gridSpacing } from 'store/constant';
import Loadable from 'ui-component/Loadable';
import { getRequest } from 'utils/fetchRequest';

const ExpenseCreate = Loadable(lazy(() => import('views/expense/ExpenseCreate')));

const AllExpense = () => {
  const [data, setData] = useState([]);
  const [expenseDetails, setExpenseDetails] = useState({});
  const [expenseUpdateOpen, setExpenseUpdateOpen] = useState(false);

  useEffect(() => {
    fetchAllExpenseData();
    return () => {
      setData([]);
    };
  }, []);

  const handleClose = () => {
    setExpenseUpdateOpen(false);
  };

  const fetchAllExpenseData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/expense');
      setData(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'type', //access nested data with dot notation
        header: 'Category',
        size: 150,
        filterVariant: 'multi-select'
      },
      {
        accessorKey: 'desc', //normal accessorKey
        header: 'Description',
        size: 250
      },
      {
        accessorKey: 'expenseAmount',
        header: 'Amount',
        size: 100
      },
      {
        accessorKey: 'date',
        header: 'Date',
        size: 100
      },
      {
        accessorKey: 'paymentMode',
        header: 'Mode',
        size: 100
      },
      {
        accessorKey: 'comment',
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
  const color2 = '#4f4563';

  return (
    <div>
      <ThemeProvider theme={tableTheme}>
        <MaterialReactTable
          columns={columns}
          data={data}
          enableFacetedValues
          editingMode="modal"
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
              <Tooltip arrow placement="left" title="Update Expense Info">
                <IconButton
                  onClick={() => {
                    setExpenseUpdateOpen(false);
                    setExpenseDetails(row.original);
                    setExpenseUpdateOpen(true);
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        />{' '}
      </ThemeProvider>
      <br></br>

      <Dialog open={expenseUpdateOpen} onClose={handleClose} aria-labelledby="data-row-dialog-title" fullWidth maxWidth="lg">
        <DialogContent dividers style={{ backgroundColor: 'white', color: 'black' }}>
          {' '}
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h2">{'Updating Expense: ' + expenseDetails.desc}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <ExpenseCreate
                    data={expenseDetails}
                    setExpenseUpdateOpen={setExpenseUpdateOpen}
                    fetchAllExpenseData={fetchAllExpenseData}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <br></br>
    </div>
  );
};

export default AllExpense;
