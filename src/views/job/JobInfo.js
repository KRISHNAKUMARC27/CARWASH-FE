import PropTypes from 'prop-types';

// material-ui
import { Grid } from '@mui/material';
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

const JobInfo = ({ data, updateData }) => {
  const handleInputChange = (index, column, value) => {
    const newRows = [...data];
    newRows[index][column] = value;
    updateData(newRows);
  };

  const addAdditionalRows = () => {
    const newRows = [...Array(1)].map(() => ({ complaints: '', completed: '', remarks: '' }));
    updateData((prevRows) => [...prevRows, ...newRows]);
  };

  const handleRowDelete = (rowIndex) => {
    const newRows = [...data];
    newRows.splice(rowIndex, 1);
    if (newRows.length > 0) {
      updateData(newRows);
    } else {
      updateData([...Array(1)].map(() => ({ complaints: '', completed: '', remarks: '' })));
    }
  };

  return (
    <>
      <MainCard title="Job Card Information">
        <Grid container direction="row" spacing={gridSpacing}>
          <Grid item xs={12}>
            <div style={{ overflowX: 'auto' }}>
              <Table style={{ minWidth: 1000 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer Complaints</TableCell>
                    <TableCell>Completed</TableCell>
                    <TableCell>Remarks</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={row?.complaints || ''}
                          onChange={(e) => handleInputChange(index, 'complaints', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <FormControl variant="outlined" style={{ margin: '1px 0' }}>
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={row?.completed || ''}
                            onChange={(e) => handleInputChange(index, 'completed', e.target.value)}
                            label="Status"
                          >
                            <MenuItem value="Completed">Completed</MenuItem>
                            <MenuItem value="In-Progress">In-Progress</MenuItem>
                            <MenuItem value="Not Started">Not Started</MenuItem>
                          </Select>
                        </FormControl>
                        {/* <TextField
                        fullWidth
                        value={row?.completed || ''}
                        onChange={(e) => handleInputChange(index, 'completed', e.target.value)}
                      /> */}
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={row?.remarks || ''}
                          onChange={(e) => handleInputChange(index, 'remarks', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="contained" color="error" onClick={() => handleRowDelete(index)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Grid item xs={12}>
              <br></br>
              <Button variant="contained" color="error" onClick={addAdditionalRows}>
                Add Row
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
};

JobInfo.propTypes = {
  data: PropTypes.array.isRequired,
  updateData: PropTypes.func.isRequired
};
export default JobInfo;
