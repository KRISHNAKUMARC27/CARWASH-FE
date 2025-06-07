import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { TextField, InputLabel, Select, MenuItem, Grid, Button, Box } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import AlertDialog from 'views/utilities/AlertDialog';
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
    <Box>
      <MainCard title="Enter Employee Details">
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={6} md={4}>
            <InputLabel required>Department</InputLabel>
            <Select value={employeeDetails.department || ''} onChange={(e) => handleInputChange('department', e.target.value)} fullWidth>
              {departmentList.map((option) => (
                <MenuItem key={option.id} value={option.departmentName}>
                  {option.departmentName}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Employee Name"
              required
              variant="standard"
              fullWidth
              value={employeeDetails.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Phone"
              required
              variant="outlined"
              fullWidth
              value={employeeDetails.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Designation"
              variant="outlined"
              fullWidth
              value={employeeDetails.designation || ''}
              onChange={(e) => handleInputChange('designation', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <InputLabel required>Salary Type</InputLabel>
            <TextField
              select
              variant="outlined"
              fullWidth
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

          <Grid item xs={12} sm={6} md={3}>
            <InputLabel required>Salary Settlement Type</InputLabel>
            <TextField
              select
              variant="outlined"
              fullWidth
              required
              value={employeeDetails.salarySettlementType || ''}
              onChange={(e) => handleInputChange('salarySettlementType', e.target.value)}
            >
              {salaryModes
                .filter((mode) => mode !== 'HOURLY')
                .map((mode) => (
                  <MenuItem key={mode} value={mode}>
                    {mode}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Salary"
              required
              variant="outlined"
              fullWidth
              type="number"
              inputProps={{ min: 0 }}
              value={employeeDetails.salary || ''}
              onChange={(e) => handleInputChange('salary', parseFloat(e.target.value) || 0)}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <InputLabel required>Employment Status</InputLabel>
            <TextField
              select
              variant="outlined"
              fullWidth
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
        </Grid>
      </MainCard>

      <Box sx={{ p: 2 }}>
        {isDepartmentComplete() && (
          <Button variant="contained" color="error" onClick={() => saveEmployee(employeeDetails)}>
            Add/Update Employee
          </Button>
        )}
      </Box>
      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}
    </Box>
  );
}

EmployeeCreate.propTypes = {
  data: PropTypes.object,
  setEmployeeUpdateOpen: PropTypes.func,
  fetchAllEmployeeData: PropTypes.func
};
export default EmployeeCreate;
