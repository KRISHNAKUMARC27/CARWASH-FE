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

const SparesCreate = Loadable(lazy(() => import('views/spares/SparesCreate')));

const AllSpares = () => {
  const [data, setData] = useState([]);
  //const [sparesCategoryList, setSparesCategoryList] = useState([]);
  const [sparesDetails, setSparesDetails] = useState({});
  const [sparesUpdateOpen, setSparesUpdateOpen] = useState(false);

  useEffect(() => {
    fetchAllSparesData();
    //fetchAllSparesCategoryListData();
    return () => {
      setData([]);
      //setSparesCategoryList([]);
    };
  }, []);

  const handleClose = () => {
    setSparesUpdateOpen(false);
  };

  const fetchAllSparesData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/spares');
      setData(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'category', //access nested data with dot notation
        header: 'Category',
        size: 150,
        filterVariant: 'multi-select'
        //filterSelectOptions: sparesCategoryList
      },
      {
        accessorKey: 'partNumber', //access nested data with dot notation
        header: 'PartNo./Type',
        size: 150
      },
      {
        accessorKey: 'desc', //normal accessorKey
        header: 'Desc',
        size: 250
      },
      {
        accessorKey: 'qty',
        header: 'Quantity',
        size: 100
      },
      {
        accessorKey: 'sellRate',
        header: 'Sell Rate',
        size: 100
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        size: 100
      },
      {
        accessorKey: 'purchaseRate',
        header: 'Purchase Rate',
        size: 100
      },
      {
        accessorKey: 'rack',
        header: 'Rack/Bin',
        size: 150
      },
      {
        accessorKey: 'misc1',
        header: 'Misc 1',
        size: 150
      },
      {
        accessorKey: 'misc2',
        header: 'Units',
        size: 150
      },
      {
        accessorKey: 'misc3',
        header: 'MRP',
        size: 150
      },
      {
        accessorKey: 'minThresh',
        header: 'Min Threshold',
        size: 150
      },
      {
        accessorKey: 'minThreshDate',
        header: 'Min Threshold Date',
        size: 150
      },
      {
        accessorKey: 'updateDate',
        header: 'Update Date',
        size: 150
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
  const color2 = '#d6763c';

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
          initialState={{
            pagination: { pageSize: 10 } // Set default rows per page to 5
          }}
          renderRowActions={({ row }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <Tooltip arrow placement="left" title="Update Spares Info">
                <IconButton
                  onClick={() => {
                    setSparesUpdateOpen(false);
                    setSparesDetails(row.original);
                    setSparesUpdateOpen(true);
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

      <Dialog open={sparesUpdateOpen} onClose={handleClose} aria-labelledby="data-row-dialog-title" fullWidth maxWidth="lg">
        <DialogContent dividers style={{ backgroundColor: 'white', color: 'black' }}>
          {' '}
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h2">{'Updating Spares: ' + sparesDetails.desc}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <SparesCreate data={sparesDetails} setSparesUpdateOpen={setSparesUpdateOpen} fetchAllSparesData={fetchAllSparesData} />
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

export default AllSpares;
