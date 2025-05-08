import React, { useState, useEffect } from 'react';

import { Table, TableBody, TableCell, TableHead, TableRow, Button, TextField, Grid, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
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
    <div>
      <MainCard title="Department Details">
        <Grid container direction="row" spacing={gridSpacing}>
          <Grid item xs={4}>
            <br></br>
            <TextField
              label="Department Name"
              required
              variant="outlined"
              value={department.departmentName || ''}
              onChange={handleDepartmentChange}
            />
          </Grid>
          <Grid item xs={12}>
            <br></br>
            <div className="content">
              {isDepartmentComplete() && (
                <Button variant="contained" color="error" onClick={() => submitDepartment()}>
                  Create New Department
                </Button>
              )}
            </div>
          </Grid>
          <Grid item xs={12}>
            <Grid item xs={12}>
              <div style={{ overflowX: 'auto' }}>
                <Table>
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
                        {/* <TableCell>{row?.category}</TableCell> */}
                        <TableCell>
                          <TextField
                            variant="outlined"
                            value={row?.departmentName || ''}
                            onChange={(e) => handleInputChange(e.target.value, index, 'departmentName')}
                          />
                        </TableCell>
                        <TableCell>{row?.laborCount}</TableCell>
                        <TableCell>
                          {/* <Button variant="contained" color="error" onClick={() => handleRowDelete(row.id)}>
                            Delete
                          </Button>
                          <Button variant="contained" color="error" onClick={() => updateLaborCategory()}>
                            Update
                          </Button> */}
                          <Tooltip arrow placement="right" title="Update">
                            <IconButton
                              onClick={() => {
                                updateDepartment();
                              }}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip arrow placement="right" title="Delete">
                            <IconButton
                              onClick={() => {
                                handleRowDelete(row.id);
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </MainCard>
      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}
    </div>
  );
}

export default Department;
