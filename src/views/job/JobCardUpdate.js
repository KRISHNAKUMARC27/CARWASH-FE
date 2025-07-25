import React, { useMemo, useState, useEffect } from 'react';
import { lazy } from 'react';

import Loadable from 'ui-component/Loadable';
import { MaterialReactTable } from 'material-react-table';
import {
  createTheme,
  ThemeProvider,
  useTheme,
  IconButton,
  Tooltip,
  Grid,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  Box
} from '@mui/material';
import { Edit, Build } from '@mui/icons-material';

import JSZip from 'jszip';

const JobUserDetails = Loadable(lazy(() => import('views/job/JobUserDetails')));
const JobCarDetails = Loadable(lazy(() => import('views/job/JobCarDetails')));
//const JobInfo = Loadable(lazy(() => import('views/job/JobInfo')));
const JobSparesUpdate = Loadable(lazy(() => import('views/job/JobSparesUpdate')));

const JobServiceUpdate = Loadable(lazy(() => import('views/job/JobServiceUpdate')));
import { getRequest, putRequest, postRequest, getRequestMultiPart, postRequestMultiPart } from 'utils/fetchRequest';
import AlertDialog from 'views/utilities/AlertDialog';

const JobCardUpdate = () => {
  const [data, setData] = useState([]);
  // const [jobInfoOpen, setJobInfoOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedRowJobCard, setSelectedRowJobCard] = useState({});
  const [selectedRowJobSpares, setSelectedRowJobSpares] = useState({});

  // const [userDetails, setUserDetails] = useState({});
  // const [carDetails, setCarDetails] = useState({});
  const [photos, setPhotos] = useState([]);
  const [zipFile, setZipFile] = useState();
  const [jobInfoUpdateOpen, setJobInfoUpdateOpen] = useState(false);

  const [jobSparesCost, setJobSparesCost] = useState({});
  const [jobSparesInfo, setJobSparesInfo] = useState(
    [...Array(1)].map(() => ({ sparesId: '', category: '', sparesAndLabour: '', qty: '', rate: '', amount: '', discount: '', action: '' }))
  );
  const [jobServiceInfo, setJobServiceInfo] = useState(
    [...Array(1)].map(() => ({ sparesId: '', category: '', sparesAndLabour: '', qty: '0', rate: '0', amount: '0', discount: '0' }))
  );
  const [jobSparesUpdateOpen, setJobSparesUpdateOpen] = useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');

  useEffect(() => {
    findAllByJobStatusOpen();

    return () => {
      setData([]);
    };
  }, []);

  // useEffect(() => {
  //   if (photos.length > 0 || selectedRow.jobId) {
  //     setJobInfoUpdateOpen(true); // Open dialog only after photos are set
  //   }
  // }, [photos, selectedRow]);

  const findAllByJobStatusOpen = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/jobCard/status/OPEN');
      setData(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getJobSpares = async (id) => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/jobCard/jobSpares/' + id);
      setSelectedRowJobSpares(data);
      setJobSparesInfo(data.jobSparesInfo);
      setJobServiceInfo(data.jobServiceInfo);
      let sparesCost = {
        totalSparesValue: data.totalSparesValue,
        totalServiceValue: data.totalServiceValue,
        grandTotal: data.grandTotal
      };
      setJobSparesCost(sparesCost);
      setJobSparesUpdateOpen(true);
    } catch (err) {
      console.error(err.message);
    }
  };

  const updateJobInfo = async (row) => {
    try {
      const zipBlob = await getRequestMultiPart(process.env.REACT_APP_API_URL + '/jobCard/getPhotos/' + row.id);
      console.log('Got zipblob');
      // if (zipBlob) {
      //   const jszip = new JSZip();
      //   const zip = await jszip.loadAsync(zipBlob);
      //   const files = [];
      //   zip.forEach(async (relativePath, file) => {
      //     const fileBlob = await file.async('blob');
      //     files.push(new File([fileBlob], relativePath, { type: 'image/jpeg' }));
      //   });
      //   setPhotos(files); // Initialize photos with unzipped files
      //   console.log('photos are set');
      //   setSelectedRow(row);
      // }
      setZipFile(zipBlob);
      setSelectedRow(row);
      setJobInfoUpdateOpen(true);
    } catch (err) {
      setPhotos([]);
      setSelectedRow(row);
      setJobInfoUpdateOpen(true);
    }

    // setUserDetails(row);
    // setCarDetails(row);
  };

  function isUserDetailsComplete() {
    return selectedRow.ownerName && selectedRow.ownerPhoneNumber;
  }

  function isCarDetailsComplete() {
    return selectedRow.vehicleRegNo && selectedRow.vehicleName;
  }

  // function isJobInfoComplete() {
  //   console.log(JSON.stringify(jobInfo));
  //   return jobInfo[0].complaints;
  // }

  function isJobComplete() {
    return isUserDetailsComplete() && isCarDetailsComplete();
  }

  function isJobSparesUpdateComplete() {
    //return jobSparesInfo[0]?.sparesAndLabour || jobServiceInfo?.[0]?.sparesAndLabour;
    return jobSparesInfo || jobServiceInfo;
  }

  const submitJobCard = () => {
    updateJobCard(selectedRow);
  };

  const updateJobCard = async (payload) => {
    try {
      const data = await putRequest(process.env.REACT_APP_API_URL + '/jobCard', payload);

      if (photos.length === 0) {
        console.log('No photos to upload.');
        setAlertMess('Job Card updated successfully. No photos to upload');
        setAlertColor('success');
        setShowAlert(true);
        handleClose();
        return;
      }
      const zip = new JSZip();
      photos.forEach((photo, index) => {
        console.log(index);
        zip.file(photo.name, photo);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });

      const formData = new FormData();
      formData.append('file', new File([zipBlob], 'photos.zip', { type: 'application/zip' }));

      try {
        await postRequestMultiPart(process.env.REACT_APP_API_URL + '/jobCard/uploadPhotos/' + data.id, formData);
        setPhotos([]);
      } catch (err) {
        console.log(err.message);
      }

      handleClose();
    } catch (err) {
      console.log(err.message);
      handleClose();
      setAlertMess(err.message);
      setShowAlert(true);
    }
  };

  const updateJobSparesInfo = (row) => {
    setSelectedRowJobCard(row);
    getJobSpares(row.id);
  };

  // function formatPrice(value) {
  //   const number = parseFloat(value);
  //   return isNaN(number) ? value : number.toFixed(2);
  // }
  const handleTotalSparesValueChange = (value) => {
    const updatedData = { ...jobSparesCost, totalSparesValue: value };
    setJobSparesCost(updatedData);
  };
  const handleTotalServiceValueChange = (value) => {
    const updatedData = { ...jobSparesCost, totalServiceValue: value };
    setJobSparesCost(updatedData);
  };
  const handleGrandTotalValueChange = (value) => {
    const updatedData = { ...jobSparesCost, grandTotal: value };
    setJobSparesCost(updatedData);
  };

  const sumAmounts = (data) => {
    if (!Array.isArray(data)) return 0;

    return data
      .filter((row) => row.action !== 'DELETE')
      .reduce((total, currentRow) => {
        // Convert amount to a number in case it's a string, and handle any non-numeric values gracefully
        const amount = Number(currentRow.amount) || 0;
        return total + amount;
      }, 0); // Start with a total of 0
  };

  const hasEmptyRow = (rows) =>
    Array.isArray(rows) &&
    rows.some(
      ({ sparesId, category, sparesAndLabour, qty, rate, amount }) => !sparesId || !category || !sparesAndLabour || !qty || !rate || !amount
    );

  const submitJobSpares = () => {
    if (hasEmptyRow(jobServiceInfo) || hasEmptyRow(jobSparesInfo)) {
      alert('Please fill all required fields in Service or Spares');
      return;
    }
    const totalSparesValue = sumAmounts(jobSparesInfo);
    handleTotalSparesValueChange(totalSparesValue);
    const totalServiceValue = sumAmounts(jobServiceInfo);
    handleTotalServiceValueChange(totalServiceValue);
    const grandTotalValue = totalSparesValue + totalServiceValue;
    handleGrandTotalValueChange(grandTotalValue);

    const jobSpares = {
      ...selectedRowJobSpares,
      id: selectedRowJobCard.id,
      jobId: selectedRowJobCard.jobId,
      jobSparesInfo: jobSparesInfo,
      jobServiceInfo: jobServiceInfo,
      totalSparesValue: totalSparesValue,
      totalServiceValue: totalServiceValue,
      grandTotal: grandTotalValue
    };

    updateJobSpares(jobSpares);
  };

  const updateJobSpares = async (payload) => {
    try {
      await postRequest(process.env.REACT_APP_API_URL + '/jobCard/jobSpares', payload);
      handleClose();
    } catch (err) {
      console.log(err.message);
      //handleClose();
      setAlertMess(err.message);
      setAlertColor('error');
      setShowAlert(true);
    }
  };

  const handleClose = () => {
    findAllByJobStatusOpen();
    setPhotos([]);
    setJobInfoUpdateOpen(false);
    setSelectedRow({});
    setJobSparesUpdateOpen(false);
    setSelectedRowJobCard({});
    setJobSparesInfo(
      [...Array(1)].map(() => ({ sparesId: '', category: '', sparesAndLabour: '', qty: '', rate: '', discount: '', amount: '' }))
    );
    setJobServiceInfo(
      [...Array(1)].map(() => ({ sparesId: '', category: '', sparesAndLabour: '', qty: '0', rate: '0', discount: '', amount: '0' }))
    );
    setJobSparesCost({});
  };

  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'jobId', //access nested data with dot notation
        header: 'Job Card No.',
        size: 150
      },
      {
        accessorKey: 'jobStatus', //access nested data with dot notation
        header: 'Status',
        size: 150,
        filterVariant: 'select',
        filterSelectOptions: ['OPEN', 'CLOSED', 'CANCELLED']
      },
      {
        accessorKey: 'ownerName', //access nested data with dot notation
        header: 'Owner Name',
        size: 150
      },
      {
        accessorKey: 'ownerPhoneNumber', //normal accessorKey
        header: 'Phone',
        size: 200
      },
      {
        accessorKey: 'vehicleRegNo',
        header: 'Reg. No.',
        size: 150
      },
      {
        accessorKey: 'vehicleName',
        header: 'Vehicle Name',
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
  const color1 = '#d3d9ae';
  const color2 = '#f3f1e9';

  function Divider() {
    return (
      <hr
        style={{
          color: '#000000',
          backgroundColor: '#000000',
          height: 1,
          borderColor: '#000000'
        }}
      />
    );
  }

  return (
    <Box>
      {/* Table View */}
      <ThemeProvider theme={tableTheme}>
        <MaterialReactTable
          columns={columns}
          data={data}
          editingMode="modal"
          enableEditing
          muiTablePaperProps={{
            elevation: 0,
            sx: {
              borderRadius: 0,
              background: `linear-gradient(${gradientAngle}deg, ${color1}, ${color2})`
            }
          }}
          renderRowActions={({ row }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <Tooltip arrow placement="left" title="Update Job Info">
                <IconButton onClick={() => updateJobInfo(row.original)}>
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip arrow placement="right" title="Update Job Service">
                <IconButton onClick={() => updateJobSparesInfo(row.original)}>
                  <Build />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        />
      </ThemeProvider>

      {/* Dialog: Update Job Info */}
      <Dialog open={jobInfoUpdateOpen} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogContent dividers sx={{ bgcolor: 'white', color: 'black' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Updating JobCard: {selectedRow.jobId} &nbsp; Vehicle No.: {selectedRow.vehicleRegNo}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <JobUserDetails data={selectedRow} updateData={setSelectedRow} />
            </Grid>
            <Grid item xs={12}>
              <JobCarDetails data={selectedRow} updateData={setSelectedRow} photos={photos} updatePhotos={setPhotos} zipFile={zipFile} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button variant="contained" color="error" fullWidth onClick={handleClose}>
                Cancel Update
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              {isJobComplete() && (
                <Button variant="contained" color="success" fullWidth onClick={submitJobCard}>
                  Update JobCard
                </Button>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Update Spares */}
      <Dialog open={jobSparesUpdateOpen} onClose={handleClose} fullWidth maxWidth="xl">
        <DialogContent dividers sx={{ bgcolor: 'white', color: 'black' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Updating Spares for JobCard: {selectedRowJobCard.jobId} &nbsp; Vehicle No.: {selectedRowJobCard.vehicleRegNo}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <JobServiceUpdate data={jobServiceInfo} updateData={setJobServiceInfo} />
            </Grid>
            <Grid item xs={12}>
              <JobSparesUpdate data={jobSparesInfo} updateData={setJobSparesInfo} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Total Service Value"
                required
                variant="outlined"
                value={jobSparesCost.totalServiceValue || ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Total Spares Value"
                required
                variant="outlined"
                value={jobSparesCost.totalSparesValue || ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Grand Total"
                required
                variant="outlined"
                value={jobSparesCost.grandTotal || ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Grid container spacing={2} sx={{ px: 2, pb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Button variant="contained" color="error" fullWidth onClick={handleClose}>
                Cancel
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              {isJobSparesUpdateComplete() && (
                <Button variant="contained" color="success" fullWidth onClick={submitJobSpares}>
                  Update ServiceInfo
                </Button>
              )}
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>

      {/* Alert Dialog */}
      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}
    </Box>
  );
};

export default JobCardUpdate;
