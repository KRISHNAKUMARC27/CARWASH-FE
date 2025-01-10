import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
//import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { ListItemText } from '@mui/material';
import PropTypes from 'prop-types';
import { gridSpacing } from 'store/constant';

function DataRowDialog({ open, onClose, dataRow }) {
  // Function to display either a string, an array, or a null value as list items
  const renderValue = (value) => {
    if (value === null || value === undefined) {
      // Render null or undefined value
      return 'N/A'; // Or any placeholder you prefer
    } else if (Array.isArray(value)) {
      // Render a sublist if the value is an array
      return (
        <Grid container spacing={gridSpacing}>
          <List dense>
            {value.map((item, index) => (
              <ListItem key={index}>
                <Grid container spacing={gridSpacing}>
                  {Object.entries(item).map(([key, val]) => (
                    <React.Fragment key={key}>
                      <Grid item lg={3} md={6} sm={6} xs={6}>
                        {/* <Typography component="div" variant="body2" style={{ fontWeight: 'bold', color: 'black' }}>
                          {key}:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography component="div" variant="h6" style={{ color: 'black' }}>
                          {val}
                        </Typography> */}
                        <ListItemText primary={key.replace(/([A-Z])/g, ' $1').trim()} secondary={val} />
                      </Grid>
                      {/* &nbsp;{JSON.stringify(val, null, 2)}
                    <br /> */}
                    </React.Fragment>
                  ))}
                </Grid>
              </ListItem>
            ))}
          </List>
        </Grid>
      );
    } else {
      // Render value if it is not null, undefined, or an array
      console.log(`Rendering value for key: ${value}`);

      return value;
    }
  };

  console.log('DataRow: ', dataRow);

  const keysToShow = Object.keys(dataRow); // Assuming dataRow is always an object

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="data-row-dialog-title" fullWidth maxWidth="lg">
      <DialogTitle id="data-row-dialog-title">Row Details</DialogTitle>

      <DialogContent dividers style={{ backgroundColor: 'white', color: 'black' }}>
        {' '}
        <Grid container spacing={gridSpacing}>
          {keysToShow
            .filter((key) => key !== 'id')
            .map((key) => (
              <React.Fragment key={key}>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  {/* <Typography gutterBottom variant="subtitle1" component="div">
                    <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong>
                  </Typography>
                </Grid>
                <Grid item lg={3} md={6} sm={6} xs={12}>
                  <Typography variant="body2" gutterBottom component="div" style={{ color: 'black' }}>
                    {renderValue(dataRow[key])}
                  </Typography> */}
                  <ListItemText primary={key.replace(/([A-Z])/g, ' $1').trim()} secondary={renderValue(dataRow[key])} />
                </Grid>
              </React.Fragment>
            ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

DataRowDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  dataRow: PropTypes.object.isRequired
};

export default DataRowDialog;
