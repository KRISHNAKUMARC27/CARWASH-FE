import { Alert, Dialog, DialogContent, Stack } from '@mui/material';
import PropTypes from 'prop-types';

const AlertDialog = ({ showAlert, setShowAlert, alertColor, alertMess }) => {
  return (
    <Dialog open={showAlert} onClose={() => setShowAlert(false)} aria-labelledby="data-row-dialog-title" fullWidth maxWidth="lg">
      <DialogContent dividers style={{ backgroundColor: 'white', color: 'black' }}>
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert variant="filled" severity={alertColor} onClose={() => setShowAlert(false)}>
            {alertMess}
          </Alert>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

AlertDialog.propTypes = {
  showAlert: PropTypes.bool.isRequired,
  setShowAlert: PropTypes.func.isRequired,
  alertMess: PropTypes.string.isRequired,
  alertColor: PropTypes.string.isRequired
};
export default AlertDialog;
