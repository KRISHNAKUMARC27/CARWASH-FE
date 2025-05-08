import React, { useState, useEffect } from 'react';

import { Table, TableBody, TableCell, TableHead, TableRow, Button, TextField, Grid, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

import AlertDialog from 'views/utilities/AlertDialog';
import { getRequest, deleteRequest, postRequest, putRequestNotStringify } from 'utils/fetchRequest';

function SparesCategory() {
  const [sparesCategory, setSparesCategory] = useState({});
  const [sparesCategoryList, setSparesCategoryList] = useState([]);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');
  const [editRowIndex, setEditRowIndex] = useState(null);

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
      const enhancedData = data.map((item) => ({
        ...item,
        _originalCategory: item.category
      }));
      setSparesCategoryList(enhancedData);
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

  const handleInputChange = (newValue, index, column) => {
    const updatedRows = [...sparesCategoryList];
    updatedRows[index][column] = newValue;
    setSparesCategoryList(updatedRows);
    setEditRowIndex(index); // mark which row is being edited
  };

  const updateSparesCategory = async () => {
    if (editRowIndex === null) return;

    const oldCategory = sparesCategoryList[editRowIndex]._originalCategory || '';
    const newCategory = sparesCategoryList[editRowIndex].category;
    try {
      const data = await putRequestNotStringify(
        process.env.REACT_APP_API_URL + '/spares/sparesCategory/' + oldCategory + '/' + newCategory,
        {}
      );
      setAlertMess('SparesCategory ' + data.category + ' updated successfully');
      setAlertColor('success');
      setShowAlert(true);
      setEditRowIndex(null); // reset the edit row index
      fetchAllSparesCategoryListData();
    } catch (err) {
      console.error(err.message);
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
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
                            onChange={(e) => handleInputChange(e.target.value, index, 'category')}
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
      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}
    </div>
  );
}

export default SparesCategory;
