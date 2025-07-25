import React, { useState, useEffect } from 'react';
import {
  Button,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputLabel,
  FormControl,
  Stack,
  Grid,
  Box
} from '@mui/material';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MainCard from 'ui-component/cards/MainCard';
import AlertDialog from 'views/utilities/AlertDialog';
import { getRequest, postRequest } from 'utils/fetchRequest';

const SettleSalary = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [salaryDate, setSalaryDate] = useState(dayjs()); // Default: Today
  const [employeeSalary, setEmployeeSalary] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    salaryPaid: '',
    paymentMode: 'CASH',
    deductAdvance: ''
  });
  const [salaryAdvanceDialogOpen, setSalaryAdvanceDialogOpen] = useState(false);
  const [expense, setExpense] = useState({
    type: 'SALARY-ADVANCE',
    paymentMode: '',
    expenseAmount: 1,
    comment: ''
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMess, setAlertMess] = useState('');
  const [alertColor, setAlertColor] = useState('');

  const roles = JSON.parse(localStorage.getItem('roles') || '[]');

  useEffect(() => {
    fetchAllEmployeeListData();
  }, []);

  const fetchAllEmployeeListData = async () => {
    try {
      const data = await getRequest(`${process.env.REACT_APP_API_URL}/employee`);
      setEmployeeList(data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const setupEmployeeSalary = async (id) => {
    try {
      const data = await getRequest(
        `${process.env.REACT_APP_API_URL}/employee/setupEmployeeSalary/${id}/${salaryDate.format('YYYY-MM-DD')}`
      );
      setEmployeeSalary(data);
      setFormValues({
        salaryPaid: data.salaryEarned - data.salaryAdvance,
        paymentMode: 'CASH',
        deductAdvance: 0
      });
      setDialogOpen(true);
    } catch (err) {
      console.error('Error in setupEmployeeSalary:', err);
      setAlertMess(err.message || 'Error fetching employee salary.');
      setAlertColor('error');
      setShowAlert(true);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSalaryAdvanceDialogOpen(false);
    setEmployeeSalary(null);
    setFormValues({
      salaryPaid: '',
      paymentMode: ''
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const numericValue = Number(value);

    setFormValues((prev) => {
      let updated = { ...prev, [name]: value };

      if (name === 'deductAdvance') {
        const maxDeduct = Math.min(Number(employeeSalary?.salaryAdvance || 0), Number(employeeSalary?.salaryEarned || 0));

        let safeValue = numericValue;

        if (numericValue > maxDeduct) {
          alert(`Deduction cannot be greater than Salary Advance or Salary Earned (Max allowed: ${maxDeduct})`);
          safeValue = maxDeduct;
        }

        const newSalaryPaid = (Number(employeeSalary?.salaryEarned) || 0) - (safeValue || 0);

        updated = {
          ...updated,
          deductAdvance: safeValue,
          salaryPaid: newSalaryPaid < 0 ? 0 : newSalaryPaid
        };
      }

      return updated;
    });
  };

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    const numericValue = Number(value);

    if (numericValue < 1) {
      alert('Amount must be greater than 0');
      return;
    }
    setExpense((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitSalary = async () => {
    try {
      const payload = {
        ...employeeSalary,
        salaryPaid: formValues.salaryPaid,
        paymentMode: formValues.paymentMode,
        salaryDate: salaryDate.toISOString()
      };
      await postRequest(`${process.env.REACT_APP_API_URL}/employee/settleEmployeeSalary`, payload);

      setAlertMess('Salary settled successfully!');
      setAlertColor('success');
      setShowAlert(true);
      handleDialogClose();
    } catch (err) {
      console.error('Error submitting salary:', err);
      setAlertMess(err.message || 'Failed to submit salary.');
      setAlertColor('error');
      setShowAlert(true);
    }
  };

  const handleSubmitAdvance = async () => {
    try {
      const payload = {
        ...expense,
        desc: expense?.empName + ' - SALARY-ADVANCE'
      };
      await postRequest(`${process.env.REACT_APP_API_URL}/expense/salaryAdvance`, payload);

      setAlertMess('Salary advance added successfully!');
      setAlertColor('success');
      setShowAlert(true);
      handleDialogClose();
    } catch (err) {
      console.error('Error submitting advance:', err);
      setAlertMess(err.message || 'Failed to submit advance.');
      setAlertColor('error');
      setShowAlert(true);
    }
  };

  return (
    <>
      <MainCard title="Settle Salary">
        <Stack direction="row" spacing={2} mb={2}>
          <DatePicker label="Salary Date" value={salaryDate} onChange={(newValue) => setSalaryDate(newValue)} format="YYYY-MM-DD" />
        </Stack>
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Staff Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employeeList.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>
                    {roles.includes('ADMIN') && (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => setupEmployeeSalary(employee.id)}
                        sx={{ mb: { xs: 1, sm: 0 } }}
                      >
                        Settle Salary
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="info"
                      sx={{ ml: { sm: 1 }, mt: { xs: 1, sm: 0 } }}
                      onClick={() => {
                        setExpense((prev) => ({
                          ...prev,
                          empName: employee.name,
                          empId: employee.id
                        }));
                        setSalaryAdvanceDialogOpen(true);
                      }}
                    >
                      Pay Advance
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </MainCard>

      {/* Salary Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="xs"
        fullWidth
        sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 500, m: 1 } }}
      >
        <DialogTitle>Settle Salary - {employeeSalary?.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="dense"
                label="Salary Type"
                value={employeeSalary?.salaryType || ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="dense"
                label="Settlement Type"
                value={employeeSalary?.salarySettlementType || ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
          <TextField
            fullWidth
            margin="dense"
            label="Salary Earned"
            value={employeeSalary?.salaryEarned || ''}
            InputProps={{ readOnly: true }}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="dense"
                label="Salary Advance"
                value={employeeSalary?.salaryAdvance || ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="dense"
                label="Deduct from Advance"
                name="deductAdvance"
                type="number"
                value={formValues.deductAdvance}
                onChange={handleFormChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>
          <TextField
            fullWidth
            margin="dense"
            label="Salary To Be Paid"
            name="salaryPaid"
            type="number"
            value={formValues.salaryPaid}
            InputProps={{ readOnly: true }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Payment Mode</InputLabel>
            <Select name="paymentMode" value={formValues.paymentMode} onChange={handleFormChange} label="Payment Mode">
              <MenuItem value="CASH">Cash</MenuItem>
              <MenuItem value="BANK TRANSFER">Bank Transfer</MenuItem>
              <MenuItem value="UPI">UPI</MenuItem>
              {/* Add more if needed */}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="error">
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={handleSubmitSalary}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={salaryAdvanceDialogOpen}
        onClose={handleDialogClose}
        maxWidth="xs"
        fullWidth
        sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 500, m: 1 } }}
      >
        <DialogTitle>Paying Salary Advance for {expense?.empName}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Expense Type" value={expense?.type || ''} InputProps={{ readOnly: true }} />
          <TextField
            fullWidth
            margin="dense"
            label="Advance Amount"
            name="expenseAmount"
            type="number"
            value={expense.expenseAmount}
            onChange={handleExpenseChange}
            inputProps={{ min: 1 }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Payment Mode</InputLabel>
            <Select name="paymentMode" value={expense.paymentMode || 'CASH'} onChange={handleExpenseChange} label="Payment Mode">
              <MenuItem value="CASH">Cash</MenuItem>
              <MenuItem value="BANK TRANSFER">Bank Transfer</MenuItem>
              <MenuItem value="UPI">UPI</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth margin="dense" label="Comment" name="comment" value={expense.comment} onChange={handleExpenseChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="error">
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={handleSubmitAdvance}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert */}
      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}
    </>
  );
};

export default SettleSalary;
