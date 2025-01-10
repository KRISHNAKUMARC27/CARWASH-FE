import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Grid } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, TextField } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

import { gridSpacing } from 'store/constant';

const JobConsumablesUpdate = ({ data, updateData }) => {
  const handleInputChange = (index, column, value) => {
    const newRows = [...data];
    newRows[index][column] = value;
    updateData(newRows);
  };

  const addAdditionalRows = () => {
    const newRows = [...Array(1)].map(() => ({ sparesId: '', category: '', sparesAndLabour: '', qty: '', rate: '', amount: '' }));
    updateData((prevRows) => [...prevRows, ...newRows]);
  };

  const handleRowDelete = (rowIndex) => {
    const newRows = [...data];
    newRows.splice(rowIndex, 1);
    if (newRows.length > 0) {
      updateData(newRows);
    } else {
      updateData([...Array(1)].map(() => ({ sparesId: '', category: '', sparesAndLabour: '', qty: '', rate: '', amount: '' })));
    }
  };

  return (
    <>
      <MainCard title="Job Consumables Information">
        <Grid container direction="row" spacing={gridSpacing}>
          <Grid item xs={12}>
            <div style={{ overflowX: 'auto' }}>
              <Table style={{ minWidth: 1000 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Consumables</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={row?.sparesAndLabour || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            handleInputChange(index, 'sparesAndLabour', val);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={row?.amount || ''}
                          onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
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

JobConsumablesUpdate.propTypes = {
  data: PropTypes.array.isRequired,
  updateData: PropTypes.func.isRequired
};
export default JobConsumablesUpdate;
