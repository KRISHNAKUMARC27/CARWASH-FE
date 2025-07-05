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

const JobServiceUpdate = ({ data, updateData, firstInputRef }) => {
  const discountRole = ['ADMIN'];
  const roles = JSON.parse(localStorage.getItem('roles')) || [];
  const isAuthorizedForDiscount = roles.some((role) => discountRole.includes(role));

  const [serviceCategoryList, setServiceCategoryList] = React.useState([]);
  const [options, setOptions] = React.useState([]);
  const [allService, setAllService] = React.useState([]);

  React.useEffect(() => {
    fetchAllServiceCategoryListData();
    fetchAllServiceData();
    return () => {
      setServiceCategoryList([]);
      setOptions([]);
      setAllService([]);
    };
  }, []);

  const fetchAllServiceCategoryListData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/service/serviceCategory');
      setServiceCategoryList(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchAllServiceData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/service');
      setAllService(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchOptions = async (value) => {
    try {
      const data = await postRequest(process.env.REACT_APP_API_URL + '/service/findServiceInventoryWithFilter', value);
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
    const newRows = [
      {
        sparesId: '',
        category: '',
        sparesAndLabour: '',
        qty: '',
        rate: '',
        discount: '',
        amount: ''
      }
    ];
    updateData((prevRows) => [...(prevRows ?? []), ...newRows]);
  };

  const handleRowDelete = (rowIndex) => {
    const newRows = [...data];
    newRows.splice(rowIndex, 1);
    updateData(newRows.length > 0 ? newRows : null);
  };

  const handleCategoryTypeChange = (value) => {
    const serviceFilter = { categoryList: [value] };
    fetchOptions(serviceFilter);
  };

  return (
    <MainCard title="Job Service Information">
      <Box sx={{ overflowX: 'auto', minWidth: '100%' }}>
        <TableContainer>
          <Table sx={{ minWidth: 1000, tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                {['Category', 'Service', 'Quantity', 'Rate', 'Discount', 'Amount', 'Action'].map((label) => {
                  if (label === 'Discount' && !isAuthorizedForDiscount) return null;
                  return (
                    <TableCell
                      key={label}
                      sx={{
                        width: {
                          xs: label === 'Service' ? 180 : 120,
                          sm: label === 'Service' ? 200 : 140,
                          md: label === 'Service' ? '30%' : '10%'
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
              {data?.map((row, index) => (
                <TableRow key={index}>
                  {/* Category */}
                  <TableCell sx={{ width: { xs: 140, sm: 140, md: '20%' } }}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel />
                      <Select
                        value={row?.category || ''}
                        onChange={(e) => {
                          handleCategoryTypeChange(e.target.value);
                          handleInputChange(index, 'category', e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            document.querySelector(`#spares-input-${index}`)?.focus();
                          }
                        }}
                      >
                        {serviceCategoryList.map((option) => (
                          <MenuItem key={option.id} value={option.category}>
                            {option.category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>

                  {/* Service */}
                  <TableCell sx={{ width: { xs: 180, sm: 200, md: '30%' } }}>
                    <Autocomplete
                      options={options.filter((option) => !data.some((r) => r.sparesId === option.id))}
                      getOptionLabel={(option) => option.desc}
                      value={allService.find((option) => option.desc === row.sparesAndLabour) || null}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      onChange={(event, newValue) => {
                        if (!newValue) return;
                        handleInputChange(index, 'sparesAndLabour', newValue.desc);
                        handleInputChange(index, 'rate', newValue.amount);
                        handleInputChange(index, 'amount', newValue.amount * row?.qty - row?.discount || 0);
                        handleInputChange(index, 'sparesId', newValue.id);
                      }}
                      sx={{ width: '100%' }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          id={`spares-input-${index}`}
                          label="Search Service"
                          disabled={!!row.sparesId}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              document.querySelector(`#qty-input-${index}`)?.focus();
                            }
                          }}
                        />
                      )}
                    />
                  </TableCell>

                  {/* Quantity */}
                  <TableCell>
                    <TextField
                      fullWidth
                      id={`qty-input-${index}`}
                      value={row?.qty || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleInputChange(index, 'qty', val);
                        handleInputChange(index, 'amount', val * row?.rate - row?.discount || 0);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (isAuthorizedForDiscount) {
                            document.querySelector(`#discount-input-${index}`)?.focus();
                          } else {
                            firstInputRef?.current?.focus();
                          }
                        }
                      }}
                      sx={{ maxWidth: '100%' }}
                    />
                  </TableCell>

                  {/* Rate */}
                  <TableCell>
                    <TextField fullWidth value={row?.rate || ''} disabled sx={{ maxWidth: '100%' }} />
                  </TableCell>

                  {/* Discount */}
                  {isAuthorizedForDiscount && (
                    <TableCell>
                      <TextField
                        fullWidth
                        id={`discount-input-${index}`}
                        value={row?.discount || ''}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 0;
                          handleInputChange(index, 'discount', val);
                          handleInputChange(index, 'amount', row?.rate * row?.qty - val || 0);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            firstInputRef?.current?.focus();
                          }
                        }}
                        sx={{ maxWidth: '100%' }}
                      />
                    </TableCell>
                  )}

                  {/* Amount */}
                  <TableCell>
                    <TextField fullWidth value={row?.amount || ''} disabled sx={{ maxWidth: '100%' }} />
                  </TableCell>

                  {/* Action */}
                  <TableCell>
                    <Button variant="contained" color="error" onClick={() => handleRowDelete(index)} fullWidth>
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
        <Button variant="contained" color="secondary" onClick={addAdditionalRows} ref={firstInputRef}>
          Add Row
        </Button>
      </Grid>
    </MainCard>
  );
};

JobServiceUpdate.propTypes = {
  data: PropTypes.array.isRequired,
  updateData: PropTypes.func.isRequired,
  firstInputRef: PropTypes.any
};

export default JobServiceUpdate;
