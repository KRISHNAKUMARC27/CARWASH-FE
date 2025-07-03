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
import {} from '@mui/material';

import { postRequest } from 'utils/fetchRequest';
import { AddCircle, RemoveCircle } from '@mui/icons-material';

const BillPayment = ({ invoice, setInvoice, paymentModes, invoiceCreateOpen, handleClose, setAlertMess, setShowAlert, setAlertColor }) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [remainingAmount, setRemainingAmount] = useState(0); // To store remaining amount dynamically
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return () => {
      setRemainingAmount(0);
    };
  }, []);
  const handlePaymentSplitChange = (index, field, value) => {
    const updatedPaymentSplitList = [...invoice.paymentSplitList];
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

    const grandTotal = invoice.grandTotal || 0;
    const pendingAmount = grandTotal - totalPaidExcludingCredit;

    setInvoice((prevState) => ({
      ...prevState,
      paymentSplitList: updatedPaymentSplitList,
      pendingAmount: pendingAmount > 0 ? pendingAmount : 0,
      creditFlag: updatedPaymentSplitList.some((split) => split.paymentMode === 'CREDIT')
    }));
  };

  const addPaymentSplitRow = () => {
    const grandTotal = invoice.grandTotal || 0;
    const totalPaid = invoice.paymentSplitList.reduce((sum, split) => sum + (split.paymentAmount || 0), 0);
    const remainingAmount = grandTotal - totalPaid;

    if (remainingAmount <= 0) {
      alert('No remaining amount to allocate. Please adjust the existing payment splits.');
      return;
    }

    // Add a new row with the remaining amount prefilled
    setInvoice((prevState) => ({
      ...prevState,
      paymentSplitList: [
        ...prevState.paymentSplitList,
        { paymentAmount: remainingAmount, paymentMode: 'CASH', flag: 'ADD' } // Prefill paymentAmount with remaining value
      ]
    }));
  };

  const removePaymentSplitRow = (index) => {
    const updatedPaymentSplitList = [...invoice.paymentSplitList];
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

    setInvoice((prevState) => ({
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
    setInvoice((prevState) => ({
      ...prevState,
      paymentSplitList: [...prevState.paymentSplitList, { paymentAmount: remainingAmount, paymentMode: 'CREDIT' }],
      pendingAmount: remainingAmount,
      creditFlag: true
    }));
    // handleClose();
    // handleInvoiceSave(); // Proceed with saving the invoice
  };

  // Handle changes in credit payments
  const handleCreditPaymentChange = (index, field, value) => {
    const updatedCreditPaymentList = [...invoice.creditPaymentList];
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

    setInvoice((prevState) => ({
      ...prevState,
      creditPaymentList: updatedCreditPaymentList
    }));
  };

  // Add a new credit payment row
  const addCreditPaymentRow = () => {
    const grandTotal = invoice.grandTotal || 0;
    const totalPaid = invoice.paymentSplitList
      .filter((payment) => payment.paymentMode !== 'CREDIT')
      .reduce((sum, split) => sum + (split.paymentAmount || 0), 0);
    const totalCreditPaid = invoice.creditPaymentList.reduce((sum, cred) => sum + (cred.amount || 0), 0);
    const remainingAmount = grandTotal - totalPaid - totalCreditPaid;

    if (remainingAmount <= 0) {
      alert('No remaining amount to allocate. Please adjust the existing payment splits.');
      return;
    }

    // Add a new row with the remaining amount prefilled
    setInvoice((prevState) => ({
      ...prevState,
      creditPaymentList: [
        ...(prevState.creditPaymentList || []), // Safely fallback to an empty array
        { amount: remainingAmount, paymentMode: 'CASH', comment: '', flag: 'ADD' } // New credit payment row
      ]
    }));
  };

  // Remove a credit payment row
  const removeCreditPaymentRow = (index) => {
    const updatedCreditPaymentList = [...invoice.creditPaymentList];
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

    const grandTotal = invoice.grandTotal || 0;
    const newPendingAmount = grandTotal - totalCreditPayments;

    setInvoice((prevState) => ({
      ...prevState,
      creditPaymentList: updatedCreditPaymentList,
      pendingAmount: newPendingAmount > 0 ? newPendingAmount : 0,
      creditSettledFlag: newPendingAmount === 0
    }));
  };

  const handleInvoiceSave = async () => {
    if (saving) return; // Prevent multiple triggers

    if (invoice.grandTotal <= 0) {
      alert('Grand total is 0. Cannot generate bill');
      return;
    }

    const grandTotal = invoice.grandTotal || 0;

    // Filter out DELETE for validation and calculation
    const activePaymentSplits = invoice.paymentSplitList.filter((split) => split.flag !== 'DELETE');
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

    const activeCreditPayments = invoice.creditPaymentList.filter((credit) => credit.flag !== 'DELETE');
    if (activeCreditPayments.some((credit) => !credit.paymentMode)) {
      alert('Please select a payment mode for all entries.');
      return;
    }

    const totalCreditPayments = activeCreditPayments.reduce((sum, credit) => sum + (credit.amount || 0), 0);
    const totalPaidExcludingCredit = activePaymentSplits
      .filter((split) => split.paymentMode !== 'CREDIT')
      .reduce((sum, split) => sum + (split.paymentAmount || 0), 0);

    const newPendingAmount = grandTotal - totalPaidExcludingCredit - totalCreditPayments;

    const updatedInvoice = {
      ...invoice,
      pendingAmount: newPendingAmount > 0 ? newPendingAmount : 0,
      creditSettledFlag: newPendingAmount > 0 ? false : true
      // Include all rows including DELETEs for backend
      // invoice.paymentSplitList and invoice.creditPaymentList already contain full list
    };

    try {
      setSaving(true);
      const data = await postRequest(process.env.REACT_APP_API_URL + '/invoice', updatedInvoice);
      setAlertMess('Bill id ' + data.invoiceId + ' saved successfully');
      setAlertColor('success');
      setShowAlert(true);
      handleClose();
    } catch (err) {
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
      handleClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {invoiceCreateOpen && (
        <Dialog open={invoiceCreateOpen} onClose={handleClose} scroll="paper" fullWidth maxWidth="lg" aria-labelledby="scroll-dialog-title">
          <DialogTitle id="scroll-dialog-title" sx={{ fontSize: '1rem' }}>
            Invoice Generation for {invoice.vehicleRegNo}
          </DialogTitle>

          <DialogContent dividers>
            <Box sx={{ my: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Grand Total" required variant="outlined" value={invoice?.grandTotal || 0} />
                </Grid>

                {invoice.paymentSplitList
                  .filter((split) => split.flag !== 'DELETE')
                  .map((split, index) => (
                    <Grid container item spacing={2} key={index} alignItems="center" sx={{ mt: 1 }}>
                      <Grid item xs={12} sm={5}>
                        <TextField
                          fullWidth
                          label="Payment Amount"
                          variant="outlined"
                          type="number"
                          required
                          value={split.paymentAmount}
                          onChange={(e) => handlePaymentSplitChange(index, 'paymentAmount', parseFloat(e.target.value) || 0)}
                          disabled={!!split.paymentDate}
                        />
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <TextField
                          select
                          label="Payment Mode"
                          variant="outlined"
                          fullWidth
                          required
                          value={split.paymentMode || 'CASH'}
                          onChange={(e) => handlePaymentSplitChange(index, 'paymentMode', e.target.value)}
                          disabled={!!split.paymentDate}
                        >
                          {paymentModes.map((mode) => (
                            <MenuItem key={mode} value={mode}>
                              {mode}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        {index === 0 ? (
                          <IconButton onClick={addPaymentSplitRow} disabled={!!split.paymentDate}>
                            <AddCircle />
                          </IconButton>
                        ) : (
                          <IconButton onClick={() => removePaymentSplitRow(index)} color="error" disabled={!!split.paymentDate}>
                            <RemoveCircle />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  ))}

                {invoice.creditFlag && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="h5" sx={{ mt: 3 }}>
                        Credit Payment
                      </Typography>
                    </Grid>
                    {(invoice.creditPaymentList || [])
                      .filter((credit) => credit.flag !== 'DELETE')
                      .map((credit, index) => (
                        <Grid container item spacing={2} key={index} alignItems="center" sx={{ mt: 1 }}>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="Credit Amount"
                              variant="outlined"
                              type="number"
                              required
                              value={credit.amount}
                              onChange={(e) => handleCreditPaymentChange(index, 'amount', parseFloat(e.target.value) || 0)}
                              disabled={!!credit.creditDate}
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              select
                              fullWidth
                              label="Payment Mode"
                              variant="outlined"
                              value={credit.paymentMode || 'CASH'}
                              onChange={(e) => handleCreditPaymentChange(index, 'paymentMode', e.target.value)}
                              disabled={!!credit.creditDate}
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
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="Comment"
                              variant="outlined"
                              value={credit.comment || ''}
                              onChange={(e) => handleCreditPaymentChange(index, 'comment', e.target.value)}
                              disabled={!!credit.creditDate}
                            />
                          </Grid>
                          <Grid item xs={12} sm={1}>
                            <IconButton onClick={() => removeCreditPaymentRow(index)} color="error" disabled={!!credit.creditDate}>
                              <RemoveCircle />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ))}
                    <Grid item xs={12}>
                      <Button onClick={addCreditPaymentRow} startIcon={<AddCircle />} sx={{ mt: 1 }}>
                        Add Credit Payment
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="error">
              Close
            </Button>
            <Button onClick={handleInvoiceSave} color="success" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {confirmDialogOpen && (
        <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog}>
          <DialogTitle>Confirm Remaining Amount</DialogTitle>
          <DialogContent>
            <Typography>
              The remaining amount of <b>{remainingAmount}</b> will be added as CREDIT. Do you want to proceed?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog} color="error">
              No
            </Button>
            <Button onClick={handleConfirmAddCredit} color="success">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

BillPayment.propTypes = {
  invoice: PropTypes.object.isRequired,
  setInvoice: PropTypes.func.isRequired,
  paymentModes: PropTypes.array.isRequired,
  invoiceCreateOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  setAlertMess: PropTypes.func.isRequired,
  setShowAlert: PropTypes.func.isRequired,
  setAlertColor: PropTypes.func.isRequired
};
export default BillPayment;
