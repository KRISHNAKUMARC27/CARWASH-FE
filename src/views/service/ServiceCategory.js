import React, { useState, useEffect } from 'react';

import { Table, TableBody, TableCell, TableHead, TableRow, Button, TextField, Grid, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

import AlertDialog from 'views/utilities/AlertDialog';
import { getRequest, deleteRequest, postRequest, putRequestNotStringify } from 'utils/fetchRequest';

function ServiceCategory() {
  const [serviceCategory, setServiceCategory] = useState({});
  const [serviceCategoryList, setServiceCategoryList] = useState([]);
  const [oldCategory, setOldCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');

  useEffect(() => {
    fetchAllServiceCategoryListData();

    return () => {
      setServiceCategory({});
      setServiceCategoryList([]);
    };
  }, []);

  const fetchAllServiceCategoryListData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/service/serviceCategory');
      setServiceCategoryList(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  function isServiceCategoryComplete() {
    return serviceCategory.category;
  }

  const submitServiceCategory = () => {
    const serviceCat = {
      category: serviceCategory.category
    };
    saveServiceCategory(serviceCat);
  };

  const saveServiceCategory = async (payload) => {
    try {
      const data = await postRequest(process.env.REACT_APP_API_URL + '/service/saveServiceCategory', payload);
      setAlertMess('ServiceCategory ' + data.category + ' created successfully');
      setAlertColor('success');
      setShowAlert(true);
      setServiceCategory({});
      fetchAllServiceCategoryListData();
      console.log(data);
    } catch (err) {
      console.error(err.message);
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
    }
  };

  const handleCategoryChange = (event) => {
    const updatedData = { ...serviceCategory, category: event.target.value };
    setServiceCategory(updatedData);
  };

  const handleRowDelete = async (rowIndex) => {
    try {
      const data = await deleteRequest(process.env.REACT_APP_API_URL + '/service/serviceCategory/' + rowIndex);
      setAlertMess('ServiceCategory ' + data.category + ' deleted successfully');
      setAlertColor('success');
      setShowAlert(true);
      fetchAllServiceCategoryListData();
    } catch (err) {
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
      console.error(err.message);
    }
  };

  const handleInputChange = (oldValue, newValue, index, column) => {
    const newRows = [...serviceCategoryList];
    newRows[index][column] = newValue;
    setServiceCategoryList(newRows);
    setOldCategory(oldValue);
    setNewCategory(newValue);
  };

  const updateServiceCategory = async () => {
    try {
      const data = await putRequestNotStringify(
        process.env.REACT_APP_API_URL + '/service/serviceCategory/' + oldCategory + '/' + newCategory,
        {}
      );
      setAlertMess('ServiceCategory ' + data.category + ' updated successfully');
      setAlertColor('success');
      setShowAlert(true);
      setOldCategory('');
      setNewCategory('');
      fetchAllServiceCategoryListData();
    } catch (err) {
      console.error(err.message);
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
      setOldCategory('');
      setNewCategory('');
    }
  };

  return (
    <div>
      <MainCard title="Service Category Details">
        <Grid container direction="row" spacing={gridSpacing}>
          <Grid item xs={4}>
            <br></br>
            <TextField
              label="Enter Service Category"
              required
              variant="outlined"
              value={serviceCategory.category || ''}
              onChange={handleCategoryChange}
            />
          </Grid>
          <Grid item xs={12}>
            <br></br>
            <div className="content">
              {isServiceCategoryComplete() && (
                <Button variant="contained" color="error" onClick={() => submitServiceCategory()}>
                  Create Service Category
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
                      <TableCell>Service Category</TableCell>
                      <TableCell>Service Count</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {serviceCategoryList.map((row, index) => (
                      <TableRow key={index}>
                        {/* <TableCell>{row?.category}</TableCell> */}
                        <TableCell>
                          <TextField
                            variant="outlined"
                            value={row?.category || ''}
                            onChange={(e) => handleInputChange(row.category, e.target.value, index, 'category')}
                          />
                        </TableCell>
                        <TableCell>{row?.count}</TableCell>
                        <TableCell>
                          {/* <Button variant="contained" color="error" onClick={() => handleRowDelete(row.id)}>
                            Delete
                          </Button>
                          <Button variant="contained" color="error" onClick={() => updateServiceCategory()}>
                            Update
                          </Button> */}
                          <Tooltip arrow placement="right" title="Update">
                            <IconButton
                              onClick={() => {
                                updateServiceCategory();
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

export default ServiceCategory;
