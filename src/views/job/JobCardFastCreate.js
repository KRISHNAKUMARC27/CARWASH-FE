import React, { useState } from 'react';
import { Grid, TextField, Button } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import JobServiceUpdate from './JobServiceUpdate';
import JobSparesUpdate from './JobSparesUpdate';
import AlertDialog from 'views/utilities/AlertDialog';
import { postRequest } from 'utils/fetchRequest';

const JobCardFastCreate = () => {
  const [fastJobCard, setFastJobCard] = useState({});
  const [jobServiceInfo, setJobServiceInfo] = useState([]);
  const [jobSparesInfo, setJobSparesInfo] = useState([]);

  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');

  const handleInputChange = (field, value) => {
    const updatedData = { ...fastJobCard, [field]: value };
    setFastJobCard(updatedData);
  };

  const handleClose = () => {
    setFastJobCard({});
    setJobSparesInfo([]);
    setJobServiceInfo([]);
  };

  function isUserDetailsComplete() {
    return fastJobCard.ownerName && fastJobCard.ownerAddress && fastJobCard.ownerPhoneNumber;
  }

  function isCarDetailsComplete() {
    return fastJobCard.vehicleRegNo && fastJobCard.vehicleName;
  }

  function isJobComplete() {
    return isUserDetailsComplete() && isCarDetailsComplete();
  }

  const submitFastJobCard = async () => {
    const payload = {
      ...fastJobCard,
      jobServiceInfo: jobServiceInfo,
      jobSparesInfo: jobSparesInfo
    };
    try {
      await postRequest(process.env.REACT_APP_API_URL + '/jobCard/fastjobCard', payload);
      handleClose();
      setAlertMess('Jobcard created for ' + payload.vehicleRegNo);
      setAlertColor('success');
      setShowAlert(true);
    } catch (err) {
      console.log(err.message);
      handleClose();
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
    }
  };

  return (
    <>
      <MainCard title="Job Card Details">
        <Grid container direction="row" spacing={gridSpacing}>
          <Grid item xs={3}>
            <TextField
              label="Owner Name"
              required
              variant="outlined"
              value={fastJobCard.ownerName || ''}
              onChange={(e) => handleInputChange('ownerName', e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Owner PhoneNumber"
              required
              variant="outlined"
              value={fastJobCard.ownerPhoneNumber || ''}
              onChange={(e) => handleInputChange('ownerPhoneNumber', e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Owner Address"
              required
              fullWidth
              variant="outlined"
              value={fastJobCard.ownerAddress || ''}
              onChange={(e) => handleInputChange('ownerAddress', e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Vehicle Reg. No."
              required
              variant="outlined"
              value={fastJobCard.vehicleRegNo || ''}
              onChange={(e) => handleInputChange('vehicleRegNo', e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Vehicle Name"
              required
              variant="outlined"
              value={fastJobCard.vehicleName || ''}
              onChange={(e) => handleInputChange('vehicleName', e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Vehicle K.Ms"
              variant="outlined"
              value={fastJobCard.kiloMeters || ''}
              onChange={(e) => handleInputChange('kiloMeters', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <JobServiceUpdate data={jobServiceInfo} updateData={setJobServiceInfo} />
          </Grid>
          <Grid item xs={12}>
            <JobSparesUpdate data={jobSparesInfo} updateData={setJobSparesInfo} />
          </Grid>
          {isJobComplete() && (
            <Grid item xs={12}>
              <Button variant="contained" color="error" onClick={submitFastJobCard}>
                Save JobCard
              </Button>
            </Grid>
          )}
        </Grid>
      </MainCard>
      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}
    </>
  );
};
export default JobCardFastCreate;
