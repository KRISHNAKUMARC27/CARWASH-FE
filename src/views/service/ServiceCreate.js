import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { TextField, InputLabel, Select, MenuItem, Grid, Button } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

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
    <div>
      <MainCard title="Enter Service Details">
        <Grid container direction="row" spacing={gridSpacing}>
          <Grid item xs={3}>
            <InputLabel id="demo-select-small" required>
              Category Type
            </InputLabel>
            <Select
              labelId="demo-select-small"
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
          <Grid item xs={6}>
            <br></br>
            <TextField
              label="Service Description"
              required
              variant="standard"
              fullWidth
              value={serviceDetails.desc || ''}
              onChange={handleDescChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField label="Amount" required variant="outlined" value={serviceDetails.amount || ''} onChange={handleAmountChange} />
          </Grid>
          <Grid item xs={4}>
            <TextField label="CGST" required variant="outlined" value={serviceDetails.cgst || ''} onChange={handleCGSTChange} />
          </Grid>
          <Grid item xs={4}>
            <TextField label="SGST" required variant="outlined" value={serviceDetails.sgst || ''} onChange={handleSGSTChange} />
          </Grid>
          <Grid item xs={4}>
            <TextField label="HSN Code" variant="outlined" value={serviceDetails.hsnCode || ''} onChange={handleHsnCodeChange} />
          </Grid>
          <Grid item xs={4}>
            <TextField label="Misc2" variant="outlined" value={serviceDetails.misc2 || ''} onChange={handleMisc2Change} />
          </Grid>
          <Grid item xs={4}>
            <TextField label="Misc3" variant="outlined" value={serviceDetails.misc3 || ''} onChange={handleMisc3Change} />
          </Grid>
        </Grid>
      </MainCard>
      <br></br>
      <div className="content">
        {isServiceComplete() && (
          <Button variant="contained" color="error" onClick={() => saveServiceInventory(serviceDetails)}>
            Add/Update Service
          </Button>
        )}
      </div>
      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}
    </div>
  );
}

ServiceCreate.propTypes = {
  data: PropTypes.object,
  setServiceUpdateOpen: PropTypes.func,
  fetchAllServiceData: PropTypes.func
};
export default ServiceCreate;
