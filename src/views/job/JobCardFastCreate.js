import React, { useState, useRef, useEffect } from 'react';
import { Grid, TextField, Button, MenuItem, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import JobServiceUpdate from './JobServiceUpdate';
import JobSparesUpdate from './JobSparesUpdate';
import AlertDialog from 'views/utilities/AlertDialog';
import { postRequest, getBlobRequest, getRequest } from 'utils/fetchRequest';

const JobCardFastCreate = () => {
  const roles = JSON.parse(localStorage.getItem('roles')) || [];
  const [fastJobCard, setFastJobCard] = useState({
    billType: roles.includes('INVOICE') ? 'INVOICE' : 'ESTIMATE',
    paymentMode: 'CASH'
  });
  const [jobServiceInfo, setJobServiceInfo] = useState([]);
  const [jobSparesInfo, setJobSparesInfo] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMess, setAlertMess] = useState('');
  const [alertColor, setAlertColor] = useState('');
  const [paymentModes, setPaymentModes] = useState([]);
  const [openPrintBillMsg, setOpenPrintBillMsg] = useState(false);

  // Refs for each field
  const ownerNameRef = useRef();
  const ownerPhoneRef = useRef();
  const ownerAddressRef = useRef();
  const vehicleRegNoRef = useRef();
  const vehicleNameRef = useRef();
  const kiloMetersRef = useRef();
  const jobServiceFirstInputRef = useRef();

  useEffect(() => {
    getPaymentModes();

    return () => {
      setPaymentModes([]);
    };
  }, []);

  const getPaymentModes = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/config/paymentmodes');
      setPaymentModes(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'ownerPhoneNumber') {
      if (!/^\d*$/.test(value)) return; // only digits
      if (value.length > 10) return; // max 10 digits
      if (/^(\d)\1{9}$/.test(value)) return; // block 0000000000, 1111111111, etc.
    }
    setFastJobCard({ ...fastJobCard, [field]: value });
  };

  const handleEnter = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nextRef?.current?.focus();
    }
  };

  const handleClose = () => {
    setFastJobCard({
      billType: roles.includes('INVOICE') ? 'INVOICE' : 'ESTIMATE',
      paymentMode: 'CASH'
    });
    setJobSparesInfo([]);
    setJobServiceInfo([]);
    setOpenPrintBillMsg(false);
  };

  const isUserDetailsComplete = () => fastJobCard.ownerName && fastJobCard.ownerPhoneNumber;

  const isCarDetailsComplete = () => fastJobCard.vehicleRegNo && fastJobCard.vehicleName && fastJobCard.paymentMode && fastJobCard.billType;

  const isJobComplete = () => isUserDetailsComplete() && isCarDetailsComplete() && (jobServiceInfo.length > 0 || jobSparesInfo.length > 0);

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
      const data = await postRequest(process.env.REACT_APP_API_URL + '/jobCard/fastjobCard', payload);
      // setAlertMess('Jobcard created for ' + payload.vehicleRegNo + ' Print Bill ');
      // setAlertColor('success');
      // setShowAlert(true);
      setFastJobCard(data);
      setOpenPrintBillMsg(true);
      //handleClose();
    } catch (err) {
      console.log(err.message);
      handleClose();
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
    }
  };

  const printBillPDF = async () => {
    try {
      const blob = await getBlobRequest(process.env.REACT_APP_API_URL + '/jobCard/billPdf/' + fastJobCard.id);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'Bill_' + fastJobCard.jobId + '_' + fastJobCard.vehicleRegNo + '.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      handleClose();
    } catch (err) {
      handleClose();
      console.log(err.message);
      setAlertMess(err.message);
      setShowAlert(true);
    }
  };

  return (
    <>
      <MainCard title="Job Card Details">
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              inputRef={ownerNameRef}
              label="Owner Name"
              required
              variant="outlined"
              fullWidth
              value={fastJobCard.ownerName || ''}
              onChange={(e) => handleInputChange('ownerName', e.target.value)}
              onKeyDown={(e) => handleEnter(e, ownerPhoneRef)}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              inputRef={ownerPhoneRef}
              label="Owner PhoneNumber"
              required
              variant="outlined"
              fullWidth
              value={fastJobCard.ownerPhoneNumber || ''}
              onChange={(e) => handleInputChange('ownerPhoneNumber', e.target.value)}
              onKeyDown={(e) => handleEnter(e, ownerAddressRef)}
              error={fastJobCard.ownerPhoneNumber && fastJobCard.ownerPhoneNumber.length !== 10}
              helperText={
                fastJobCard.ownerPhoneNumber && fastJobCard.ownerPhoneNumber.length !== 10 ? 'Phone number must be 10 digits' : ' '
              }
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              inputRef={ownerAddressRef}
              label="Owner Address"
              variant="outlined"
              fullWidth
              value={fastJobCard.ownerAddress || ''}
              onChange={(e) => handleInputChange('ownerAddress', e.target.value)}
              onKeyDown={(e) => handleEnter(e, vehicleRegNoRef)}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              inputRef={vehicleRegNoRef}
              label="Vehicle Reg. No."
              required
              variant="outlined"
              fullWidth
              value={fastJobCard.vehicleRegNo || ''}
              onChange={(e) => handleInputChange('vehicleRegNo', e.target.value)}
              onKeyDown={(e) => handleEnter(e, vehicleNameRef)}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              inputRef={vehicleNameRef}
              label="Vehicle Name"
              required
              variant="outlined"
              fullWidth
              value={fastJobCard.vehicleName || ''}
              onChange={(e) => handleInputChange('vehicleName', e.target.value)}
              onKeyDown={(e) => handleEnter(e, kiloMetersRef)}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              inputRef={kiloMetersRef}
              label="Vehicle K.Ms"
              variant="outlined"
              fullWidth
              value={fastJobCard.kiloMeters || ''}
              onChange={(e) => handleInputChange('kiloMeters', e.target.value)}
              onKeyDown={(e) => handleEnter(e, jobServiceFirstInputRef)}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Payment Mode"
              variant="outlined"
              fullWidth
              required
              value={fastJobCard.paymentMode}
              onChange={(e) => handleInputChange('paymentMode', e.target.value)}
            >
              {paymentModes
                .filter((mode) => mode !== 'CREDIT')
                .map((mode) => (
                  <MenuItem key={mode} value={mode}>
                    {mode}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Bill Type"
              variant="outlined"
              fullWidth
              required
              value={fastJobCard.billType || 'ESTIMATE'}
              onChange={(e) => handleInputChange('billType', e.target.value)}
            >
              <MenuItem value="INVOICE">INVOICE</MenuItem>
              {!roles.includes('INVOICE') && <MenuItem value="ESTIMATE">ESTIMATE</MenuItem>}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <JobServiceUpdate data={jobServiceInfo} updateData={setJobServiceInfo} firstInputRef={jobServiceFirstInputRef} />
          </Grid>

          <Grid item xs={12}>
            <JobSparesUpdate data={jobSparesInfo} updateData={setJobSparesInfo} />
          </Grid>

          {isJobComplete() && (
            <Grid item xs={12}>
              <Button variant="contained" color="success" onClick={submitFastJobCard}>
                Save JobCard
              </Button>
            </Grid>
          )}
        </Grid>
      </MainCard>
      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}

      <Dialog
        open={openPrintBillMsg}
        onClose={() => setOpenPrintBillMsg(false)}
        aria-labelledby="data-row-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogContent dividers style={{ backgroundColor: 'white', color: 'black' }}>
          <Typography variant="h3" textAlign="center">
            Jobcard created for {fastJobCard.vehicleRegNo} .Proceed with Printing Bill ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            No
          </Button>
          <Button onClick={printBillPDF} color="success">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default JobCardFastCreate;
