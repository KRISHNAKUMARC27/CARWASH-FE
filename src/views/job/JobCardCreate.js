import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { lazy } from 'react';
import PropTypes from 'prop-types';

// project imports
import Loadable from 'ui-component/Loadable';
import JSZip from 'jszip';

import { postRequest, postRequestMultiPart } from 'utils/fetchRequest';
import { sendJobPhotosViaWhatsApp } from 'utils/WhatsAppUtils';
import AlertDialog from 'views/utilities/AlertDialog';
import MainCard from 'ui-component/cards/MainCard';

const JobUserDetails = Loadable(lazy(() => import('views/job/JobUserDetails')));
const JobCarDetails = Loadable(lazy(() => import('views/job/JobCarDetails')));
const JobSparesUpdate = Loadable(lazy(() => import('views/job/JobSparesUpdate')));
const JobServiceUpdate = Loadable(lazy(() => import('views/job/JobServiceUpdate')));
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

  const [userDetails, setUserDetails] = useState(job || {});
  //const [carDetails, setCarDetails] = useState(job || {});
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');
  const [photos, setPhotos] = React.useState([]);
  // const [zipFile, setZipFile] = useState();
  const [jobServiceInfo, setJobServiceInfo] = useState([]);
  const [jobSparesInfo, setJobSparesInfo] = useState([]);

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

  const submitJobCard = (WhatsAppFlag) => {
    const jobCard = {
      jobCard: userDetails,
      jobSparesInfo: jobSparesInfo,
      jobServiceInfo: jobServiceInfo
    };

    saveJobCard(jobCard, WhatsAppFlag);
  };

  const saveJobCard = async (payload, WhatsAppFlag) => {
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
        if (WhatsAppFlag === true) {
          sendJobPhotosViaWhatsApp(data);
          setPhotos([]);
        } else {
          setAlertMess('Photos uploaded for ' + data.vehicleRegNo + ' successfully');
          setAlertColor('success');
          setShowAlert(true);
          setPhotos([]);
        }
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
      <MainCard title="Enter JobCard Details">
        <Box className="content" sx={{ mt: 2 }}>
          <JobUserDetails data={userDetails} updateData={setUserDetails} />
          <JobCarDetails data={userDetails} updateData={setUserDetails} photos={photos} updatePhotos={setPhotos} />
          <JobServiceUpdate data={jobServiceInfo} updateData={setJobServiceInfo} />
          <JobSparesUpdate data={jobSparesInfo} updateData={setJobSparesInfo} />
        </Box>

        <Box className="content" sx={{ mt: 3 }}>
          {isJobComplete() && (
            <Button variant="contained" color="success" onClick={() => submitJobCard(false)}>
              Submit JobCard
            </Button>
          )}
        </Box>
        <Box className="content" sx={{ mt: 3 }}>
          {isJobComplete() && (
            <Button variant="contained" color="success" onClick={() => submitJobCard(true)} disabled={photos.length === 0}>
              Submit JobCard & Send Photos via WhatsApp
            </Button>
          )}
        </Box>
      </MainCard>
      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}
    </Box>
  );
}

JobCardCreate.propTypes = {
  data: PropTypes.object
};
export default JobCardCreate;
