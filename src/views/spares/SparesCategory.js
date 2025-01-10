import React, { useState, useEffect } from 'react';

import { Table, TableBody, TableCell, TableHead, TableRow, Button, TextField, Grid, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { getRequest, deleteRequest, postRequest, putRequestNotStringify } from 'utils/fetchRequest';

function SparesCategory() {
  const [sparesCategory, setSparesCategory] = useState({});
  const [sparesCategoryList, setSparesCategoryList] = useState([]);
  const [oldCategory, setOldCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');

  useEffect(() => {
    fetchAllSparesCategoryListData();

    return () => {
      setSparesCategory({});
      setSparesCategoryList([]);
    };
  }, []);

  const fetchAllSparesCategoryListData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/spares/sparesCategory');
      setSparesCategoryList(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  function isSparesCategoryComplete() {
    return sparesCategory.category;
  }

  const submitSparesCategory = () => {
    const sparesCat = {
      category: sparesCategory.category
    };
    saveSparesCategory(sparesCat);
  };

  const saveSparesCategory = async (payload) => {
    try {
      const data = await postRequest(process.env.REACT_APP_API_URL + '/spares/saveSparesCategory', payload);
      setAlertMess('SparesCategory ' + data.category + ' created successfully');
      setAlertColor('success');
      setShowAlert(true);
      setSparesCategory({});
      fetchAllSparesCategoryListData();
      console.log(data);
    } catch (err) {
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
    }
  };

  const handleCategoryChange = (event) => {
    const updatedData = { ...sparesCategory, category: event.target.value };
    setSparesCategory(updatedData);
  };

  const handleRowDelete = async (rowIndex) => {
    try {
      const data = await deleteRequest(process.env.REACT_APP_API_URL + '/spares/sparesCategory/' + rowIndex);
      setAlertMess('SparesCategory ' + data.category + ' deleted successfully');
      setAlertColor('success');
      setShowAlert(true);
      fetchAllSparesCategoryListData();
    } catch (err) {
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
      console.error(err.message);
    }
  };

  const handleInputChange = (oldValue, newValue, index, column) => {
    const newRows = [...sparesCategoryList];
    newRows[index][column] = newValue;
    setSparesCategoryList(newRows);
    setOldCategory(oldValue);
    setNewCategory(newValue);
  };

  const updateSparesCategory = async () => {
    try {
      const data = await putRequestNotStringify(
        process.env.REACT_APP_API_URL + '/spares/sparesCategory/' + oldCategory + '/' + newCategory,
        {}
      );
      setAlertMess('SparesCategory ' + data.category + ' updated successfully');
      setAlertColor('success');
      setShowAlert(true);
      setOldCategory('');
      setNewCategory('');
      fetchAllSparesCategoryListData();
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
      <MainCard title="Spares Category Details">
        <Grid container direction="row" spacing={gridSpacing}>
          <Grid item xs={4}>
            <br></br>
            <TextField
              label="Enter Spares Category"
              required
              variant="outlined"
              value={sparesCategory.category || ''}
              onChange={handleCategoryChange}
            />
          </Grid>
          <Grid item xs={12}>
            <br></br>
            <div className="content">
              {isSparesCategoryComplete() && (
                <Button variant="contained" color="error" onClick={() => submitSparesCategory()}>
                  Create Spares Category
                </Button>
              )}
            </div>
          </Grid>
          <Grid item xs={12}>
            {showAlert && (
              <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert variant="filled" severity={alertColor} onClose={() => setShowAlert(false)}>
                  {alertMess}
                </Alert>
              </Stack>
            )}
            <Grid item xs={12}>
              <div style={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Spares Category</TableCell>
                      <TableCell>Spares Count</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sparesCategoryList.map((row, index) => (
                      <TableRow key={index}>
                        {/* <TableCell>{row?.category}</TableCell> */}
                        <TableCell>
                          <TextField
                            variant="outlined"
                            value={row?.category || ''}
                            onChange={(e) => handleInputChange(row.category, e.target.value, index, 'category')}
                          />
                        </TableCell>
                        <TableCell>{row?.sparesCount}</TableCell>
                        <TableCell>
                          {/* <Button variant="contained" color="error" onClick={() => handleRowDelete(row.id)}>
                            Delete
                          </Button>
                          <Button variant="contained" color="error" onClick={() => updateSparesCategory()}>
                            Update
                          </Button> */}
                          <Tooltip arrow placement="right" title="Update">
                            <IconButton
                              onClick={() => {
                                updateSparesCategory();
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
    </div>
  );
}

export default SparesCategory;
