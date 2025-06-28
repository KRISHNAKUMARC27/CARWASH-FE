import React, { useState, useEffect } from 'react';

import { Table, TableBody, TableCell, TableHead, TableRow, Button, TextField, Grid, IconButton, Tooltip, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';

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
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Enter Spares Category"
              required
              variant="outlined"
              value={sparesCategory.category || ''}
              onChange={handleCategoryChange}
              sx={{ mt: 1 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              {isSparesCategoryComplete() && (
                <Button variant="contained" color="success" onClick={submitSparesCategory}>
                  Create Spares Category
                </Button>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ overflowX: 'auto', mt: 2 }}>
              <Table sx={{ minWidth: 600 }}>
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
                      <TableCell>
                        <TextField
                          variant="outlined"
                          value={row?.category || ''}
                          onChange={(e) => handleInputChange(e.target.value, index, 'category')}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>{row?.sparesCount}</TableCell>
                      <TableCell>
                        <Tooltip title="Update" arrow>
                          <IconButton onClick={() => updateSparesCategory()}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
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

export default SparesCategory;
