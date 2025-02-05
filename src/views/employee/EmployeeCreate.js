import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { TextField, InputLabel, Select, MenuItem, Grid, Button } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { getRequest, postRequest } from 'utils/fetchRequest';

function EmployeeCreate({ data, setEmployeeUpdateOpen, fetchAllEmployeeData }) {
  const [employeeDetails, setEmployeeDetails] = useState(data || {});
  const [departmentList, setDepartmentList] = useState([]);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');

  const salaryModes = ['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY'];
  const statusList = ['ACTIVE', 'IN-ACTIVE'];

  useEffect(() => {
    fetchAllDepartmentListData();

    return () => {
      setEmployeeDetails({});
      setDepartmentList([]);
    };
  }, []);

  useEffect(() => {
    setEmployeeDetails(data || {});
  }, [data]);

  const fetchAllDepartmentListData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/employee/department');
      setDepartmentList(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  function isDepartmentComplete() {
    return (
      employeeDetails.name &&
      employeeDetails.phone &&
      employeeDetails.department &&
      employeeDetails.status &&
      employeeDetails.salaryType &&
      employeeDetails.salary !== null &&
      employeeDetails.salary !== undefined
    );
  }

  const saveEmployee = async (payload) => {
    try {
      const data = await postRequest(process.env.REACT_APP_API_URL + '/employee', payload);
      if (fetchAllEmployeeData) {
        fetchAllEmployeeData();
      }
      if (setEmployeeUpdateOpen) {
        setEmployeeUpdateOpen(false);
      }
      setAlertMess(data.name + ' added successfully ');
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
    const updatedData = { ...employeeDetails, [field]: value };
    setEmployeeDetails(updatedData);
  };

  return (
    <div>
      <MainCard title="Enter Employee Details">
        <Grid container direction="row" spacing={gridSpacing}>
          <Grid item xs={4}>
            <InputLabel id="demo-select-small" required>
              Department
            </InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={employeeDetails.department || ''}
              label="Category Type"
              onChange={(e) => handleInputChange('department', e.target.value)}
            >
              {departmentList.map((option) => (
                <MenuItem key={option.id} value={option.departmentName}>
                  {option.departmentName}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={4}>
            <br></br>
            <TextField
              label="Employee Name"
              required
              variant="standard"
              value={employeeDetails.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Phone"
              required
              variant="outlined"
              value={employeeDetails.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Designation"
              variant="outlined"
              value={employeeDetails.designation || ''}
              onChange={(e) => handleInputChange('designation', e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <InputLabel id="demo-select-small" required>
              Salary Type
            </InputLabel>
            <TextField
              select
              variant="outlined"
              required
              value={employeeDetails.salaryType || ''}
              onChange={(e) => handleInputChange('salaryType', e.target.value)}
            >
              {salaryModes.map((mode) => (
                <MenuItem key={mode} value={mode}>
                  {mode}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Salary"
              required
              variant="outlined"
              value={employeeDetails.salary || ''}
              onChange={(e) => handleInputChange('salary', parseFloat(e.target.value) || 0)}
              type="number"
            />
          </Grid>
          <Grid item xs={3}>
            <InputLabel id="demo-select-small" required>
              Employement Status
            </InputLabel>
            <TextField
              select
              variant="outlined"
              required
              value={employeeDetails.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              {statusList.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Salary Advance"
              variant="outlined"
              value={employeeDetails.salaryAdvance || ''}
              onChange={(e) => handleInputChange('salaryAdvance', parseFloat(e.target.value) || 0)}
              type="number"
            />
          </Grid>
        </Grid>
      </MainCard>
      <br></br>
      <div className="content">
        {isDepartmentComplete() && (
          <Button variant="contained" color="error" onClick={() => saveEmployee(employeeDetails)}>
            Add/Update Employee
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

EmployeeCreate.propTypes = {
  data: PropTypes.object,
  setEmployeeUpdateOpen: PropTypes.func,
  fetchAllEmployeeData: PropTypes.func
};
export default EmployeeCreate;
