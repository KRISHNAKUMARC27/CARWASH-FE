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
import MainCard from 'ui-component/cards/MainCard';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
//import { gridSpacing } from 'store/constant';
import { getRequest, postRequest } from 'utils/fetchRequest';

const JobServiceUpdate = ({ data, updateData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check for small screens
  const discountRole = ['ADMIN'];

  // Get logged-in user's roles
  const roles = JSON.parse(localStorage.getItem('roles')) || [];

  // Check if user is authorized to see the "DISCOUNT" column
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
    const newRows = [...Array(1)].map(() => ({
      sparesId: '',
      category: '',
      sparesAndLabour: '',
      qty: '',
      rate: '',
      discount: '',
      amount: ''
    }));
    updateData((prevRows) => [...prevRows, ...newRows]);
  };

  const handleRowDelete = (rowIndex) => {
    const newRows = [...data];
    newRows.splice(rowIndex, 1);
    if (newRows.length > 0) {
      updateData(newRows);
    } else {
      updateData(
        [...Array(1)].map(() => ({ sparesId: '', category: '', sparesAndLabour: '', qty: '', rate: '', discount: '', amount: '' }))
      );
    }
  };

  const handleCategoryTypeChange = (value) => {
    let myArray = [value];
    const serviceFilter = {
      categoryList: myArray
    };
    fetchOptions(serviceFilter);
  };

  return (
    <>
      <MainCard title="Job Service Information">
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
                  {isAuthorizedForDiscount && <TableCell sx={{ width: '10%' }}>Discount</TableCell>}
                  <TableCell sx={{ width: '10%' }}>Amount</TableCell>
                  <TableCell sx={{ width: '10%' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index}>
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
                            handleInputChange(index, 'category', e.target.value);
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
                    <TableCell sx={{ width: '30%' }}>
                      <Autocomplete
                        options={options.filter((option) => !data.some((row) => row.sparesId === option.id))} // Filter out already added spares
                        getOptionLabel={(option) => option.desc}
                        style={{ width: 300 }}
                        value={allService.find((option) => option.desc === row.sparesAndLabour) || null}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onChange={(event, newValue) => {
                          console.log('new value is ' + JSON.stringify(newValue));
                          console.log('row is ' + JSON.stringify(row));
                          //setChoosenService(newValue);
                          handleInputChange(index, 'sparesAndLabour', newValue.desc);
                          handleInputChange(index, 'rate', newValue.amount);
                          handleInputChange(index, 'amount', newValue.amount * row?.qty - row?.discount || 0);
                          handleInputChange(index, 'sparesId', newValue.id);
                        }}
                        renderInput={(params) => <TextField {...params} label="Search Service" disabled={!!row.sparesId} />}
                      />
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>
                      <TextField
                        fullWidth
                        value={row?.qty || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleInputChange(index, 'qty', val);
                          handleInputChange(index, 'amount', val * row?.rate - row?.discount || 0);
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ width: '10%' }}>
                      <TextField
                        fullWidth
                        value={row?.rate || ''}
                        disabled
                        onChange={(e) => handleInputChange(index, 'rate', e.target.value)}
                      />
                    </TableCell>
                    {isAuthorizedForDiscount && (
                      <TableCell sx={{ width: '10%' }}>
                        <TextField
                          fullWidth
                          value={row?.discount || ''}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            handleInputChange(index, 'discount', val);
                            handleInputChange(index, 'amount', Number(row?.rate * row?.qty) - val || 0);
                          }}
                        />
                      </TableCell>
                    )}
                    <TableCell sx={{ width: '10%' }}>
                      <TextField
                        fullWidth
                        value={row?.amount || ''}
                        disabled
                        onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                      />
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>
                      <Button variant="contained" color="error" onClick={() => handleRowDelete(index)}>
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
          <Button variant="contained" color="error" onClick={addAdditionalRows}>
            Add Row
          </Button>
        </Grid>
        {/* </Grid>
        </Grid> */}
      </MainCard>
    </>
  );
};

JobServiceUpdate.propTypes = {
  data: PropTypes.array.isRequired,
  updateData: PropTypes.func.isRequired
};
export default JobServiceUpdate;
