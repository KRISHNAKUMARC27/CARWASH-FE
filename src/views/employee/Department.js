import React, { useState, useEffect } from 'react';

import { Table, TableBody, TableCell, TableHead, TableRow, Button, TextField, Grid, IconButton, Tooltip, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import AlertDialog from 'views/utilities/AlertDialog';
import { getRequest, deleteRequest, postRequest, putRequestNotStringify } from 'utils/fetchRequest';

function Department() {
  const [department, setDepartment] = useState({});
  const [departmentList, setDepartmentList] = useState([]);

  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');
  const [editRowIndex, setEditRowIndex] = useState(null);
  useEffect(() => {
    fetchAllDepartmentListData();

    return () => {
      setDepartment({});
      setDepartmentList([]);
    };
  }, []);

  const fetchAllDepartmentListData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/employee/department');
      const enhancedData = data.map((item) => ({
        ...item,
        _originalDepartment: item.departmentName
      }));
      setDepartmentList(enhancedData);
    } catch (err) {
      console.error(err.message);
    }
  };

  function isDepartmentComplete() {
    return department.departmentName;
  }

  const submitDepartment = () => {
    const departmentObj = {
      departmentName: department.departmentName
    };
    saveDepartment(departmentObj);
  };

  const saveDepartment = async (payload) => {
    try {
      const data = await postRequest(process.env.REACT_APP_API_URL + '/employee/department', payload);
      setAlertMess('Department ' + data.departmentName + ' created successfully');
      setAlertColor('success');
      setShowAlert(true);
      setDepartment({});
      fetchAllDepartmentListData();
      console.log(data);
    } catch (err) {
      console.error(err.message);
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
    }
  };

  const handleDepartmentChange = (event) => {
    const updatedData = { ...department, departmentName: event.target.value };
    setDepartment(updatedData);
  };

  const handleRowDelete = async (rowIndex) => {
    try {
      const data = await deleteRequest(process.env.REACT_APP_API_URL + '/employee/department/' + rowIndex);
      setAlertMess('Department ' + data.category + ' deleted successfully');
      setAlertColor('success');
      setShowAlert(true);
      fetchAllDepartmentListData();
    } catch (err) {
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
      console.error(err.message);
    }
  };

  const handleInputChange = (newValue, index, column) => {
    const updatedRows = [...departmentList];
    updatedRows[index][column] = newValue;
    setDepartmentList(updatedRows);
    setEditRowIndex(index); // mark which row is being edited
  };

  const updateDepartment = async () => {
    if (editRowIndex === null) return;

    const oldDepartment = departmentList[editRowIndex]._originalDepartment || '';
    const newDepartment = departmentList[editRowIndex].departmentName;
    try {
      const data = await putRequestNotStringify(
        process.env.REACT_APP_API_URL + '/employee/department/' + oldDepartment + '/' + newDepartment,
        {}
      );
      setAlertMess('Department ' + data.category + ' updated successfully');
      setAlertColor('success');
      setShowAlert(true);
      setEditRowIndex(null); // reset the edit row index
      fetchAllDepartmentListData();
    } catch (err) {
      console.error(err.message);
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
    }
  };

  return (
    <Box p={2}>
      <MainCard title="Department Details">
        <Grid container spacing={2}>
          {/* Input Field */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Department Name"
              required
              variant="outlined"
              value={department.departmentName || ''}
              onChange={handleDepartmentChange}
            />
          </Grid>

          {/* Create Button */}
          <Grid item xs={12}>
            {isDepartmentComplete() && (
              <Box mt={1}>
                <Button variant="contained" color="error" onClick={submitDepartment}>
                  Create New Department
                </Button>
              </Box>
            )}
          </Grid>

          {/* Table */}
          <Grid item xs={12}>
            <Box sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Department</TableCell>
                    <TableCell>Department Count</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departmentList.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={row?.departmentName || ''}
                          onChange={(e) => handleInputChange(e.target.value, index, 'departmentName')}
                        />
                      </TableCell>
                      <TableCell>{row?.laborCount}</TableCell>
                      <TableCell>
                        <Tooltip arrow placement="top" title="Update">
                          <IconButton onClick={() => updateDepartment()}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="top" title="Delete">
                          <IconButton onClick={() => handleRowDelete(row.id)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Grid>
        </Grid>
      </MainCard>

      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}
    </Box>
  );
}

export default Department;
