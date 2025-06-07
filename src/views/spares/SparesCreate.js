import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { TextField, InputLabel, Select, MenuItem, Grid, Button, Box } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

import AlertDialog from 'views/utilities/AlertDialog';
import { getRequest, postRequest } from 'utils/fetchRequest';

function SparesCreate({ data, setSparesUpdateOpen, fetchAllSparesData }) {
  const [sparesDetails, setSparesDetails] = useState(data || {});
  const [sparesCategoryList, setSparesCategoryList] = useState([]);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');

  useEffect(() => {
    fetchAllSparesCategoryListData();

    return () => {
      setSparesDetails({});
      setSparesCategoryList([]);
    };
  }, []);

  useEffect(() => {
    setSparesDetails(data || {});
  }, [data]);

  const fetchAllSparesCategoryListData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/spares/sparesCategory');
      setSparesCategoryList(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  function isSparesComplete() {
    return (
      sparesDetails.category &&
      sparesDetails.partNumber &&
      sparesDetails.desc &&
      sparesDetails.purchaseRate !== null &&
      sparesDetails.purchaseRate !== undefined &&
      sparesDetails.qty !== null &&
      sparesDetails.qty !== undefined &&
      sparesDetails.sellRate !== null &&
      sparesDetails.sellRate !== undefined &&
      sparesDetails.cgst !== null &&
      sparesDetails.cgst !== undefined &&
      sparesDetails.sgst !== null &&
      sparesDetails.sgst !== undefined &&
      sparesDetails.amount !== null &&
      sparesDetails.amount !== undefined &&
      sparesDetails.minThresh
    );
  }

  const saveSparesInventory = async (payload) => {
    try {
      const data = await postRequest(process.env.REACT_APP_API_URL + '/spares', payload);
      if (fetchAllSparesData) {
        fetchAllSparesData();
      }
      if (setSparesUpdateOpen) {
        setSparesUpdateOpen(false);
      }
      setSparesDetails({});
      setAlertMess(data.desc + ' added successfully ');
      setAlertColor('success');
      setShowAlert(true);
      console.log(data);
    } catch (err) {
      console.log(err.message);
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
    }
  };

  const handleCategoryChange = (event) => {
    const updatedData = { ...sparesDetails, category: event.target.value };
    setSparesDetails(updatedData);
  };
  const handlePartNumberChange = (event) => {
    const updatedData = { ...sparesDetails, partNumber: event.target.value };
    setSparesDetails(updatedData);
  };
  const handleDescChange = (event) => {
    const updatedData = { ...sparesDetails, desc: event.target.value };
    setSparesDetails(updatedData);
  };
  const handlePurchaseRateChange = (event) => {
    const updatedData = { ...sparesDetails, purchaseRate: event.target.value };
    setSparesDetails(updatedData);
  };
  const handleQtyChange = (event) => {
    const qty = event.target.value; // Keep as string to allow decimal input
    const amount = parseFloat(qty) * (parseFloat(sparesDetails.sellRate) || 0);
    const roundedAmount = parseFloat(amount.toFixed(2)); // rounding to 2 decimal places
    const updatedData = { ...sparesDetails, qty: qty, amount: isNaN(roundedAmount) ? '' : roundedAmount };
    setSparesDetails(updatedData);
  };
  const handleSellRateChange = (event) => {
    const sellRate = event.target.value; // Keep as string to allow decimal input
    const amount = (parseFloat(sellRate) || 0) * parseFloat(sparesDetails.qty || 0);
    const roundedAmount = parseFloat(amount.toFixed(2)); // rounding to 2 decimal places
    const updatedData = { ...sparesDetails, sellRate: sellRate, amount: isNaN(roundedAmount) ? '' : roundedAmount };
    setSparesDetails(updatedData);
  };
  const handleCGSTChange = (event) => {
    const updatedData = { ...sparesDetails, cgst: event.target.value };
    setSparesDetails(updatedData);
  };
  const handleSGSTChange = (event) => {
    const updatedData = { ...sparesDetails, sgst: event.target.value };
    setSparesDetails(updatedData);
  };

  // const handleAmountChange = (event) => {
  //   const updatedData = { ...sparesDetails, amount: event.target.value };
  //   setSparesDetails(updatedData);
  // };
  const handleMinThreshChange = (event) => {
    const updatedData = { ...sparesDetails, minThresh: event.target.value };
    setSparesDetails(updatedData);
  };
  const handleRackChange = (event) => {
    const updatedData = { ...sparesDetails, rack: event.target.value };
    setSparesDetails(updatedData);
  };
  const handleMisc1Change = (event) => {
    const updatedData = { ...sparesDetails, misc1: event.target.value };
    setSparesDetails(updatedData);
  };
  const handleMisc2Change = (event) => {
    const updatedData = { ...sparesDetails, misc2: event.target.value };
    setSparesDetails(updatedData);
  };
  const handleMisc3Change = (event) => {
    const updatedData = { ...sparesDetails, misc3: event.target.value };
    setSparesDetails(updatedData);
  };

  return (
    <Box>
      <MainCard title="Enter Spares Details">
        <Grid container spacing={2}>
          {/* Category Type */}
          <Grid item xs={12} sm={6} md={4}>
            <InputLabel id="category-type-label" required>
              Category Type
            </InputLabel>
            <Select
              fullWidth
              labelId="category-type-label"
              id="demo-select-small"
              value={sparesDetails.category || ''}
              onChange={handleCategoryChange}
            >
              {sparesCategoryList.map((option) => (
                <MenuItem key={option.id} value={option.category}>
                  {option.category}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* Part Number */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="PartNo./Type"
              required
              variant="outlined"
              value={sparesDetails.partNumber || ''}
              onChange={handlePartNumberChange}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Spares Description"
              required
              variant="standard"
              value={sparesDetails.desc || ''}
              onChange={handleDescChange}
            />
          </Grid>

          {/* Quantity, Threshold, Purchase Rate */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="Quantity" required variant="outlined" value={sparesDetails.qty || ''} onChange={handleQtyChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Minimum Threshold"
              required
              variant="outlined"
              value={sparesDetails.minThresh || ''}
              onChange={handleMinThreshChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Purchase Rate"
              required
              variant="outlined"
              value={sparesDetails.purchaseRate || ''}
              onChange={handlePurchaseRateChange}
            />
          </Grid>

          {/* Sell Rate, CGST, SGST */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Sell Rate"
              required
              variant="outlined"
              value={sparesDetails.sellRate || ''}
              onChange={handleSellRateChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="CGST" required variant="outlined" value={sparesDetails.cgst || ''} onChange={handleCGSTChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="SGST" required variant="outlined" value={sparesDetails.sgst || ''} onChange={handleSGSTChange} />
          </Grid>

          {/* Readonly Amount */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="Amount" variant="standard" value={sparesDetails.amount || ''} InputProps={{ readOnly: true }} />
          </Grid>

          {/* Rack, Misc Fields */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="Rack/Bin" variant="standard" value={sparesDetails.rack || ''} onChange={handleRackChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="Misc 1" variant="standard" value={sparesDetails.misc1 || ''} onChange={handleMisc1Change} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="Units" variant="standard" value={sparesDetails.misc2 || ''} onChange={handleMisc2Change} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="MRP" variant="standard" value={sparesDetails.misc3 || ''} onChange={handleMisc3Change} />
          </Grid>
        </Grid>
      </MainCard>
      <br></br>
      <Box mt={2} textAlign="left">
        {isSparesComplete() && (
          <Button variant="contained" color="error" onClick={() => saveSparesInventory(sparesDetails)}>
            Add/Update Spares
          </Button>
        )}
      </Box>
      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}
    </Box>
  );
}

SparesCreate.propTypes = {
  data: PropTypes.object,
  setSparesUpdateOpen: PropTypes.func,
  fetchAllSparesData: PropTypes.func
};
export default SparesCreate;
