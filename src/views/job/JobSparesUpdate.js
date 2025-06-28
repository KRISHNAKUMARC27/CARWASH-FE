import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Grid } from '@mui/material';
import {
  Table,
  TableContainer,
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
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import MainCard from 'ui-component/cards/MainCard';

//import { gridSpacing } from 'store/constant';
import { getRequest, postRequest } from 'utils/fetchRequest';

const JobSparesUpdate = ({ data, updateData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check for small screens

  const [sparesCategoryList, setSparesCategoryList] = React.useState([]);
  const [options, setOptions] = React.useState([]);
  const [allSpares, setAllSpares] = React.useState([]);

  const discountRole = ['ADMIN'];

  // Get logged-in user's roles
  const roles = JSON.parse(localStorage.getItem('roles')) || [];

  // Check if user is authorized to see the "DISCOUNT" column
  const isAuthorizedForDiscount = roles.some((role) => discountRole.includes(role));

  React.useEffect(() => {
    fetchAllSparesCategoryListData();
    fetchAllSparesData();
    return () => {
      setSparesCategoryList([]);
      setOptions([]);
      setAllSpares([]);
    };
  }, []);

  const fetchAllSparesCategoryListData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/spares/sparesCategory');
      setSparesCategoryList(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchAllSparesData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/spares');
      setAllSpares(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchOptions = async (value) => {
    try {
      const data = await postRequest(process.env.REACT_APP_API_URL + '/spares/findSparesInventoryWithFilter', value);
      setOptions(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleInputChange = (sparesId, column, value) => {
    const newRows = [...data];

    // Find the row based on sparesId
    const rowIndex = newRows.findIndex((row) => row.sparesId === sparesId);
    newRows[rowIndex][column] = value;
    // If the row was newly added (action === 'ADD'), remove it entirely
    if (newRows[rowIndex].action !== 'ADD') {
      newRows[rowIndex].action = 'MODIFY';
    }

    updateData(newRows); // Update the state
  };

  // const handleInputChange = (sparesId, column, value) => {
  //   const newRows = data.map((row) =>
  //     row.sparesId === sparesId ? { ...row, [column]: value, action: row.action !== 'ADD' ? 'MODIFY' : row.action } : row
  //   );
  //   updateData(newRows);
  // };

  // Add new spare rows with action set to ADD
  // const addAdditionalRows = () => {
  //   console.log('Data before add ');
  //   console.log(JSON.stringify(data));
  //   const newRows = [...Array(1)].map(() => ({
  //     sparesId: '',
  //     category: '',
  //     sparesAndLabour: '',
  //     qty: '',
  //     rate: '',
  //     amount: '',
  //     action: 'ADD'
  //   }));
  //   updateData((prevRows) => [...prevRows, ...newRows]);
  //   console.log('Data post Add ');
  //   console.log(JSON.stringify(data));
  // };

  const addAdditionalRows = () => {
    const newRows = [...Array(1)].map(() => ({
      sparesId: '',
      category: '',
      sparesAndLabour: '',
      qty: '',
      rate: '',
      discount: '',
      amount: '',
      action: 'ADD'
    }));
    updateData((prevRows) => [...(prevRows ?? []), ...newRows]);
  };

  // Handle row deletion by marking action as DELETE
  // const handleRowDelete = (rowIndex) => {
  //   const newRows = [...data];

  //   // If the spare is newly added, just remove the row
  //   if (newRows[rowIndex].action === 'ADD') {
  //     newRows.splice(rowIndex, 1);
  //   } else {
  //     // Otherwise, mark the action as DELETE
  //     newRows[rowIndex].action = 'DELETE';
  //   }

  //   updateData(newRows);
  // };

  const handleRowDelete = (sparesId) => {
    const newRows = [...data];

    // Find the row based on sparesId
    const rowIndex = newRows.findIndex((row) => row.sparesId === sparesId);

    // If the row was newly added (action === 'ADD'), remove it entirely
    if (newRows[rowIndex].action === 'ADD') {
      newRows.splice(rowIndex, 1); // Remove the row from the array
    } else {
      // Otherwise, mark the row as deleted
      newRows[rowIndex].action = 'DELETE';
    }

    updateData(newRows); // Update the state
  };

  const handleCategoryTypeChange = (value) => {
    let myArray = [value];
    const sparesFilter = {
      categoryList: myArray
    };
    fetchOptions(sparesFilter);
  };

  return (
    <>
      <MainCard title="Job Spares Information">
        {/* <Grid container direction="row" spacing={gridSpacing}>
          <Grid item xs={12}> */}
        <div style={{ overflowX: 'auto' }}>
          <TableContainer>
            <Table style={{ minWidth: isMobile ? '600px' : '1000px' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '20%' }}>Category</TableCell>
                  <TableCell sx={{ width: '30%' }}>Spares</TableCell>
                  <TableCell sx={{ width: '10%' }}>Qty</TableCell>
                  <TableCell sx={{ width: '10%' }}>Rate</TableCell>
                  <TableCell sx={{ width: '10%' }}>Discount</TableCell>
                  <TableCell sx={{ width: '10%' }}>Amount</TableCell>
                  <TableCell sx={{ width: '10%' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  .filter((row) => row.action !== 'DELETE') // Hide rows marked for deletion
                  .map((row) => (
                    <TableRow key={row.sparesId || row.tempId}>
                      <TableCell sx={{ width: '20%' }}>
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
                              handleInputChange(row.sparesId, 'category', e.target.value);
                            }}
                          >
                            {sparesCategoryList.map((option) => (
                              <MenuItem key={option.id} value={option.category}>
                                {option.category}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell sx={{ width: '30%' }}>
                        <Autocomplete
                          options={options.filter((option) => !data.some((row) => row.sparesId === option.id))} // Filter out already added spares
                          getOptionLabel={(option) => option.desc}
                          style={{ width: 300 }}
                          //inputValue={row?.sparesAndLabour || ''}
                          //onInputChange={handleInputChangeFilter}
                          //value={row || ''}
                          value={allSpares.find((option) => option.desc === row.sparesAndLabour) || null}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          onChange={(event, newValue) => {
                            //console.log('new value is ' + JSON.stringify(newValue));
                            //setChoosenSpares(newValue);
                            handleInputChange(row.sparesId, 'sparesAndLabour', newValue.desc);
                            handleInputChange(row.sparesId, 'rate', newValue.sellRate);
                            handleInputChange(row.sparesId, 'amount', newValue.sellRate * row?.qty - row?.discount || 0);
                            handleInputChange(row.sparesId, 'sparesId', newValue.id);
                          }}
                          renderInput={(params) => <TextField {...params} label="Search Spares" disabled={!!row.sparesId} />}
                        />
                      </TableCell>
                      <TableCell sx={{ width: '10%' }}>
                        <TextField
                          fullWidth
                          value={row?.qty || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            handleInputChange(row.sparesId, 'qty', val);
                            handleInputChange(row.sparesId, 'amount', val * row?.rate - row?.discount || 0);
                          }}
                          onBlur={(e) => {
                            const val = e.target.value;
                            if (Number(val) <= 0) {
                              alert('Quantity cannot be 0. Please delete the row if you want to remove the spare.');
                              handleInputChange(row.sparesId, 'qty', ''); // Reset the value if needed
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ width: '10%' }}>
                        <TextField
                          fullWidth
                          disabled
                          value={row?.rate || ''}
                          onChange={(e) => handleInputChange(row.sparesId, 'rate', e.target.value)}
                        />
                      </TableCell>
                      {isAuthorizedForDiscount && (
                        <TableCell sx={{ width: '10%' }}>
                          <TextField
                            fullWidth
                            value={row?.discount || ''}
                            onChange={(e) => {
                              const val = Number(e.target.value) || 0;
                              handleInputChange(row.sparesId, 'discount', val);
                              handleInputChange(row.sparesId, 'amount', Number(row?.rate * row?.qty) - val || 0);
                            }}
                          />
                        </TableCell>
                      )}
                      <TableCell sx={{ width: '10%' }}>
                        <TextField
                          fullWidth
                          value={row?.amount || ''}
                          disabled
                          onChange={(e) => handleInputChange(row.sparesId, 'amount', e.target.value)}
                        />
                      </TableCell>
                      <TableCell sx={{ width: '10%' }}>
                        <Button variant="contained" color="error" onClick={() => handleRowDelete(row.sparesId)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <Grid item xs={12}>
          <br></br>
          <Button variant="contained" color="secondary" onClick={addAdditionalRows}>
            Add Row
          </Button>
        </Grid>
        {/* </Grid>
        </Grid> */}
      </MainCard>
    </>
  );
};

JobSparesUpdate.propTypes = {
  data: PropTypes.array.isRequired,
  updateData: PropTypes.func.isRequired
};
export default JobSparesUpdate;
