import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { TextField, InputLabel, Select, MenuItem, Grid, Button } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import AlertDialog from 'views/utilities/AlertDialog';
import { getRequest, postRequest } from 'utils/fetchRequest';

function ExpenseCreate({ data, setExpenseUpdateOpen, fetchAllExpenseData }) {
  const [expenseDetails, setExpenseDetails] = useState(data || {});
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
    setExpenseDetails(data || {});
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
    <div>
      <MainCard title="Enter Expense Details">
        <Grid container direction="row" spacing={gridSpacing}>
          <Grid item xs={4}>
            <InputLabel id="demo-select-small" required>
              Expense Category
            </InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={expenseDetails.type || ''}
              label="Category Type"
              onChange={(e) => handleInputChange('type', e.target.value)}
            >
              {expenseCategoryList.map((option) => (
                <MenuItem key={option.id} value={option.category}>
                  {option.category}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={4}>
            <br></br>
            <TextField
              label="Desc"
              required
              variant="standard"
              value={expenseDetails.desc || ''}
              onChange={(e) => handleInputChange('desc', e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <InputLabel id="demo-select-small" required>
              Payment Mode
            </InputLabel>
            <TextField
              select
              variant="outlined"
              required
              value={expenseDetails.paymentMode || ''}
              onChange={(e) => handleInputChange('paymentMode', e.target.value)}
            >
              {paymentMode.map((mode) => (
                <MenuItem key={mode} value={mode}>
                  {mode}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Amount"
              required
              variant="outlined"
              value={expenseDetails.expenseAmount || ''}
              onChange={(e) => handleInputChange('expenseAmount', parseFloat(e.target.value) || 0)}
              type="number"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Comment"
              variant="standard"
              value={expenseDetails.comment || ''}
              onChange={(e) => handleInputChange('comment', e.target.value)}
            />
          </Grid>
        </Grid>
      </MainCard>
      <br></br>
      <div className="content">
        {isExpenseComplete() && (
          <Button variant="contained" color="error" onClick={() => saveExpense(expenseDetails)}>
            Add/Update Expense
          </Button>
        )}
      </div>
      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}
    </div>
  );
}

ExpenseCreate.propTypes = {
  data: PropTypes.object,
  setExpenseUpdateOpen: PropTypes.func,
  fetchAllExpenseData: PropTypes.func
};
export default ExpenseCreate;
