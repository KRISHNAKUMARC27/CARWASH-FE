import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// material-ui
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Typography,
  Box
} from '@mui/material';

import { postRequest } from 'utils/fetchRequest';
import { AddCircle, RemoveCircle } from '@mui/icons-material';

const BillPayment = ({
  estimate,
  setEstimate,
  paymentModes,
  estimateCreateOpen,
  handleClose,
  setAlertMess,
  setShowAlert,
  setAlertColor
}) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [remainingAmount, setRemainingAmount] = useState(0); // To store remaining amount dynamically

  useEffect(() => {
    return () => {
      setRemainingAmount(0);
    };
  }, []);

  const handlePaymentSplitChange = (index, field, value) => {
    const updatedPaymentSplitList = [...estimate.paymentSplitList];
    const currentSplit = updatedPaymentSplitList[index];

    // Update the field
    const updatedSplit = {
      ...currentSplit,
      [field]: value
    };

    // If it's not a new record (no ADD flag) and already has a value, mark as MODIFY
    const isExisting = currentSplit.paymentId && currentSplit.flag !== 'ADD';
    if (isExisting) {
      updatedSplit.flag = 'MODIFY';
    }

    updatedPaymentSplitList[index] = updatedSplit;

    // Calculate totals
    const totalPaidExcludingCredit = updatedPaymentSplitList
      .filter((split) => split.paymentMode !== 'CREDIT')
      .reduce((sum, split) => sum + (split.paymentAmount || 0), 0);

    const grandTotal = estimate.grandTotal || 0;
    const pendingAmount = grandTotal - totalPaidExcludingCredit;

    setEstimate((prevState) => ({
      ...prevState,
      paymentSplitList: updatedPaymentSplitList,
      pendingAmount: pendingAmount > 0 ? pendingAmount : 0,
      creditFlag: updatedPaymentSplitList.some((split) => split.paymentMode === 'CREDIT')
    }));
  };

  const addPaymentSplitRow = () => {
    const grandTotal = estimate.grandTotal || 0;
    const totalPaid = estimate.paymentSplitList.reduce((sum, split) => sum + (split.paymentAmount || 0), 0);
    const remainingAmount = grandTotal - totalPaid;

    if (remainingAmount <= 0) {
      alert('No remaining amount to allocate. Please adjust the existing payment splits.');
      return;
    }

    // Add a new row with the remaining amount prefilled
    setEstimate((prevState) => ({
      ...prevState,
      paymentSplitList: [
        ...prevState.paymentSplitList,
        { paymentAmount: remainingAmount, paymentMode: 'CASH', flag: 'ADD' } // Prefill paymentAmount with remaining value
      ]
    }));
  };

  const removePaymentSplitRow = (index) => {
    const updatedPaymentSplitList = [...estimate.paymentSplitList];
    const currentSplit = updatedPaymentSplitList[index];

    if (currentSplit.flag === 'ADD') {
      // It's a new unsaved row, just remove it
      updatedPaymentSplitList.splice(index, 1);
    } else {
      // It's an existing row, mark it as DELETE
      updatedPaymentSplitList[index] = {
        ...currentSplit,
        flag: 'DELETE'
      };
    }

    setEstimate((prevState) => ({
      ...prevState,
      paymentSplitList: updatedPaymentSplitList
    }));
  };

  const handleOpenConfirmDialog = (remaining) => {
    setRemainingAmount(remaining); // Store remaining amount for context
    setConfirmDialogOpen(true);
  };

  // Close the confirmation dialog
  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  // Handle user confirmation (Yes to add CREDIT, No to cancel)
  const handleConfirmAddCredit = () => {
    setConfirmDialogOpen(false); // Close confirmation dialog
    // Add remaining amount as CREDIT
    setEstimate((prevState) => ({
      ...prevState,
      paymentSplitList: [...prevState.paymentSplitList, { paymentAmount: remainingAmount, paymentMode: 'CREDIT' }],
      pendingAmount: remainingAmount,
      creditFlag: true
    }));
    // handleClose();
    // handleEstimateSave(); // Proceed with saving the estimate
  };

  // Handle changes in credit payments
  const handleCreditPaymentChange = (index, field, value) => {
    const updatedCreditPaymentList = [...estimate.creditPaymentList];
    const currentCredit = updatedCreditPaymentList[index];

    const updatedCredit = {
      ...currentCredit,
      [field]: value
    };

    // If it's an existing record and not marked as ADD, mark it as MODIFY
    const isExisting = currentCredit.paymentId && currentCredit.flag !== 'ADD';
    if (isExisting) {
      updatedCredit.flag = 'MODIFY';
    }

    updatedCreditPaymentList[index] = updatedCredit;

    setEstimate((prevState) => ({
      ...prevState,
      creditPaymentList: updatedCreditPaymentList
    }));
  };

  // Add a new credit payment row
  const addCreditPaymentRow = () => {
    const grandTotal = estimate.grandTotal || 0;
    const totalPaid = estimate.paymentSplitList
      .filter((payment) => payment.paymentMode !== 'CREDIT')
      .reduce((sum, split) => sum + (split.paymentAmount || 0), 0);
    const totalCreditPaid = estimate.creditPaymentList.reduce((sum, cred) => sum + (cred.amount || 0), 0);
    const remainingAmount = grandTotal - totalPaid - totalCreditPaid;

    if (remainingAmount <= 0) {
      alert('No remaining amount to allocate. Please adjust the existing payment splits.');
      return;
    }

    // Add a new row with the remaining amount prefilled
    setEstimate((prevState) => ({
      ...prevState,
      creditPaymentList: [
        ...(prevState.creditPaymentList || []), // Safely fallback to an empty array
        { amount: remainingAmount, paymentMode: 'CASH', comment: '', flag: 'ADD' } // New credit payment row
      ]
    }));
  };

  // Remove a credit payment row
  const removeCreditPaymentRow = (index) => {
    const updatedCreditPaymentList = [...estimate.creditPaymentList];
    const currentCredit = updatedCreditPaymentList[index];

    if (currentCredit.flag === 'ADD') {
      // Remove new row directly
      updatedCreditPaymentList.splice(index, 1);
    } else {
      // Mark existing row as DELETE
      updatedCreditPaymentList[index] = {
        ...currentCredit,
        flag: 'DELETE'
      };
    }

    // Recalculate pending amount after change
    const totalCreditPayments = updatedCreditPaymentList
      .filter((c) => c.flag !== 'DELETE') // Don't count deleted ones
      .reduce((sum, credit) => sum + (credit.amount || 0), 0);

    const grandTotal = estimate.grandTotal || 0;
    const newPendingAmount = grandTotal - totalCreditPayments;

    setEstimate((prevState) => ({
      ...prevState,
      creditPaymentList: updatedCreditPaymentList,
      pendingAmount: newPendingAmount > 0 ? newPendingAmount : 0,
      creditSettledFlag: newPendingAmount === 0
    }));
  };

  const handleEstimateSave = async () => {
    if (estimate.grandTotal <= 0) {
      alert('Grand total is 0. Cannot generate bill');
      return;
    }

    const grandTotal = estimate.grandTotal || 0;

    // Filter out DELETE for validation and calculation
    const activePaymentSplits = estimate.paymentSplitList.filter((split) => split.flag !== 'DELETE');
    const totalPaid = activePaymentSplits.reduce((sum, split) => sum + (split.paymentAmount || 0), 0);
    const remaining = grandTotal - totalPaid;

    if (activePaymentSplits.some((split) => !split.paymentMode)) {
      alert('Please select a payment mode for all entries.');
      return;
    }

    if (remaining > 0) {
      handleOpenConfirmDialog(remaining);
      return;
    } else if (remaining < 0) {
      alert('Payment exceeds the grand total. Please adjust the amounts.');
      return;
    }

    const activeCreditPayments = estimate.creditPaymentList.filter((credit) => credit.flag !== 'DELETE');
    if (activeCreditPayments.some((credit) => !credit.paymentMode)) {
      alert('Please select a payment mode for all entries.');
      return;
    }

    const totalCreditPayments = activeCreditPayments.reduce((sum, credit) => sum + (credit.amount || 0), 0);
    const totalPaidExcludingCredit = activePaymentSplits
      .filter((split) => split.paymentMode !== 'CREDIT')
      .reduce((sum, split) => sum + (split.paymentAmount || 0), 0);

    const newPendingAmount = grandTotal - totalPaidExcludingCredit - totalCreditPayments;

    const updatedEstimate = {
      ...estimate,
      pendingAmount: newPendingAmount > 0 ? newPendingAmount : 0,
      creditSettledFlag: newPendingAmount > 0 ? false : true
      // Include all rows including DELETEs for backend
      // estimate.paymentSplitList and estimate.creditPaymentList already contain full list
    };

    try {
      const data = await postRequest(process.env.REACT_APP_API_URL + '/estimate', updatedEstimate);
      setAlertMess('Bill id ' + data.estimateId + ' saved successfully');
      setAlertColor('success');
      setShowAlert(true);
      handleClose();
    } catch (err) {
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
      handleClose();
    }
  };

  return (
    <>
      {estimateCreateOpen && (
        <Dialog open={estimateCreateOpen} onClose={handleClose} scroll="paper" fullWidth maxWidth="lg">
          <DialogTitle id="scroll-dialog-title" sx={{ fontSize: '1rem' }}>
            Estimate Generation for {estimate.vehicleRegNo}
          </DialogTitle>

          <DialogContent dividers>
            <Box sx={{ my: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Grand Total" required fullWidth variant="outlined" value={estimate?.grandTotal || 0} />
                </Grid>

                {estimate.paymentSplitList
                  .filter((split) => split.flag !== 'DELETE')
                  .map((split, index) => (
                    <Grid container item spacing={2} key={index} alignItems="center">
                      <Grid item xs={12} sm={6} md={5}>
                        <TextField
                          label="Payment Amount"
                          variant="outlined"
                          fullWidth
                          required
                          type="number"
                          value={split.paymentAmount}
                          disabled={!!split.paymentDate}
                          onChange={(e) => handlePaymentSplitChange(index, 'paymentAmount', parseFloat(e.target.value) || 0)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={5}>
                        <TextField
                          select
                          label="Payment Mode"
                          variant="outlined"
                          fullWidth
                          required
                          value={split.paymentMode || 'CASH'}
                          disabled={!!split.paymentDate}
                          onChange={(e) => handlePaymentSplitChange(index, 'paymentMode', e.target.value)}
                        >
                          {paymentModes.map((mode) => (
                            <MenuItem key={mode} value={mode}>
                              {mode}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={12} md={2}>
                        {index === 0 ? (
                          <IconButton onClick={addPaymentSplitRow} color="primary" disabled={!!split.paymentDate}>
                            <AddCircle />
                          </IconButton>
                        ) : (
                          <IconButton onClick={() => removePaymentSplitRow(index)} color="secondary" disabled={!!split.paymentDate}>
                            <RemoveCircle />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  ))}
              </Grid>
            </Box>

            {estimate.creditFlag && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Credit Payment
                </Typography>
                {(estimate.creditPaymentList || [])
                  .filter((credit) => credit.flag !== 'DELETE')
                  .map((credit, index) => (
                    <Grid container item spacing={2} key={index} alignItems="center">
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Credit Amount"
                          variant="outlined"
                          fullWidth
                          type="number"
                          required
                          value={credit.amount}
                          disabled={!!credit.creditDate}
                          onChange={(e) => handleCreditPaymentChange(index, 'amount', parseFloat(e.target.value) || 0)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          select
                          label="Payment Mode"
                          variant="outlined"
                          fullWidth
                          required
                          value={credit.paymentMode || 'CASH'}
                          disabled={!!credit.creditDate}
                          onChange={(e) => handleCreditPaymentChange(index, 'paymentMode', e.target.value)}
                        >
                          {paymentModes
                            .filter((mode) => mode !== 'CREDIT')
                            .map((mode) => (
                              <MenuItem key={mode} value={mode}>
                                {mode}
                              </MenuItem>
                            ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Comment"
                          variant="outlined"
                          fullWidth
                          value={credit.comment || ''}
                          disabled={!!credit.creditDate}
                          onChange={(e) => handleCreditPaymentChange(index, 'comment', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={1}>
                        <IconButton onClick={() => removeCreditPaymentRow(index)} color="secondary" disabled={!!credit.creditDate}>
                          <RemoveCircle />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button onClick={addCreditPaymentRow} color="primary" startIcon={<AddCircle />}>
                    Add Credit Payment
                  </Button>
                </Grid>
              </Box>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Close
            </Button>
            <Button onClick={handleEstimateSave} color="secondary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {confirmDialogOpen && (
        <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog}>
          <DialogTitle>Confirm Remaining Amount</DialogTitle>
          <DialogContent>
            <p>
              The remaining amount of <b>{remainingAmount}</b> will be added as CREDIT. Do you want to proceed?
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmAddCredit} color="primary">
              Yes
            </Button>
            <Button onClick={handleCloseConfirmDialog} color="secondary">
              No
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

BillPayment.propTypes = {
  estimate: PropTypes.object.isRequired,
  setEstimate: PropTypes.func.isRequired,
  paymentModes: PropTypes.array.isRequired,
  estimateCreateOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  setAlertMess: PropTypes.func.isRequired,
  setShowAlert: PropTypes.func.isRequired,
  setAlertColor: PropTypes.func.isRequired
};
export default BillPayment;
