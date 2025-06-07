import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { TextField, InputLabel, Select, MenuItem, Grid, Button, Autocomplete, Box } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { getRequest, postRequest } from 'utils/fetchRequest';
import dayjs from 'dayjs';
import AlertDialog from 'views/utilities/AlertDialog';

function AppointmentCreate({ data, setAppointmentUpdateOpen, fetchAllAppointmentData }) {
  const initialAppointment = data
    ? {
        ...data,
        appointmentDateTime: data.appointmentDateTime ? dayjs(data.appointmentDateTime) : null
      }
    : {};
  const [appointment, setAppointment] = useState(initialAppointment);
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
    console.log(data);
    if (data) {
      setAppointment({
        ...data,
        appointmentDateTime: data.appointmentDateTime ? dayjs(data.appointmentDateTime) : null
      });
    } else {
      setAppointment({});
    }
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
    return (
      appointment.customerName && appointment.phone && appointment.vehicleRegNo && appointment.service && appointment.appointmentDateTime
    );
  }

  const saveAppointment = async (payload) => {
    const finalPayload = {
      ...payload,
      status: payload.status ? payload.status : 'SCHEDULED',
      appointmentDateTime: dayjs(payload.appointmentDateTime).format('YYYY-MM-DDTHH:mm:ss')
    };
    //console.log(JSON.stringify(finalPayload));
    try {
      const data = await postRequest(process.env.REACT_APP_API_URL + '/appointments', finalPayload);
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

  // const handleDateTimeChange = (dateTime) => {
  //   setAppointment({ ...appointment, appointmentDateTime: dateTime.format('YYYY-MM-DDTHH:mm:ss') });
  // };
  const handleDateTimeChange = (dateTime) => {
    setAppointment({ ...appointment, appointmentDateTime: dateTime });
  };

  return (
    <Box>
      <MainCard title="Enter Appointment Details">
        <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, py: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Customer Name"
                required
                variant="standard"
                fullWidth
                value={appointment.customerName || ''}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Phone"
                required
                variant="outlined"
                fullWidth
                value={appointment.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Vehicle Registration No"
                required
                variant="outlined"
                fullWidth
                value={appointment.vehicleRegNo || ''}
                onChange={(e) => handleInputChange('vehicleRegNo', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                options={serviceList}
                getOptionLabel={(option) => option.desc}
                value={serviceList.find((option) => option.desc === appointment.service) || null}
                onChange={(event, newValue) => handleInputChange('service', newValue ? newValue.desc : '')}
                renderInput={(params) => <TextField {...params} label="Select Service" variant="outlined" fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DateTimePicker
                label="Appointment Date & Time"
                value={appointment.appointmentDateTime}
                onChange={handleDateTimeChange}
                shouldDisableDate={(date) => date.day() === 0}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel>Status</InputLabel>
              <Select fullWidth value={appointment.status || 'SCHEDULED'} onChange={(e) => handleInputChange('status', e.target.value)}>
                {['SCHEDULED', 'IN-PROGRESS', 'COMPLETED', 'CANCELLED'].map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel>Staff</InputLabel>
              <Select fullWidth value={appointment.staffName || ''} onChange={(e) => handleInputChange('staffName', e.target.value)}>
                {employeeList.map((emp) => (
                  <MenuItem key={emp.id} value={emp.name}>
                    {emp.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={12} md={8}>
              <TextField
                label="Description"
                multiline
                fullWidth
                variant="standard"
                value={appointment.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>
      </MainCard>

      <Box sx={{ p: 2 }}>
        {isAppointmentComplete() && (
          <Button variant="contained" color="error" onClick={() => saveAppointment(appointment)}>
            Add/Update Appointment
          </Button>
        )}
      </Box>
      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}
    </Box>
  );
}

AppointmentCreate.propTypes = {
  data: PropTypes.object,
  setAppointmentUpdateOpen: PropTypes.func,
  fetchAllAppointmentData: PropTypes.func
};
export default AppointmentCreate;
