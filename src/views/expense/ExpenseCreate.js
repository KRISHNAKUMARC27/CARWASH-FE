import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { TextField, InputLabel, Select, MenuItem, Grid, Button, Box } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import AlertDialog from 'views/utilities/AlertDialog';
import { getRequest, postRequest } from 'utils/fetchRequest';

function ExpenseCreate({ data, setExpenseUpdateOpen, fetchAllExpenseData }) {
  const [expenseDetails, setExpenseDetails] = useState(data || { paymentMode: 'CASH' });
  const [expenseCategoryList, setExpenseCategoryList] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMess, setAlertMess] = useState('');
  const [alertColor, setAlertColor] = useState('');

  const paymentMode = ['CASH', 'UPI', 'BANK TRANSFER'];

  useEffect(() => {
    fetchAllExpenseCategoryListData();

    return () => {
      setExpenseDetails({});
      setExpenseCategoryList([]);
    };
  }, []);

  useEffect(() => {
    if (data) {
      setExpenseDetails(data);
    } else {
      setExpenseDetails({ paymentMode: 'CASH' });
    }
  }, [data]);

  const fetchAllExpenseCategoryListData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/expense/expenseCategory');
      setExpenseCategoryList(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  function isExpenseComplete() {
    return expenseDetails.type && expenseDetails.desc && expenseDetails.paymentMode && expenseDetails.expenseAmount;
  }

  const saveExpense = async (payload) => {
    try {
      const data = await postRequest(process.env.REACT_APP_API_URL + '/expense', payload);
      if (fetchAllExpenseData) {
        fetchAllExpenseData();
      }
      if (setExpenseUpdateOpen) {
        setExpenseUpdateOpen(false);
      }
      setExpenseDetails({});
      setAlertMess(data.desc + ' added successfully ');
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
    const updatedData = { ...expenseDetails, [field]: value };
    setExpenseDetails(updatedData);
  };

  return (
    <Box>
      <MainCard title="Enter Expense Details">
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel required>Expense Category</InputLabel>
              <Select fullWidth value={expenseDetails.type || ''} onChange={(e) => handleInputChange('type', e.target.value)}>
                {expenseCategoryList.map((option) => (
                  <MenuItem key={option.id} value={option.category}>
                    {option.category}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Desc"
                required
                variant="standard"
                fullWidth
                value={expenseDetails.desc || ''}
                onChange={(e) => handleInputChange('desc', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <InputLabel required>Payment Mode</InputLabel>
              <TextField
                select
                variant="outlined"
                fullWidth
                required
                value={expenseDetails.paymentMode}
                onChange={(e) => handleInputChange('paymentMode', e.target.value)}
              >
                {paymentMode.map((mode) => (
                  <MenuItem key={mode} value={mode}>
                    {mode}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Amount"
                required
                fullWidth
                variant="outlined"
                type="number"
                value={expenseDetails.expenseAmount || ''}
                onChange={(e) => handleInputChange('expenseAmount', parseFloat(e.target.value) || 0)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Comment"
                variant="standard"
                fullWidth
                value={expenseDetails.comment || ''}
                onChange={(e) => handleInputChange('comment', e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>
      </MainCard>

      <Box sx={{ p: 2 }}>
        {isExpenseComplete() && (
          <Button variant="contained" color="success" onClick={() => saveExpense(expenseDetails)}>
            Add/Update Expense
          </Button>
        )}
      </Box>
      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}
    </Box>
  );
}

ExpenseCreate.propTypes = {
  data: PropTypes.object,
  setExpenseUpdateOpen: PropTypes.func,
  fetchAllExpenseData: PropTypes.func
};
export default ExpenseCreate;
