import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
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
  FormControl,
  Box
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { getRequest, postRequest } from 'utils/fetchRequest';

const JobSparesUpdate = ({ data, updateData }) => {
  const [sparesCategoryList, setSparesCategoryList] = React.useState([]);
  const [options, setOptions] = React.useState([]);
  const [allSpares, setAllSpares] = React.useState([]);
  const discountRole = ['ADMIN'];
  const roles = JSON.parse(localStorage.getItem('roles')) || [];
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
    const rowIndex = newRows.findIndex((row) => row.sparesId === sparesId);
    newRows[rowIndex][column] = value;
    if (newRows[rowIndex].action !== 'ADD') newRows[rowIndex].action = 'MODIFY';
    updateData(newRows);
  };

  const handleRowDelete = (sparesId) => {
    const newRows = [...data];
    const rowIndex = newRows.findIndex((row) => row.sparesId === sparesId);
    if (newRows[rowIndex].action === 'ADD') {
      newRows.splice(rowIndex, 1);
    } else {
      newRows[rowIndex].action = 'DELETE';
    }
    updateData(newRows);
  };

  const handleCategoryTypeChange = (value) => {
    const sparesFilter = { categoryList: [value] };
    fetchOptions(sparesFilter);
  };

  const addAdditionalRows = () => {
    const newRow = {
      sparesId: '',
      category: '',
      sparesAndLabour: '',
      qty: '',
      rate: '',
      discount: '',
      amount: '',
      action: 'ADD'
    };
    updateData((prevRows) => [...(prevRows ?? []), newRow]);
  };

  return (
    <MainCard title="Job Spares Information">
      <Box sx={{ overflowX: 'auto', minWidth: '100%' }}>
        <TableContainer>
          <Table sx={{ minWidth: 1000, tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                {['Category', 'Spares', 'Qty', 'Rate', 'Discount', 'Amount', 'Action'].map((label) => {
                  if (label === 'Discount' && !isAuthorizedForDiscount) return null;
                  return (
                    <TableCell
                      key={label}
                      sx={{
                        width: {
                          xs: label === 'Spares' ? 180 : 120,
                          sm: label === 'Spares' ? 200 : 140,
                          md: label === 'Spares' ? '30%' : '10%'
                        },
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {label}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .filter((row) => row.action !== 'DELETE')
                .map((row) => (
                  <TableRow key={row.sparesId || row.tempId}>
                    {/* Category */}
                    <TableCell>
                      <FormControl variant="standard" fullWidth>
                        <InputLabel />
                        <Select
                          value={row?.category || ''}
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

                    {/* Spares */}
                    <TableCell>
                      <Autocomplete
                        options={options.filter((option) => !data.some((r) => r.sparesId === option.id))}
                        getOptionLabel={(option) => option.desc}
                        value={allSpares.find((option) => option.desc === row.sparesAndLabour) || null}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onChange={(event, newValue) => {
                          if (!newValue) return;
                          handleInputChange(row.sparesId, 'sparesAndLabour', newValue.desc);
                          handleInputChange(row.sparesId, 'rate', newValue.sellRate);
                          handleInputChange(row.sparesId, 'amount', newValue.sellRate * row?.qty - row?.discount || 0);
                          handleInputChange(row.sparesId, 'sparesId', newValue.id);
                        }}
                        sx={{ width: '100%' }}
                        renderInput={(params) => <TextField {...params} label="Search Spares" disabled={!!row.sparesId} />}
                      />
                    </TableCell>

                    {/* Qty */}
                    <TableCell>
                      <TextField
                        fullWidth
                        value={row?.qty || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleInputChange(row.sparesId, 'qty', val);
                          handleInputChange(row.sparesId, 'amount', val * row?.rate - row?.discount || 0);
                        }}
                        onBlur={(e) => {
                          if (Number(e.target.value) <= 0) {
                            alert('Quantity cannot be 0. Please delete the row if you want to remove the spare.');
                            handleInputChange(row.sparesId, 'qty', '');
                          }
                        }}
                      />
                    </TableCell>

                    {/* Rate */}
                    <TableCell>
                      <TextField fullWidth value={row?.rate || ''} disabled />
                    </TableCell>

                    {/* Discount */}
                    {isAuthorizedForDiscount && (
                      <TableCell>
                        <TextField
                          fullWidth
                          value={row?.discount || ''}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            handleInputChange(row.sparesId, 'discount', val);
                            handleInputChange(row.sparesId, 'amount', row?.rate * row?.qty - val || 0);
                          }}
                        />
                      </TableCell>
                    )}

                    {/* Amount */}
                    <TableCell>
                      <TextField fullWidth value={row?.amount || ''} disabled />
                    </TableCell>

                    {/* Action */}
                    <TableCell>
                      <Button variant="contained" color="error" onClick={() => handleRowDelete(row.sparesId)} fullWidth>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Grid item xs={12} sx={{ mt: 2 }}>
        <Button variant="contained" color="secondary" onClick={addAdditionalRows}>
          Add Row
        </Button>
      </Grid>
    </MainCard>
  );
};

JobSparesUpdate.propTypes = {
  data: PropTypes.array.isRequired,
  updateData: PropTypes.func.isRequired
};

export default JobSparesUpdate;
