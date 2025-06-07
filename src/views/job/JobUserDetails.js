import PropTypes from 'prop-types';

// material-ui
import { Grid, TextField } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

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
    const updatedData = { ...data, ownerPhoneNumber: event.target.value };
    updateData(updatedData);
  };

  return (
    <>
      <MainCard title="Job Card User Details">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Owner Name"
              required
              fullWidth
              variant="outlined"
              value={data.ownerName || ''}
              onChange={handleOwnerNameChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Owner PhoneNumber"
              required
              fullWidth
              variant="outlined"
              value={data.ownerPhoneNumber || ''}
              onChange={handleOwnerPhoneNumberChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Owner Address"
              fullWidth
              margin="dense"
              multiline
              minRows={2}
              variant="outlined"
              value={data.ownerAddress || ''}
              onChange={handleOwnerAddressChange}
            />
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
};

JobUserDetails.propTypes = {
  data: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired
};
export default JobUserDetails;
