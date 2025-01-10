import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { TextField, InputLabel, Select, MenuItem, Grid, Button } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { getRequest, postRequest } from 'utils/fetchRequest';

function LaborCreate({ data, setLaborUpdateOpen, fetchAllLaborData }) {
  const [laborDetails, setLaborDetails] = useState(data || {});
  const [laborCategoryList, setLaborCategoryList] = useState([]);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');

  useEffect(() => {
    fetchAllLaborCategoryListData();

    return () => {
      setLaborDetails({});
      setLaborCategoryList([]);
    };
  }, []);

  useEffect(() => {
    setLaborDetails(data || {});
  }, [data]);

  const fetchAllLaborCategoryListData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/labor/laborCategory');
      setLaborCategoryList(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  function isLaborComplete() {
    return laborDetails.category && laborDetails.desc && laborDetails.amount !== null && laborDetails.amount !== undefined;
  }

  const saveLaborInventory = async (payload) => {
    try {
      const data = await postRequest(process.env.REACT_APP_API_URL + '/labor', payload);
      if (fetchAllLaborData) {
        fetchAllLaborData();
      }
      if (setLaborUpdateOpen) {
        setLaborUpdateOpen(false);
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
    const updatedData = { ...laborDetails, category: event.target.value };
    setLaborDetails(updatedData);
  };
  const handleDescChange = (event) => {
    const updatedData = { ...laborDetails, desc: event.target.value };
    setLaborDetails(updatedData);
  };
  const handleAmountChange = (event) => {
    const updatedData = { ...laborDetails, amount: event.target.value };
    setLaborDetails(updatedData);
  };

  return (
    <div>
      <MainCard title="Enter Labor Details">
        <Grid container direction="row" spacing={gridSpacing}>
          <Grid item xs={3}>
            <InputLabel id="demo-select-small" required>
              Category Type
            </InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={laborDetails.category || ''}
              label="Category Type"
              onChange={handleCategoryChange}
            >
              {laborCategoryList.map((option) => (
                <MenuItem key={option.id} value={option.category}>
                  {option.category}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={6}>
            <br></br>
            <TextField
              label="Labor Description"
              required
              variant="standard"
              fullWidth
              value={laborDetails.desc || ''}
              onChange={handleDescChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField label="Amount" required variant="outlined" value={laborDetails.amount || ''} onChange={handleAmountChange} />
          </Grid>
        </Grid>
      </MainCard>
      <br></br>
      <div className="content">
        {isLaborComplete() && (
          <Button variant="contained" color="error" onClick={() => saveLaborInventory(laborDetails)}>
            Add/Update Labor
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

LaborCreate.propTypes = {
  data: PropTypes.object,
  setLaborUpdateOpen: PropTypes.func,
  fetchAllLaborData: PropTypes.func
};
export default LaborCreate;
