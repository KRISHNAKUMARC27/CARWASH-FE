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
  const [oldCategory, setOldCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');

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
      setExpenseCategoryList(data);
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

  const handleInputChange = (oldValue, newValue, index, column) => {
    const newRows = [...expenseCategoryList];
    newRows[index][column] = newValue;
    setExpenseCategoryList(newRows);
    setOldCategory(oldValue);
    setNewCategory(newValue);
  };

  const updateExpenseCategory = async () => {
    try {
      const data = await putRequestNotStringify(
        process.env.REACT_APP_API_URL + '/expense/expenseCategory/' + oldCategory + '/' + newCategory,
        {}
      );
      setAlertMess('ExpenseCategory ' + data.category + ' updated successfully');
      setAlertColor('success');
      setShowAlert(true);
      setOldCategory('');
      setNewCategory('');
      fetchAllExpenseCategoryListData();
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
                            onChange={(e) => handleInputChange(row.category, e.target.value, index, 'category')}
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
