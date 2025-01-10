import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { TextField, InputLabel, Select, MenuItem, Grid, Button } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { getRequest, postRequest } from 'utils/fetchRequest';

function ExternalWorkCreate({ data, setExternalWorkUpdateOpen, fetchAllExternalWorkData }) {
  const [externalworkDetails, setExternalWorkDetails] = useState(data || {});
  const [externalworkCategoryList, setExternalWorkCategoryList] = useState([]);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');

  useEffect(() => {
    fetchAllExternalWorkCategoryListData();

    return () => {
      setExternalWorkDetails({});
      setExternalWorkCategoryList([]);
    };
  }, []);

  useEffect(() => {
    setExternalWorkDetails(data || {});
  }, [data]);

  const fetchAllExternalWorkCategoryListData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/externalWork/externalWorkCategory');
      setExternalWorkCategoryList(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  function isExternalWorkComplete() {
    return (
      externalworkDetails.category &&
      externalworkDetails.desc &&
      externalworkDetails.amount !== null &&
      externalworkDetails.amount !== undefined
    );
  }

  const saveExternalWorkInventory = async (payload) => {
    try {
      const data = await postRequest(process.env.REACT_APP_API_URL + '/externalWork', payload);
      if (fetchAllExternalWorkData) {
        fetchAllExternalWorkData();
      }
      if (setExternalWorkUpdateOpen) {
        setExternalWorkUpdateOpen(false);
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
    const updatedData = { ...externalworkDetails, category: event.target.value };
    setExternalWorkDetails(updatedData);
  };
  const handleDescChange = (event) => {
    const updatedData = { ...externalworkDetails, desc: event.target.value };
    setExternalWorkDetails(updatedData);
  };
  const handleAmountChange = (event) => {
    const updatedData = { ...externalworkDetails, amount: event.target.value };
    setExternalWorkDetails(updatedData);
  };

  return (
    <div>
      <MainCard title="Enter ExternalWork Details">
        <Grid container direction="row" spacing={gridSpacing}>
          <Grid item xs={3}>
            <InputLabel id="demo-select-small" required>
              Category Type
            </InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={externalworkDetails.category || ''}
              label="Category Type"
              onChange={handleCategoryChange}
            >
              {externalworkCategoryList.map((option) => (
                <MenuItem key={option.id} value={option.category}>
                  {option.category}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={6}>
            <br></br>
            <TextField
              label="ExternalWork Description"
              required
              variant="standard"
              fullWidth
              value={externalworkDetails.desc || ''}
              onChange={handleDescChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField label="Amount" required variant="outlined" value={externalworkDetails.amount || ''} onChange={handleAmountChange} />
          </Grid>
        </Grid>
      </MainCard>
      <br></br>
      <div className="content">
        {isExternalWorkComplete() && (
          <Button variant="contained" color="error" onClick={() => saveExternalWorkInventory(externalworkDetails)}>
            Add/Update ExternalWork
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

ExternalWorkCreate.propTypes = {
  data: PropTypes.object,
  setExternalWorkUpdateOpen: PropTypes.func,
  fetchAllExternalWorkData: PropTypes.func
};
export default ExternalWorkCreate;
