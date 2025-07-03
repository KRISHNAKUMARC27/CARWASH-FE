import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Button, Box, Typography } from '@mui/material';
import JSZip from 'jszip';

//import { gridSpacing } from 'store/constant';
import { getRequest, getRequestMultiPart, putRequest } from 'utils/fetchRequest';

const AllAttendance = () => {
  const [data, setData] = useState([]);
  const roles = JSON.parse(localStorage.getItem('roles')) || [];
  const isAuthorizedForAttendanceEdit = roles.some((role) => ['ADMIN'].includes(role));

  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [photoList, setPhotoList] = useState([]);

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

  const handleSaveRow = async ({ row, values, exitEditingMode }) => {
    try {
      // assuming your backend expects something like:
      // { employeeId, date, checkInTime, checkOutTime, leaveType }
      const payload = {
        ...row.original, // all original fields (e.g., id, employeeId, date, etc.)
        ...values // overwrite with updated checkInTime, checkOutTime, leaveType
      };
      if (isAuthorizedForAttendanceEdit) {
        console.log(JSON.stringify(payload));
        await putRequest(`${process.env.REACT_APP_API_URL}/employee/attendance`, payload);
      } else {
        alert('Not authorized to edit attendance');
        return;
      }

      // update local state
      fetchAllAttendanceData();

      exitEditingMode(); // required to exit editing mode after save
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleRowClick = async (row) => {
    const attendanceId = row.original.id;
    setPhotoList([]); // Clear current photo list

    try {
      const zipBlob = await getRequestMultiPart(`${process.env.REACT_APP_API_URL}/employee/attendance/getPhotos/${attendanceId}`);

      if (!(zipBlob instanceof Blob)) {
        throw new Error('Invalid ZIP blob received');
      }

      const jszip = new JSZip();
      const zip = await jszip.loadAsync(zipBlob);

      const filePromises = Object.keys(zip.files).map(async (filename) => {
        const fileBlob = await zip.files[filename].async('blob');
        return new File([fileBlob], filename, { type: 'image/jpeg' });
      });

      const files = await Promise.all(filePromises);
      setPhotoList(files);
      setPhotoDialogOpen(true);
    } catch (err) {
      console.error('Failed to fetch photos:', err.message);
    }
  };

  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'employeeName', //access nested data with dot notation
        header: 'Name',
        size: 100,
        enableEditing: false
        // filterVariant: 'multi-select'
      },
      {
        accessorKey: 'date', //normal accessorKey
        header: 'Date',
        size: 50,
        enableEditing: false
      },
      {
        accessorKey: 'checkInTime',
        header: 'In Time',
        size: 100,
        muiTableBodyCellEditTextFieldProps: {
          type: 'time'
        }
      },
      {
        accessorKey: 'checkOutTime',
        header: 'Out Time',
        size: 100,
        muiTableBodyCellEditTextFieldProps: {
          type: 'time'
        }
      },
      {
        accessorKey: 'workingHours',
        header: 'Working Hours',
        size: 50,
        enableEditing: false
      },
      {
        accessorKey: 'leaveType',
        header: 'Leave',
        size: 100,
        muiTableBodyCellEditTextFieldProps: {
          select: true,
          children: ['NONE', 'SICK', 'CASUAL', 'EARNED', 'UNPAID'].map((option) => (
            <MenuItem key={option} value={option === 'NONE' ? null : option}>
              {option === 'NONE' ? 'None' : option}
            </MenuItem>
          ))
        }
      }
    ],
    []
  );

  //  const globalTheme = useTheme();

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
  // const color1 = '#e2d7d5';
  // const color2 = '#4f4563';

  return (
    <>
      {/* <ThemeProvider theme={tableTheme}> */}
      <MaterialReactTable
        columns={columns}
        data={data}
        enableFacetedValues
        editingMode="modal"
        enableEditing
        // muiTablePaperProps={{
        //   elevation: 0,
        //   sx: {
        //     borderRadius: '0',
        //     //backgroundColor: "#344767",
        //     background: `linear-gradient(${gradientAngle}deg, ${color1}, ${color2})`
        //   }
        // }}
        onEditingRowSave={handleSaveRow}
        muiTableBodyRowProps={({ row }) => ({
          onClick: () => handleRowClick(row),
          sx: { cursor: 'pointer' } // optional: makes row look clickable
        })}
      />
      {/* </ThemeProvider> */}
      <Dialog open={photoDialogOpen} onClose={() => setPhotoDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Captured Attendance Photos</DialogTitle>
        <DialogContent dividers>
          {photoList.length === 0 ? (
            <Typography>No photos found.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {photoList.map((file, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Attendance ${index + 1}`}
                    style={{
                      width: 200,
                      height: 'auto', // Let it grow based on aspect ratio
                      maxHeight: 300, // Prevent overflow
                      objectFit: 'contain', // Show full image, no crop
                      border: '1px solid #ccc',
                      borderRadius: 4
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPhotoDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AllAttendance;
