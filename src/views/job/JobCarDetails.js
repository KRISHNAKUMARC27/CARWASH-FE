import PropTypes from 'prop-types';

// material-ui
import { Grid, TextField } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

const JobCarDetails = ({ data, updateData }) => {
  const handleVehicleRegNoChange = (event) => {
    const updatedData = { ...data, vehicleRegNo: event.target.value.toUpperCase() };
    updateData(updatedData);
  };
  const handleVehicleNameChange = (event) => {
    const updatedData = { ...data, vehicleName: event.target.value };
    updateData(updatedData);
  };
  const handleKMsChange = (event) => {
    const updatedData = { ...data, kiloMeters: event.target.value };
    updateData(updatedData);
  };

  return (
    <>
      <MainCard title="Job Card Vehicle Details">
        <Grid container direction="row" spacing={gridSpacing}>
          <Grid item xs={4}>
            <TextField
              label="Vehicle Reg. No."
              required
              variant="outlined"
              value={data.vehicleRegNo || ''}
              onChange={handleVehicleRegNoChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField label="Vehicle Name" required variant="outlined" value={data.vehicleName || ''} onChange={handleVehicleNameChange} />
          </Grid>
          <Grid item xs={4}>
            <TextField label="Vehicle K.Ms" required variant="outlined" value={data.kiloMeters || ''} onChange={handleKMsChange} />
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
};

JobCarDetails.propTypes = {
  data: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired
};
export default JobCarDetails;
