import React, { useState, useEffect } from 'react';
import { Breadcrumbs, Link, Box, useTheme } from '@mui/material';
import { lazy } from 'react';
import PropTypes from 'prop-types';

// project imports
import Loadable from 'ui-component/Loadable';
import CarIcon from '@mui/icons-material/DirectionsCarFilled';
import Person4Icon from '@mui/icons-material/Person4';
//import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import { Button } from '@mui/material';
import JSZip from 'jszip';

import { postRequest, postRequestMultiPart } from 'utils/fetchRequest';
import AlertDialog from 'views/utilities/AlertDialog';

const JobUserDetails = Loadable(lazy(() => import('views/job/JobUserDetails')));
const JobCarDetails = Loadable(lazy(() => import('views/job/JobCarDetails')));
//const JobInfo = Loadable(lazy(() => import('views/job/JobInfo')));

function JobCardCreate({ data }) {
  const job = {
    ...data,
    id: null,
    estimateObjId: null,
    invoiceObjId: null,
    jobId: null,

    jobStatus: null,
    jobCreationDate: null,
    jobCloseDate: null,
    billGenerated: false,
    kiloMeters: null,
    // ownerName: null,
    // ownerAddress: null,
    // ownerPhoneNumber: null,
    nextFreeCheckKms: null,
    nextServiceKms: null
  };

  const theme = useTheme();
  const [activeComponent, setActiveComponent] = useState('UserDetails');
  const [userDetails, setUserDetails] = useState(job || {});
  //const [carDetails, setCarDetails] = useState(job || {});
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');
  const [photos, setPhotos] = React.useState([]);
  // const [zipFile, setZipFile] = useState();

  useEffect(() => {
    return () => {
      setUserDetails({});
      //setCarDetails({});
    };
  }, []);

  function isUserDetailsComplete() {
    return userDetails.ownerName && userDetails.ownerPhoneNumber;
  }

  function isCarDetailsComplete() {
    return userDetails.vehicleRegNo && userDetails.vehicleName;
  }

  function isJobComplete() {
    return isUserDetailsComplete() && isCarDetailsComplete();
  }

  const submitJobCard = () => {
    const jobCard = {
      jobStatus: 'OPEN',
      ownerName: userDetails.ownerName,
      ownerAddress: userDetails.ownerAddress,
      ownerPhoneNumber: userDetails.ownerPhoneNumber,
      ownerEmailId: userDetails.ownerEmailId,
      vehicleRegNo: userDetails.vehicleRegNo,
      vehicleName: userDetails.vehicleName,
      kiloMeters: userDetails.kiloMeters
    };

    saveJobCard(jobCard);
  };

  const saveJobCard = async (payload) => {
    try {
      const data = await postRequest(process.env.REACT_APP_API_URL + '/jobCard', payload);
      setAlertMess('JobCard ' + data.jobId + ' for ' + data.vehicleRegNo + ' created successfully');
      setAlertColor('success');
      setShowAlert(true);
      setUserDetails({});
      if (photos.length === 0) {
        console.log('No photos to upload.');
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
        setAlertMess('Photos uploaded for ' + data.vehicleRegNo + ' successfully');
        setAlertColor('success');
        setShowAlert(true);
        setPhotos([]);
      } catch (err) {
        console.log(err.message);
        setAlertMess(err.message);
        setAlertColor('info');
        setShowAlert(true);
      }
    } catch (err) {
      console.log(err.message);
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
    }
  };

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ flexWrap: 'wrap', display: 'flex' }}>
        <Link
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 1,
            cursor: 'pointer',
            textDecoration: 'none',
            color: theme.palette.text.primary,
            borderBottom: isUserDetailsComplete() ? '3px solid green' : '3px solid orange',
            '&:hover': {
              color: theme.palette.secondary.main
            }
          }}
          onClick={() => setActiveComponent('UserDetails')}
        >
          <Person4Icon sx={{ mr: 1 }} />
          User Details
        </Link>

        <Link
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 1,
            cursor: 'pointer',
            textDecoration: 'none',
            color: theme.palette.text.primary,
            borderBottom: isCarDetailsComplete() ? '3px solid green' : '3px solid orange',
            '&:hover': {
              color: theme.palette.secondary.main
            }
          }}
          onClick={() => setActiveComponent('CarDetails')}
        >
          <CarIcon sx={{ mr: 1 }} />
          Car Details
        </Link>
      </Breadcrumbs>

      <Box className="content" sx={{ mt: 2 }}>
        {activeComponent === 'CarDetails' && (
          <JobCarDetails data={userDetails} updateData={setUserDetails} photos={photos} updatePhotos={setPhotos} />
        )}
        {activeComponent === 'UserDetails' && <JobUserDetails data={userDetails} updateData={setUserDetails} />}
      </Box>

      <Box className="content" sx={{ mt: 3 }}>
        {isJobComplete() && (
          <Button variant="contained" color="error" onClick={submitJobCard}>
            Submit JobCard
          </Button>
        )}
      </Box>

      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}
    </Box>
  );
}

JobCardCreate.propTypes = {
  data: PropTypes.object
};
export default JobCardCreate;
