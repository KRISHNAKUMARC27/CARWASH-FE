import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { TextField, InputLabel, Select, MenuItem, Grid, Button, Autocomplete } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
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
            <TextField
              label="Vehicle Registration No"
              required
              variant="outlined"
              value={appointment.vehicleRegNo || ''}
              onChange={(e) => handleInputChange('vehicleRegNo', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <Autocomplete
              options={serviceList}
              getOptionLabel={(option) => option.desc}
              value={serviceList.find((option) => option.desc === appointment.service) || null} // Set initial value
              onChange={(event, newValue) => {
                handleInputChange('service', newValue ? newValue.desc : ''); // Store `desc` in state
              }}
              renderInput={(params) => <TextField {...params} label="Select Service" variant="outlined" fullWidth />}
            />
          </Grid>
          <Grid item xs={4}>
            <DateTimePicker
              label="Appointment Date & Time"
              value={appointment.appointmentDateTime}
              onChange={handleDateTimeChange}
              shouldDisableDate={(date) => date.day() === 0}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel id="demo-select-small">Status</InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={appointment.status || 'SCHEDULED'}
              label="Status"
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              {['SCHEDULED', 'IN-PROGRESS', 'COMPLETED', 'CANCELLED'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={2}>
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
          <Grid item xs={10}>
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
      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}
    </div>
  );
}

AppointmentCreate.propTypes = {
  data: PropTypes.object,
  setAppointmentUpdateOpen: PropTypes.func,
  fetchAllAppointmentData: PropTypes.func
};
export default AppointmentCreate;
