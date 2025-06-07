import React, { useState, useEffect } from 'react';
//import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';
import { getRequest, postRequest } from 'utils/fetchRequest';
import { Button, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, Box, Paper, TableContainer } from '@mui/material';
import AlertDialog from 'views/utilities/AlertDialog';
const MarkAttendance = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [absentReason, setAbsentReason] = useState({});
  const [attendanceData, setAttendanceData] = useState([]);

  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');

  useEffect(() => {
    fetchAllEmployeeListData();
    fetchAttendanceData();
  }, []);

  const fetchAllEmployeeListData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/employee');
      setEmployeeList(data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const fetchAttendanceData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/employee/attendance/today');
      setAttendanceData(data);
    } catch (err) {
      console.error('Error fetching attendance data:', err);
    }
  };

  const markAttendance = async (id, status, reason = null) => {
    try {
      await postRequest(process.env.REACT_APP_API_URL + '/employee/attendance', {
        employeeId: id,
        status,
        reason
      });
      // setAlertMess(`Attendance marked: ${status}`);
      // setAlertColor('success');
      // setShowAlert(true);
      fetchAttendanceData();
    } catch (err) {
      console.error('Error marking attendance:', err);
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
      fetchAttendanceData();
    }
  };

  const isAttendanceMarked = (employeeId) => {
    return attendanceData.some((record) => record.employeeId === employeeId);
  };

  return (
    <>
      <MainCard title="Mark Attendance">
        <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Staff Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employeeList
                .filter((employee) => employee.status === 'ACTIVE')
                .map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{employee.name}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 1,
                          alignItems: 'center'
                        }}
                      >
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => markAttendance(employee.id, 'IN')}
                          disabled={isAttendanceMarked(employee.id)}
                        >
                          IN
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => markAttendance(employee.id, 'OUT')}
                          disabled={isAttendanceMarked(employee.id)}
                        >
                          OUT
                        </Button>
                        <Select
                          size="small"
                          value={absentReason[employee.id] || ''}
                          onChange={(e) => setAbsentReason({ ...absentReason, [employee.id]: e.target.value })}
                          displayEmpty
                          disabled={isAttendanceMarked(employee.id)}
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
                          disabled={!absentReason[employee.id] || isAttendanceMarked(employee.id)}
                        >
                          Absent
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>

      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}
    </>
  );
};

export default MarkAttendance;
