import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Grid } from '@mui/material';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  Autocomplete,
  InputLabel,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

import { gridSpacing } from 'store/constant';
import { getRequest, postRequest } from 'utils/fetchRequest';

const JobLaborUpdate = ({ data, updateData }) => {
  const [laborCategoryList, setLaborCategoryList] = React.useState([]);
  const [options, setOptions] = React.useState([]);
  const [allLabor, setAllLabor] = React.useState([]);

  React.useEffect(() => {
    fetchAllLaborCategoryListData();
    fetchAllLaborData();
    return () => {
      setLaborCategoryList([]);
      setOptions([]);
      setAllLabor([]);
    };
  }, []);

  const fetchAllLaborCategoryListData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/labor/laborCategory');
      setLaborCategoryList(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchAllLaborData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/labor');
      setAllLabor(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchOptions = async (value) => {
    try {
      const data = await postRequest(process.env.REACT_APP_API_URL + '/labor/findLaborInventoryWithFilter', value);
      setOptions(data);
    } catch (err) {
      console.log(err.message);
    }
  };

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

  const handleCategoryTypeChange = (value) => {
    let myArray = [value];
    const laborFilter = {
      categoryList: myArray
    };
    fetchOptions(laborFilter);
  };

  return (
    <>
      <MainCard title="Job Labor Information">
        <Grid container direction="row" spacing={gridSpacing}>
          <Grid item xs={12}>
            <div style={{ overflowX: 'auto' }}>
              <Table style={{ minWidth: 1000 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Labor Category</TableCell>
                    <TableCell>Labor</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Rate</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                          <InputLabel id="demo-simple-select-standard-label"></InputLabel>
                          <Select
                            fullWidth
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard-label"
                            value={row?.category || ''}
                            label="Category Type"
                            sx={{
                              '& .MuiSelect-select': {
                                color: 'black' // Change to your desired color
                              }
                            }}
                            onChange={(e) => {
                              handleCategoryTypeChange(e.target.value);
                              handleInputChange(index, 'category', e.target.value);
                            }}
                          >
                            {laborCategoryList.map((option) => (
                              <MenuItem key={option.id} value={option.category}>
                                {option.category}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <Autocomplete
                          options={options.filter((option) => !data.some((row) => row.sparesId === option.id))} // Filter out already added spares
                          getOptionLabel={(option) => option.desc}
                          style={{ width: 300 }}
                          //inputValue={row?.sparesAndLabour || ''}
                          //onInputChange={handleInputChangeFilter}
                          //value={row || ''}
                          value={allLabor.find((option) => option.desc === row.sparesAndLabour) || null}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          onChange={(event, newValue) => {
                            console.log('new value is ' + JSON.stringify(newValue));
                            //setChoosenLabor(newValue);
                            handleInputChange(index, 'sparesAndLabour', newValue.desc);
                            handleInputChange(index, 'rate', newValue.amount);
                            handleInputChange(index, 'amount', newValue.amount * row?.qty || 0);
                            handleInputChange(index, 'sparesId', newValue.id);
                          }}
                          renderInput={(params) => <TextField {...params} label="Search Labor" disabled={!!row.sparesId} />}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={row?.qty || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            handleInputChange(index, 'qty', val);
                            handleInputChange(index, 'amount', val * row?.rate || 0);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField fullWidth value={row?.rate || ''} onChange={(e) => handleInputChange(index, 'rate', e.target.value)} />
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

JobLaborUpdate.propTypes = {
  data: PropTypes.array.isRequired,
  updateData: PropTypes.func.isRequired
};
export default JobLaborUpdate;
