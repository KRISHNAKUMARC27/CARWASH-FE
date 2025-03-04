import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { createTheme, ThemeProvider, useTheme } from '@mui/material';
//import { gridSpacing } from 'store/constant';
import { getRequest } from 'utils/fetchRequest';

const AllAttendance = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchAllAttendanceData();
    return () => {
      setData([]);
    };
  }, []);

  const fetchAllAttendanceData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/employee/attendance');
      setData(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'employeeName', //access nested data with dot notation
        header: 'Name',
        size: 100
        // filterVariant: 'multi-select'
      },
      {
        accessorKey: 'date', //normal accessorKey
        header: 'Date',
        size: 50
      },
      {
        accessorKey: 'checkInTime',
        header: 'In Time',
        size: 100
      },
      {
        accessorKey: 'checkOutTime',
        header: 'Out Time',
        size: 100
      },
      {
        accessorKey: 'workingHours',
        header: 'Working Hours',
        size: 50
      },
      {
        accessorKey: 'leaveType',
        header: 'Leave',
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
        />{' '}
      </ThemeProvider>
    </div>
  );
};

export default AllAttendance;
