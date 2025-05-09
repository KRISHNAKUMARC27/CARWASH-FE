import React, { useState, useEffect } from 'react';

import { Table, TableBody, TableCell, TableHead, TableRow, Button, TextField, Grid, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import AlertDialog from 'views/utilities/AlertDialog';
import { getRequest, deleteRequest, postRequest, putRequestNotStringify } from 'utils/fetchRequest';

function ExpenseCategory() {
  const [expenseCategory, setExpenseCategory] = useState({});
  const [expenseCategoryList, setExpenseCategoryList] = useState([]);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');
  const [editRowIndex, setEditRowIndex] = useState(null);

  useEffect(() => {
    fetchAllExpenseCategoryListData();

    return () => {
      setExpenseCategory({});
      setExpenseCategoryList([]);
    };
  }, []);

  const fetchAllExpenseCategoryListData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/expense/expenseCategory');
      const enhancedData = data.map((item) => ({
        ...item,
        _originalCategory: item.category
      }));
      setExpenseCategoryList(enhancedData);
    } catch (err) {
      console.error(err.message);
    }
  };

  function isExpenseCategoryComplete() {
    return expenseCategory.category;
  }

  const submitExpenseCategory = () => {
    const expenseCat = {
      category: expenseCategory.category
    };
    saveExpenseCategory(expenseCat);
  };

  const saveExpenseCategory = async (payload) => {
    try {
      const data = await postRequest(process.env.REACT_APP_API_URL + '/expense/saveExpenseCategory', payload);
      setAlertMess('ExpenseCategory ' + data.category + ' created successfully');
      setAlertColor('success');
      setShowAlert(true);
      setExpenseCategory({});
      fetchAllExpenseCategoryListData();
      console.log(data);
    } catch (err) {
      console.error(err.message);
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
    }
  };

  const handleCategoryChange = (event) => {
    const updatedData = { ...expenseCategory, category: event.target.value };
    setExpenseCategory(updatedData);
  };

  const handleRowDelete = async (rowIndex) => {
    try {
      const data = await deleteRequest(process.env.REACT_APP_API_URL + '/expense/expenseCategory/' + rowIndex);
      setAlertMess('ExpenseCategory ' + data.category + ' deleted successfully');
      setAlertColor('success');
      setShowAlert(true);
      fetchAllExpenseCategoryListData();
    } catch (err) {
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
      console.error(err.message);
    }
  };

  const handleInputChange = (newValue, index, column) => {
    const updatedRows = [...expenseCategoryList];
    updatedRows[index][column] = newValue;
    setExpenseCategoryList(updatedRows);
    setEditRowIndex(index); // mark which row is being edited
  };

  const updateExpenseCategory = async () => {
    if (editRowIndex === null) return;

    const oldCategory = expenseCategoryList[editRowIndex]._originalCategory || '';
    const newCategory = expenseCategoryList[editRowIndex].category;
    try {
      const data = await putRequestNotStringify(
        process.env.REACT_APP_API_URL + '/expense/expenseCategory/' + oldCategory + '/' + newCategory,
        {}
      );
      setAlertMess('ExpenseCategory ' + data.category + ' updated successfully');
      setAlertColor('success');
      setShowAlert(true);
      setEditRowIndex(null); // reset the edit row index
      fetchAllExpenseCategoryListData();
    } catch (err) {
      console.error(err.message);
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
    }
  };

  return (
    <div>
      <MainCard title="Expense Category Details">
        <Grid container direction="row" spacing={gridSpacing}>
          <Grid item xs={4}>
            <br></br>
            <TextField
              label="Enter Expense Category"
              required
              variant="outlined"
              value={expenseCategory.category || ''}
              onChange={handleCategoryChange}
            />
          </Grid>
          <Grid item xs={12}>
            <br></br>
            <div className="content">
              {isExpenseCategoryComplete() && (
                <Button variant="contained" color="error" onClick={() => submitExpenseCategory()}>
                  Create Expense Category
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
                      <TableCell>Expense Category</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expenseCategoryList.map((row, index) => (
                      <TableRow key={index}>
                        {/* <TableCell>{row?.category}</TableCell> */}
                        <TableCell>
                          <TextField
                            variant="outlined"
                            value={row?.category || ''}
                            onChange={(e) => handleInputChange(e.target.value, index, 'category')}
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip arrow placement="right" title="Update">
                            <IconButton
                              onClick={() => {
                                updateExpenseCategory();
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

export default ExpenseCategory;
