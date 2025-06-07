import PropTypes from 'prop-types';

// material-ui
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Button, MenuItem, Box } from '@mui/material';

import { postRequest } from 'utils/fetchRequest';

const Receipt = ({ receipt, setReceipt, paymentModes, receiptDialogOpen, selectedRows, handleClose, setAlertMess, setShowAlert }) => {
  const handleReceiptChange = (field, value) => {
    const updatedData = { ...receipt, [field]: value };
    setReceipt(updatedData);
  };

  const handleReceiptSubmit = async () => {
    if (receipt.paymentMode == null) {
      alert('Please select a payment mode.');
      return;
    }

    if (receipt.amount == null || receipt.amount <= 0) {
      alert('Enter valid amount');
      return;
    }

    try {
      const data = await postRequest(process.env.REACT_APP_API_URL + '/estimate/receipt', receipt);
      setAlertMess('Receipt No.' + data.id + ' is generated');
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
      {receiptDialogOpen && (
        <Dialog
          open={receiptDialogOpen}
          onClose={handleClose}
          scroll="paper"
          fullWidth
          maxWidth="md"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title" sx={{ fontSize: '1.0rem' }}>
            Receipts for {selectedRows.map((row) => row.estimateId).join(', ')}
          </DialogTitle>

          <DialogContent dividers>
            <Box sx={{ my: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="ReceiptTo"
                    variant="outlined"
                    fullWidth
                    value={receipt.ownerName || ''}
                    onChange={(e) => handleReceiptChange('ownerName', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Credit Amount"
                    variant="outlined"
                    fullWidth
                    required
                    type="number"
                    value={receipt.amount || 0}
                    onChange={(e) => handleReceiptChange('amount', parseFloat(e.target.value) || 0)}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    select
                    label="Payment Mode"
                    variant="outlined"
                    fullWidth
                    required
                    value={receipt.paymentMode || ''}
                    onChange={(e) => handleReceiptChange('paymentMode', e.target.value)}
                  >
                    {[...new Set([...paymentModes.filter((mode) => mode !== 'CREDIT'), 'MULTI'])].map((mode) => (
                      <MenuItem key={mode} value={mode}>
                        {mode}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Comment"
                    variant="outlined"
                    fullWidth
                    value={receipt.comment || ''}
                    onChange={(e) => handleReceiptChange('comment', e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Close
            </Button>
            <Button onClick={handleReceiptSubmit} color="secondary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

Receipt.propTypes = {
  receipt: PropTypes.object.isRequired,
  setReceipt: PropTypes.func.isRequired,
  paymentModes: PropTypes.array.isRequired,
  receiptDialogOpen: PropTypes.bool.isRequired,
  selectedRows: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired,
  setAlertMess: PropTypes.func.isRequired,
  setShowAlert: PropTypes.func.isRequired
};
export default Receipt;
