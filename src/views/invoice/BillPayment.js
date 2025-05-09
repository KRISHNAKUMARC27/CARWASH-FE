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
  Typography
} from '@mui/material';
import {} from '@mui/material';

import { gridSpacing } from 'store/constant';
import { postRequest } from 'utils/fetchRequest';
import { AddCircle, RemoveCircle } from '@mui/icons-material';

const BillPayment = ({ invoice, setInvoice, paymentModes, invoiceCreateOpen, handleClose, setAlertMess, setShowAlert, setAlertColor }) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [remainingAmount, setRemainingAmount] = useState(0); // To store remaining amount dynamically

  useEffect(() => {
    return () => {
      setRemainingAmount(0);
    };
  }, []);

  const handlePaymentSplitChange = (index, field, value) => {
    const updatedPaymentSplitList = [...invoice.paymentSplitList];

    // Update the specific field in the payment split list
    updatedPaymentSplitList[index] = {
      ...updatedPaymentSplitList[index],
      [field]: value
    };

    // Calculate the pending amount and credit flag
    const totalPaidExcludingCredit = updatedPaymentSplitList
      .filter((split) => split.paymentMode !== 'CREDIT') // Exclude CREDIT payments
      .reduce((sum, split) => sum + (split.paymentAmount || 0), 0); // Sum up payment amounts

    const grandTotal = invoice.grandTotal || 0;
    const pendingAmount = grandTotal - totalPaidExcludingCredit;

    setInvoice((prevState) => ({
      ...prevState,
      paymentSplitList: updatedPaymentSplitList,
      pendingAmount: pendingAmount > 0 ? pendingAmount : 0, // Ensure non-negative pending amount
      creditFlag: updatedPaymentSplitList.some((split) => split.paymentMode === 'CREDIT') // Set creditFlag if CREDIT is used
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
        { paymentAmount: remainingAmount, paymentMode: '' } // Prefill paymentAmount with remaining value
      ]
    }));
  };

  const removePaymentSplitRow = (index) => {
    const updatedPaymentSplitList = invoice.paymentSplitList.filter((_, i) => i !== index);
    setInvoice((prevState) => ({ ...prevState, paymentSplitList: updatedPaymentSplitList }));
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

    // Update the specific field in the credit payment list
    updatedCreditPaymentList[index] = {
      ...updatedCreditPaymentList[index],
      [field]: value
    };

    // Calculate new pending amount

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
        { amount: remainingAmount, paymentMode: '', comment: '' } // New credit payment row
      ]
    }));
  };

  // Remove a credit payment row
  const removeCreditPaymentRow = (index) => {
    const updatedCreditPaymentList = invoice.creditPaymentList.filter((_, i) => i !== index);

    // Recalculate pendingAmount after removing a row
    const totalCreditPayments = updatedCreditPaymentList.reduce((sum, credit) => sum + (credit.amount || 0), 0);
    const newPendingAmount = (invoice.grandTotal || 0) - totalCreditPayments;

    setInvoice((prevState) => ({
      ...prevState,
      creditPaymentList: updatedCreditPaymentList,
      pendingAmount: newPendingAmount > 0 ? newPendingAmount : 0,
      creditSettledFlag: newPendingAmount === 0
    }));
  };

  const handleInvoiceSave = async () => {
    //console.log(invoice);
    if (invoice.grandTotal <= 0) {
      alert('Grant total is 0. Cannot generate bill');
      return;
    }
    const grandTotal = invoice.grandTotal || 0;
    const totalPaid = invoice.paymentSplitList.reduce((sum, split) => sum + (split.paymentAmount || 0), 0);
    const remaining = grandTotal - totalPaid;

    console.log('REMAINING ' + remaining);
    const hasEmptyPaymentMode = invoice.paymentSplitList.some((split) => !split.paymentMode);

    if (hasEmptyPaymentMode) {
      alert('Please select a payment mode for all entries.');
      return;
    }

    if (remaining > 0) {
      // Automatically add CREDIT for the remaining amount
      console.log("I'm still open");
      console.log(invoice);
      handleOpenConfirmDialog(remaining);
      return;
    } else if (remaining < 0) {
      // Show alert if overpayment occurs
      alert('Payment exceeds the grand total. Please adjust the amounts.');
      return;
    }

    const updatedCreditPaymentList = [...invoice.creditPaymentList];
    const hasEmptyPaymentModeCredit = updatedCreditPaymentList.some((split) => !split.paymentMode);

    if (hasEmptyPaymentModeCredit) {
      alert('Please select a payment mode for all entries.');
      return;
    }

    const totalCreditPayments = updatedCreditPaymentList.reduce((sum, credit) => sum + (credit.amount || 0), 0);

    const updatedPaymentSplitList = [...invoice.paymentSplitList];

    const totalPaidExcludingCredit = updatedPaymentSplitList
      .filter((split) => split.paymentMode !== 'CREDIT') // Exclude CREDIT payments
      .reduce((sum, split) => sum + (split.paymentAmount || 0), 0); // Sum up payment amounts

    const newPendingAmount = grandTotal - totalPaidExcludingCredit - totalCreditPayments;

    console.log('GrandTotal ' + grandTotal);
    console.log('totalPaidExcludingCredit ' + totalPaidExcludingCredit);
    console.log('totalCreditPayments' + totalCreditPayments);
    console.log('newPendingAmount ' + newPendingAmount);

    const updatedInvoice = {
      ...invoice,
      pendingAmount: newPendingAmount > 0 ? newPendingAmount : 0,
      creditSettledFlag: newPendingAmount > 0 ? false : true
    };

    try {
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
    }
  };

  return (
    <>
      {invoiceCreateOpen && (
        <Dialog
          open={invoiceCreateOpen}
          onClose={handleClose}
          scroll={'paper'}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle id="scroll-dialog-title" sx={{ fontSize: '1.0rem' }}>
            Invoice Generation for {invoice.vehicleRegNo}
          </DialogTitle>

          <DialogContent dividers={scroll === 'paper'}>
            <br></br>
            <Grid container direction="row" spacing={gridSpacing}>
              <Grid item xs={6}>
                <TextField label="Grand Total" required variant="outlined" value={invoice?.grandTotal || 0} />
              </Grid>
              {invoice.paymentSplitList.map((split, index) => (
                <Grid container item spacing={gridSpacing} key={index} alignItems="center">
                  <Grid item xs={5}>
                    <TextField
                      label="Payment Amount"
                      variant="outlined"
                      fullWidth
                      required
                      value={split.paymentAmount}
                      onChange={(e) => handlePaymentSplitChange(index, 'paymentAmount', parseFloat(e.target.value) || 0)}
                      type="number"
                      disabled={!!split.paymentDate}
                    />
                  </Grid>
                  <Grid item xs={5}>
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
                  <Grid item xs={2}>
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
            <br></br>
            {invoice.creditFlag && (
              <Grid container direction="row" spacing={gridSpacing}>
                <Grid item xs={4}>
                  <Typography variant="h4">Credit Payment</Typography>
                </Grid>
                {(invoice.creditPaymentList || []).map((credit, index) => (
                  <Grid container item spacing={gridSpacing} key={index} alignItems="center">
                    <Grid item xs={4}>
                      <TextField
                        label="Credit Amount"
                        variant="outlined"
                        fullWidth
                        required
                        value={credit.amount}
                        onChange={(e) => handleCreditPaymentChange(index, 'amount', parseFloat(e.target.value) || 0)}
                        type="number"
                        disabled={!!credit.creditDate}
                      />
                    </Grid>
                    <Grid item xs={3}>
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
                          .filter((mode) => mode !== 'CREDIT') // Exclude "CREDIT"
                          .map((mode) => (
                            <MenuItem key={mode} value={mode}>
                              {mode}
                            </MenuItem>
                          ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Comment"
                        variant="outlined"
                        fullWidth
                        value={credit.comment || ''}
                        disabled={!!credit.creditDate}
                        onChange={(e) => handleCreditPaymentChange(index, 'comment', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton onClick={() => removeCreditPaymentRow(index)} color="secondary" disabled={!!credit.creditDate}>
                        <RemoveCircle />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button onClick={addCreditPaymentRow} color="primary" startIcon={<AddCircle />}>
                    Add Credit Payment
                  </Button>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Close
            </Button>
            <Button onClick={handleInvoiceSave} color="secondary">
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
