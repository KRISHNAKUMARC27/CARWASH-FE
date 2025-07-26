import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { TextField, InputLabel, Select, MenuItem, Grid, Button, Box, FormControl, FormHelperText } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { getRequest, postRequest } from 'utils/fetchRequest';
import AlertDialog from 'views/utilities/AlertDialog';

function ServicePackageCreate({ data, setServicePackageUpdateOpen, fetchAllServicePackageData }) {
  const [servicePackage, setServicePackage] = useState(data ? data : { status: 'OPEN', paymentMode: 'CASH' });
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');
  const [paymentModes, setPaymentModes] = useState([]);

  useEffect(() => {
    getPaymentModes();

    return () => {
      setPaymentModes([]);
    };
  }, []);

  useEffect(() => {
    console.log(data);
    if (data) {
      setServicePackage({
        ...data
      });
    } else {
      setServicePackage({ status: 'OPEN', paymentMode: 'CASH' });
    }
  }, [data]);

  const getPaymentModes = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/config/paymentmodes');
      setPaymentModes(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  function isServicePackageComplete() {
    return (
      servicePackage.customerName?.trim() &&
      servicePackage.phone?.length === 10 &&
      servicePackage.amount !== undefined &&
      servicePackage.amount !== null &&
      !isNaN(servicePackage.amount) &&
      servicePackage.status
    );
  }

  const saveServicePackage = async (finalPayload) => {
    try {
      //console.log(JSON.stringify(finalPayload));
      const data = await postRequest(process.env.REACT_APP_API_URL + '/package', finalPayload);
      if (fetchAllServicePackageData) {
        fetchAllServicePackageData();
      }
      if (setServicePackageUpdateOpen) {
        setServicePackageUpdateOpen(false);
      }
      setServicePackage({});
      setAlertMess('Created service package for ' + data.customerName);
      setAlertColor('success');
      setShowAlert(true);
    } catch (err) {
      console.log(err.message);
      setServicePackage({});
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'phone') {
      if (!/^\d*$/.test(value)) return; // only digits
      if (value.length > 10) return; // max 10 digits
      if (/^(\d)\1{9}$/.test(value)) return; // block 0000000000, 1111111111, etc.
    }
    const updatedData = { ...servicePackage, [field]: value };
    setServicePackage(updatedData);
  };

  return (
    <Box>
      <MainCard title="Enter Package Details">
        <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, py: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Customer Name"
                required
                variant="standard"
                fullWidth
                value={servicePackage.customerName || ''}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Phone"
                required
                variant="outlined"
                fullWidth
                value={servicePackage.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={servicePackage.phone && servicePackage.phone.length !== 10}
                helperText={servicePackage.phone && servicePackage.phone.length !== 10 ? 'Phone number must be 10 digits' : ' '}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth variant="outlined">
                <TextField
                  label="Amount"
                  required
                  variant="outlined"
                  type="number"
                  value={servicePackage.amount || ''}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                  disabled={!!servicePackage.id}
                />
                <FormHelperText sx={{ color: 'red' }}>
                  Amount cannot be changed later, please double-check. Top Up is possible.
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                select
                fullWidth
                label="Payment Mode"
                variant="outlined"
                value={servicePackage.paymentMode || 'CASH'}
                onChange={(e) => handleInputChange('paymentMode', e.target.value)}
                disabled={!!servicePackage.id}
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
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel>Status</InputLabel>
              <Select fullWidth value={servicePackage.status || 'OPEN'} onChange={(e) => handleInputChange('status', e.target.value)}>
                {['OPEN', 'CLOSED'].map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </Box>
      </MainCard>

      <Box sx={{ p: 2 }}>
        {isServicePackageComplete() && (
          <Button variant="contained" color="success" onClick={() => saveServicePackage(servicePackage)}>
            Add/Update Package
          </Button>
        )}
      </Box>
      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}
    </Box>
  );
}

ServicePackageCreate.propTypes = {
  data: PropTypes.object,
  setServicePackageUpdateOpen: PropTypes.func,
  fetchAllServicePackageData: PropTypes.func
};
export default ServicePackageCreate;
