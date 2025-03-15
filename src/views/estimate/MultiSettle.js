import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Button, MenuItem } from '@mui/material';

import { gridSpacing } from 'store/constant';
import { postRequest } from 'utils/fetchRequest';

const MultiSettle = ({ paymentModes, settleBillDialogOpen, selectedRows, handleClose, setAlertMess, setShowAlert }) => {
  const [multicredit, setMultiCredit] = useState({});

  useEffect(() => {
    return () => {
      setMultiCredit({});
    };
  }, []);

  const handleCreditPaymentChange = (field, value) => {
    const updatedData = { ...multicredit, [field]: value };
    setMultiCredit(updatedData);
  };

  const handleMultiPaymentSubmit = async () => {
    if (multicredit.paymentMode == null) {
      alert('Please select a payment mode.');
      return;
    }

    if (multicredit.amount == null || multicredit.amount <= 0) {
      alert('Enter valid amount');
      return;
    }

    const updatedMultiSettleObj = {
      ...multicredit,
      estimateIds: selectedRows.map((row) => row.id)
    };

    console.log(JSON.stringify(updatedMultiSettleObj));

    try {
      const data = await postRequest(process.env.REACT_APP_API_URL + '/estimate/multiCreditSettlement', updatedMultiSettleObj);
      console.log(data);
      setAlertMess(data.result);
      setShowAlert(true);
      handleClose();
    } catch (err) {
      setAlertMess(err.message);
      setShowAlert(true);
      handleClose();
    }
  };

  return (
    <>
      {settleBillDialogOpen && (
        <Dialog
          open={settleBillDialogOpen}
          onClose={handleClose}
          scroll={'paper'}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          fullWidth
          maxWidth="md"
        >
          <DialogTitle id="scroll-dialog-title" sx={{ fontSize: '1.0rem' }}>
            Multiple Credit Settlement
          </DialogTitle>

          <DialogContent dividers={scroll === 'paper'}>
            <br></br>
            <Grid container item spacing={gridSpacing} alignItems="center">
              <Grid item xs={4}>
                <TextField
                  label="Credit Amount"
                  variant="outlined"
                  fullWidth
                  required
                  value={multicredit.amount || 0}
                  onChange={(e) => handleCreditPaymentChange('amount', parseFloat(e.target.value) || 0)}
                  type="number"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  select
                  label="Payment Mode"
                  variant="outlined"
                  fullWidth
                  required
                  value={multicredit.paymentMode || ''}
                  onChange={(e) => handleCreditPaymentChange('paymentMode', e.target.value)}
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
                  value={multicredit.comment || ''}
                  onChange={(e) => handleCreditPaymentChange('comment', e.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleMultiPaymentSubmit} color="secondary">
              Save
            </Button>
            <Button onClick={handleClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

MultiSettle.propTypes = {
  paymentModes: PropTypes.array.isRequired,
  settleBillDialogOpen: PropTypes.bool.isRequired,
  selectedRows: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired,
  setAlertMess: PropTypes.func.isRequired,
  setShowAlert: PropTypes.func.isRequired
};
export default MultiSettle;
