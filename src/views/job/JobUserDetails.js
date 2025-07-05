import PropTypes from 'prop-types';

// material-ui
import { Grid, TextField } from '@mui/material';

const JobUserDetails = ({ data, updateData }) => {
  const handleOwnerNameChange = (event) => {
    const updatedData = { ...data, ownerName: event.target.value };
    updateData(updatedData);
  };
  const handleOwnerAddressChange = (event) => {
    const updatedData = { ...data, ownerAddress: event.target.value };
    updateData(updatedData);
  };
  const handleOwnerPhoneNumberChange = (event) => {
    if (!/^\d*$/.test(event.target.value)) return; // only digits
    if (event.target.value.length > 10) return; // max 10 digits
    if (/^(\d)\1{9}$/.test(event.target.value)) return; // block 0000000000, 1111111111, etc.
    const updatedData = { ...data, ownerPhoneNumber: event.target.value };
    updateData(updatedData);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Owner Name"
            required
            fullWidth
            variant="outlined"
            value={data.ownerName || ''}
            onChange={handleOwnerNameChange}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            label="Owner PhoneNumber"
            required
            fullWidth
            variant="outlined"
            value={data.ownerPhoneNumber || ''}
            onChange={handleOwnerPhoneNumberChange}
            error={data.ownerPhoneNumber && data.ownerPhoneNumber.length !== 10}
            helperText={data.ownerPhoneNumber && data.ownerPhoneNumber.length !== 10 ? 'Phone number must be 10 digits' : ' '}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Owner Address"
            fullWidth
            variant="outlined"
            value={data.ownerAddress || ''}
            onChange={handleOwnerAddressChange}
          />
        </Grid>
      </Grid>
    </>
  );
};

JobUserDetails.propTypes = {
  data: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired
};
export default JobUserDetails;
