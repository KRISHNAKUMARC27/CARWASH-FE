import React, { useState, useEffect } from 'react';
import { Breadcrumbs, Link } from '@mui/material';
import { lazy } from 'react';
import PropTypes from 'prop-types';

// project imports
import Loadable from 'ui-component/Loadable';
import CarIcon from '@mui/icons-material/DirectionsCarFilled';
import Person4Icon from '@mui/icons-material/Person4';
//import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import { Button } from '@mui/material';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { postRequest } from 'utils/fetchRequest';

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
    ownerName: null,
    ownerAddress: null,
    ownerPhoneNumber: null,
    nextFreeCheckKms: null,
    nextServiceKms: null
  };

  const [activeComponent, setActiveComponent] = useState('UserDetails');
  const [userDetails, setUserDetails] = useState(job || {});
  const [carDetails, setCarDetails] = useState(job || {});
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');

  useEffect(() => {
    return () => {
      setUserDetails({});
      setCarDetails({});
    };
  }, []);

  function isUserDetailsComplete() {
    return userDetails.ownerName && userDetails.ownerAddress && userDetails.ownerPhoneNumber;
  }

  function isCarDetailsComplete() {
    return carDetails.vehicleRegNo && carDetails.vehicleName && carDetails.kiloMeters;
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
      vehicleRegNo: carDetails.vehicleRegNo,
      vehicleName: carDetails.vehicleName,
      kiloMeters: carDetails.kiloMeters
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
      setCarDetails({});
    } catch (err) {
      console.log(err.message);
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
    }
  };

  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          sx={{
            padding: '5px 15px',
            cursor: 'pointer',
            textDecoration: 'none',
            color: (theme) => theme.palette.text.primary,
            borderBottom: isUserDetailsComplete() ? '3px solid green' : '3px solid orange',
            '&:hover': {
              color: (theme) => theme.palette.secondary.main
            }
          }}
          onClick={() => setActiveComponent('UserDetails')}
        >
          <Person4Icon sx={{ verticalAlign: 'middle', marginRight: '5px' }} />
          User Details
        </Link>
        <Link
          sx={{
            padding: '5px 15px',
            cursor: 'pointer',
            textDecoration: 'none',
            color: (theme) => theme.palette.text.primary,
            borderBottom: isCarDetailsComplete() ? '3px solid green' : '3px solid orange',
            '&:hover': {
              color: (theme) => theme.palette.secondary.main
            }
          }}
          onClick={() => setActiveComponent('CarDetails')}
        >
          <CarIcon sx={{ verticalAlign: 'middle', marginRight: '5px' }} />
          Car Details
        </Link>
      </Breadcrumbs>

      <div className="content">
        {activeComponent === 'CarDetails' && <JobCarDetails data={carDetails} updateData={setCarDetails} />}
        {activeComponent === 'UserDetails' && <JobUserDetails data={userDetails} updateData={setUserDetails} />}
      </div>
      <br></br>
      <div className="content">
        {isJobComplete() && (
          <Button variant="contained" color="error" onClick={submitJobCard}>
            Submit JobCard
          </Button>
        )}
      </div>
      {showAlert && (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert variant="filled" severity={alertColor} onClose={() => setShowAlert(false)}>
            {alertMess}
          </Alert>
        </Stack>
      )}
    </div>
  );
}

JobCardCreate.propTypes = {
  data: PropTypes.object
};
export default JobCardCreate;
