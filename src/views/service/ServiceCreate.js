import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { TextField, InputLabel, Select, MenuItem, Grid, Button, Box } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

import AlertDialog from 'views/utilities/AlertDialog';
import { getRequest, postRequest } from 'utils/fetchRequest';

function ServiceCreate({ data, setServiceUpdateOpen, fetchAllServiceData }) {
  const [serviceDetails, setServiceDetails] = useState(data || {});
  const [serviceCategoryList, setServiceCategoryList] = useState([]);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');

  useEffect(() => {
    fetchAllServiceCategoryListData();

    return () => {
      setServiceDetails({});
      setServiceCategoryList([]);
    };
  }, []);

  useEffect(() => {
    setServiceDetails(data || {});
  }, [data]);

  const fetchAllServiceCategoryListData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/service/serviceCategory');
      setServiceCategoryList(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  function isServiceComplete() {
    return serviceDetails.category && serviceDetails.desc && serviceDetails.amount && serviceDetails.cgst && serviceDetails.sgst;
  }

  const saveServiceInventory = async (payload) => {
    try {
      const data = await postRequest(process.env.REACT_APP_API_URL + '/service', payload);
      if (fetchAllServiceData) {
        fetchAllServiceData();
      }
      if (setServiceUpdateOpen) {
        setServiceUpdateOpen(false);
      }
      setAlertMess(data.desc + ' added successfully ');
      setAlertColor('success');
      setShowAlert(true);
      setServiceDetails({});
      console.log(data);
    } catch (err) {
      console.log(err.message);
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
    }
  };

  const handleCategoryChange = (event) => {
    const updatedData = { ...serviceDetails, category: event.target.value };
    setServiceDetails(updatedData);
  };
  const handleDescChange = (event) => {
    const updatedData = { ...serviceDetails, desc: event.target.value };
    setServiceDetails(updatedData);
  };
  const handleAmountChange = (event) => {
    const updatedData = { ...serviceDetails, amount: event.target.value };
    setServiceDetails(updatedData);
  };
  const handleCGSTChange = (event) => {
    const updatedData = { ...serviceDetails, cgst: event.target.value };
    setServiceDetails(updatedData);
  };
  const handleSGSTChange = (event) => {
    const updatedData = { ...serviceDetails, sgst: event.target.value };
    setServiceDetails(updatedData);
  };
  const handleHsnCodeChange = (event) => {
    const updatedData = { ...serviceDetails, hsnCode: event.target.value };
    setServiceDetails(updatedData);
  };
  const handleMisc2Change = (event) => {
    const updatedData = { ...serviceDetails, misc2: event.target.value };
    setServiceDetails(updatedData);
  };
  const handleMisc3Change = (event) => {
    const updatedData = { ...serviceDetails, misc3: event.target.value };
    setServiceDetails(updatedData);
  };

  return (
    <Box>
      <MainCard title="Enter Service Details">
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
              value={serviceDetails.category || ''}
              label="Category Type"
              onChange={handleCategoryChange}
            >
              {serviceCategoryList.map((option) => (
                <MenuItem key={option.id} value={option.category}>
                  {option.category}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* Description */}
          <Grid item xs={12} sm={12} md={8}>
            <TextField
              label="Service Description"
              required
              variant="standard"
              fullWidth
              value={serviceDetails.desc || ''}
              onChange={handleDescChange}
            />
          </Grid>

          {/* Amount, CGST, SGST */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Amount"
              required
              fullWidth
              variant="outlined"
              value={serviceDetails.amount || ''}
              onChange={handleAmountChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField label="CGST" required fullWidth variant="outlined" value={serviceDetails.cgst || ''} onChange={handleCGSTChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField label="SGST" required fullWidth variant="outlined" value={serviceDetails.sgst || ''} onChange={handleSGSTChange} />
          </Grid>

          {/* HSN, Misc2, Misc3 */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField label="HSN Code" fullWidth variant="outlined" value={serviceDetails.hsnCode || ''} onChange={handleHsnCodeChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField label="Misc2" fullWidth variant="outlined" value={serviceDetails.misc2 || ''} onChange={handleMisc2Change} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField label="Misc3" fullWidth variant="outlined" value={serviceDetails.misc3 || ''} onChange={handleMisc3Change} />
          </Grid>
        </Grid>
      </MainCard>
      {/* Add/Update Button */}
      <Box mt={2} textAlign="left">
        {isServiceComplete() && (
          <Button variant="contained" color="error" onClick={() => saveServiceInventory(serviceDetails)}>
            Add/Update Service
          </Button>
        )}
      </Box>
      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}
    </Box>
  );
}

ServiceCreate.propTypes = {
  data: PropTypes.object,
  setServiceUpdateOpen: PropTypes.func,
  fetchAllServiceData: PropTypes.func
};
export default ServiceCreate;
