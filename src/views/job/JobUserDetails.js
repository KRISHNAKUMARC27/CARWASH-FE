import PropTypes from 'prop-types';

// material-ui
import { Grid } from '@mui/material';
//import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { TextField } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

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
        <Grid container direction="row" spacing={gridSpacing}>
          <Grid item xs={6}>
            <TextField label="Owner Name" required variant="outlined" value={data.ownerName || ''} onChange={handleOwnerNameChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Owner PhoneNumber"
              required
              variant="outlined"
              value={data.ownerPhoneNumber || ''}
              onChange={handleOwnerPhoneNumberChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Owner Address"
              fullWidth
              margin="dense"
              multiline
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
