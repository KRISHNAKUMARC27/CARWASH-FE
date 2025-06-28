import React, { useState, useEffect } from 'react';

import { Table, TableBody, TableCell, TableHead, TableRow, Button, TextField, Grid, IconButton, Tooltip, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';

import AlertDialog from 'views/utilities/AlertDialog';
import { getRequest, deleteRequest, postRequest, putRequestNotStringify } from 'utils/fetchRequest';

function ServiceCategory() {
  const [serviceCategory, setServiceCategory] = useState({});
  const [serviceCategoryList, setServiceCategoryList] = useState([]);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');
  const [editRowIndex, setEditRowIndex] = useState(null);

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
      const enhancedData = data.map((item) => ({
        ...item,
        _originalCategory: item.category
      }));
      setServiceCategoryList(enhancedData);
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

  const handleInputChange = (newValue, index, column) => {
    const updatedRows = [...serviceCategoryList];
    updatedRows[index][column] = newValue;
    setServiceCategoryList(updatedRows);
    setEditRowIndex(index); // mark which row is being edited
  };

  const updateServiceCategory = async () => {
    if (editRowIndex === null) return;

    const oldCategory = serviceCategoryList[editRowIndex]._originalCategory || '';
    const newCategory = serviceCategoryList[editRowIndex].category;
    try {
      const data = await putRequestNotStringify(
        process.env.REACT_APP_API_URL + '/service/serviceCategory/' + oldCategory + '/' + newCategory,
        {}
      );
      setAlertMess('ServiceCategory ' + data.category + ' updated successfully');
      setAlertColor('success');
      setShowAlert(true);
      setEditRowIndex(null); // reset the edit row index
      fetchAllServiceCategoryListData();
    } catch (err) {
      console.error(err.message);
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
    }
  };

  return (
    <div>
      <MainCard title="Service Category Details">
        <Grid container spacing={2}>
          {/* Input Field */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Enter Service Category"
              required
              variant="outlined"
              value={serviceCategory.category || ''}
              onChange={handleCategoryChange}
            />
          </Grid>

          {/* Create Button */}
          <Grid item xs={12}>
            {isServiceCategoryComplete() && (
              <Box mt={1}>
                <Button variant="contained" color="success" onClick={submitServiceCategory}>
                  Create Service Category
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
                    <TableCell>Service Category</TableCell>
                    <TableCell>Service Count</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serviceCategoryList.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={row?.category || ''}
                          onChange={(e) => handleInputChange(e.target.value, index, 'category')}
                        />
                      </TableCell>
                      <TableCell>{row?.count}</TableCell>
                      <TableCell>
                        <Tooltip arrow placement="top" title="Update">
                          <IconButton onClick={() => updateServiceCategory()}>
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
    </div>
  );
}

export default ServiceCategory;
