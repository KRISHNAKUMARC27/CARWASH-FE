import React, { useState, useRef } from 'react';
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
  const [showAlert, setShowAlert] = useState(false);
  const [alertMess, setAlertMess] = useState('');
  const [alertColor, setAlertColor] = useState('');

  // Refs for each field
  const ownerNameRef = useRef();
  const ownerPhoneRef = useRef();
  const ownerAddressRef = useRef();
  const vehicleRegNoRef = useRef();
  const vehicleNameRef = useRef();
  const kiloMetersRef = useRef();
  const jobServiceFirstInputRef = useRef();

  const handleInputChange = (field, value) => {
    setFastJobCard({ ...fastJobCard, [field]: value });
  };

  const handleEnter = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nextRef?.current?.focus();
    }
  };

  const handleClose = () => {
    setFastJobCard({});
    setJobSparesInfo([]);
    setJobServiceInfo([]);
  };

  const isUserDetailsComplete = () => fastJobCard.ownerName && fastJobCard.ownerPhoneNumber;

  const isCarDetailsComplete = () => fastJobCard.vehicleRegNo && fastJobCard.vehicleName;

  const isJobComplete = () => isUserDetailsComplete() && isCarDetailsComplete();

  const hasEmptyRow = (rows) =>
    rows.some(
      ({ sparesId, category, sparesAndLabour, qty, rate, amount }) => !sparesId || !category || !sparesAndLabour || !qty || !rate || !amount
    );

  const submitFastJobCard = async () => {
    if (hasEmptyRow(jobServiceInfo) || hasEmptyRow(jobSparesInfo)) {
      alert('Please fill all required fields in Service or Spares');
      return;
    }
    const payload = {
      ...fastJobCard,
      jobServiceInfo,
      jobSparesInfo
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
              inputRef={ownerNameRef}
              label="Owner Name"
              required
              variant="outlined"
              value={fastJobCard.ownerName || ''}
              onChange={(e) => handleInputChange('ownerName', e.target.value)}
              onKeyDown={(e) => handleEnter(e, ownerPhoneRef)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              inputRef={ownerPhoneRef}
              label="Owner PhoneNumber"
              required
              variant="outlined"
              value={fastJobCard.ownerPhoneNumber || ''}
              onChange={(e) => handleInputChange('ownerPhoneNumber', e.target.value)}
              onKeyDown={(e) => handleEnter(e, ownerAddressRef)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              inputRef={ownerAddressRef}
              label="Owner Address"
              fullWidth
              variant="outlined"
              value={fastJobCard.ownerAddress || ''}
              onChange={(e) => handleInputChange('ownerAddress', e.target.value)}
              onKeyDown={(e) => handleEnter(e, vehicleRegNoRef)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              inputRef={vehicleRegNoRef}
              label="Vehicle Reg. No."
              required
              variant="outlined"
              value={fastJobCard.vehicleRegNo || ''}
              onChange={(e) => handleInputChange('vehicleRegNo', e.target.value)}
              onKeyDown={(e) => handleEnter(e, vehicleNameRef)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              inputRef={vehicleNameRef}
              label="Vehicle Name"
              required
              variant="outlined"
              value={fastJobCard.vehicleName || ''}
              onChange={(e) => handleInputChange('vehicleName', e.target.value)}
              onKeyDown={(e) => handleEnter(e, kiloMetersRef)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              inputRef={kiloMetersRef}
              label="Vehicle K.Ms"
              variant="outlined"
              value={fastJobCard.kiloMeters || ''}
              onChange={(e) => handleInputChange('kiloMeters', e.target.value)}
              onKeyDown={(e) => handleEnter(e, jobServiceFirstInputRef)} // No next field here
            />
          </Grid>

          <Grid item xs={12}>
            <JobServiceUpdate data={jobServiceInfo} updateData={setJobServiceInfo} firstInputRef={jobServiceFirstInputRef} />
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
