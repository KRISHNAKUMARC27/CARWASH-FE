import React, { useState, useEffect } from 'react';
//import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';
//import { gridSpacing } from 'store/constant';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { getRequest, postRequest } from 'utils/fetchRequest';
import { Button, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const MarkAttendance = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [absentReason, setAbsentReason] = useState({});
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');

  useEffect(() => {
    fetchAllEmployeeListData();
  }, []);

  const fetchAllEmployeeListData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/employee');
      setEmployeeList(data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const markAttendance = async (id, status, reason = null) => {
    try {
      await postRequest(process.env.REACT_APP_API_URL + '/employee/attendance', {
        employeeId: id,
        status,
        reason
      });
      setAlertMess(`Attendance marked: ${status}`);
      setAlertColor('success');
      setShowAlert(true);
    } catch (err) {
      console.error('Error marking attendance:', err);
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
    }
  };

  return (
    <>
      <MainCard title="Enter Employee Details">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Staff Name</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employeeList.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>
                  <Button variant="contained" color="success" onClick={() => markAttendance(employee.id, 'IN')}>
                    IN
                  </Button>
                  <Button variant="contained" color="primary" onClick={() => markAttendance(employee.id, 'OUT')}>
                    OUT
                  </Button>
                  <Select
                    value={absentReason[employee.id] || ''}
                    onChange={(e) => setAbsentReason({ ...absentReason, [employee.id]: e.target.value })}
                    displayEmpty
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="SICK">SICK</MenuItem>
                    <MenuItem value="CASUAL">CASUAL</MenuItem>
                    <MenuItem value="EARNED">EARNED</MenuItem>
                    <MenuItem value="UNPAID">UNPAID</MenuItem>
                  </Select>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => markAttendance(employee.id, 'ABSENT', absentReason[employee.id])}
                    disabled={!absentReason[employee.id]}
                  >
                    Absent
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </MainCard>
      {showAlert && (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert variant="filled" severity={alertColor} onClose={() => setShowAlert(false)}>
            {alertMess}
          </Alert>
        </Stack>
      )}
    </>
  );
};

export default MarkAttendance;
