import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { TextField, InputLabel, Select, MenuItem, Grid, Button, Autocomplete } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { getRequest, postRequest } from 'utils/fetchRequest';

function AppointmentCreate({ data, setAppointmentUpdateOpen, fetchAllAppointmentData }) {
  const [appointment, setAppointment] = useState(data || {});
  const [serviceList, setServiceList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');

  useEffect(() => {
    fetchAllServiceListData();
    fetchAllEmployeeData();
    return () => {
      setAppointment({});
      setServiceList([]);
      setEmployeeList([]);
    };
  }, []);

  useEffect(() => {
    setAppointment(data || {});
  }, [data]);

  const fetchAllServiceListData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/service');
      setServiceList(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchAllEmployeeData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/employee');
      setEmployeeList(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  function isAppointmentComplete() {
    return appointment.customerName && appointment.phone && appointment.service && appointment.appointmentDateTime;
  }

  const saveAppointment = async (payload) => {
    try {
      const data = await postRequest(process.env.REACT_APP_API_URL + '/appointments', payload);
      if (fetchAllAppointmentData) {
        fetchAllAppointmentData();
      }
      if (setAppointmentUpdateOpen) {
        setAppointmentUpdateOpen(false);
      }
      setAlertMess('Created appointment for ' + data.customerName);
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

  const handleInputChange = (field, value) => {
    const updatedData = { ...appointment, [field]: value };
    setAppointment(updatedData);
  };

  const handleDateTimeChange = (dateTime) => {
    setAppointment({ ...appointment, appointmentDateTime: dateTime.format('YYYY-MM-DDTHH:mm:ss') });
  };

  return (
    <div>
      <MainCard title="Enter Appointment Details">
        <Grid container direction="row" spacing={gridSpacing}>
          <Grid item xs={4}>
            <br></br>
            <TextField
              label="Customer Name"
              required
              variant="standard"
              value={appointment.customerName || ''}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Phone"
              required
              variant="outlined"
              value={appointment.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <Autocomplete
              options={serviceList} // Keep the full object as options
              getOptionLabel={(option) => option.desc} // Display the description as label
              renderInput={(params) => <TextField {...params} label="Select Service" variant="outlined" fullWidth />}
              onChange={(event, newValue) => {
                if (newValue) {
                  handleInputChange('service', newValue.desc); // Store `desc` value in appointment state
                } else {
                  handleInputChange('service', ''); // Clear selection
                }
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <DateTimePicker
              label="Appointment Date & Time"
              value={appointment.appointmentDateTime}
              onChange={handleDateTimeChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel id="demo-select-small">Staff</InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={appointment.staffName || ''}
              label="Staff"
              onChange={(e) => handleInputChange('staffName', e.target.value)}
            >
              {employeeList.map((option) => (
                <MenuItem key={option.id} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="standard" // Optional: "standard" works, but "outlined" improves visibility
              multiline
              fullWidth
              value={appointment.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </Grid>
        </Grid>
      </MainCard>
      <br></br>
      <div className="content">
        {isAppointmentComplete() && (
          <Button variant="contained" color="error" onClick={() => saveAppointment(appointment)}>
            Add/Update Appointment
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

AppointmentCreate.propTypes = {
  data: PropTypes.object,
  setAppointmentUpdateOpen: PropTypes.func,
  fetchAllAppointmentData: PropTypes.func
};
export default AppointmentCreate;
