import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { getRequest, postRequest, postRequestMultiPart, getRequestMultiPart } from 'utils/fetchRequest';
import {
  Button,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Paper,
  TableContainer,
  Typography,
  IconButton
} from '@mui/material';
import AlertDialog from 'views/utilities/AlertDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import JSZip from 'jszip';

const MarkAttendance = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [absentReason, setAbsentReason] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMess, setAlertMess] = useState('');
  const [alertColor, setAlertColor] = useState('');

  // Camera/Photo-related state
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [currentEmployeeAction, setCurrentEmployeeAction] = useState(null); // { id, status }

  useEffect(() => {
    fetchAllEmployeeListData();
    fetchAttendanceData();
  }, []);

  useEffect(() => {
    return () => {
      if (stream && stream.active) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

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

  const startCamera = async (employeeId, status) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setIsCapturing(true);
      setCurrentEmployeeAction({ id: employeeId, status });

      // Step 1: Always clear existing photos initially
      let existingPhotos = [];

      // Step 2: If status is OUT, fetch previous photos (taken during IN)
      if (status === 'OUT') {
        const record = attendanceData.find((rec) => rec.employeeId === employeeId);
        const attendanceId = record?.id;

        if (attendanceId) {
          try {
            const zipBlob = await getRequestMultiPart(`${process.env.REACT_APP_API_URL}/employee/attendance/getPhotos/${attendanceId}`);

            const jszip = new JSZip();
            const zip = await jszip.loadAsync(zipBlob);

            const filePromises = Object.keys(zip.files).map(async (filename) => {
              const fileBlob = await zip.files[filename].async('blob');
              return new File([fileBlob], filename, { type: 'image/jpeg' });
            });

            existingPhotos = await Promise.all(filePromises);
          } catch (err) {
            console.warn('Failed to load existing IN photos:', err.message);
          }
        }
      }

      // Step 3: Set both old and new photos
      setPhotos(existingPhotos);
    } catch (err) {
      alert('Camera access failed.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
    setCurrentEmployeeAction(null);
  };

  const capturePhoto = async () => {
    const video = document.querySelector('#camera-preview');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Add timestamp
    const now = new Date().toLocaleString();
    ctx.font = `${Math.floor(canvas.height * 0.03)}px Arial`;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.strokeText(now, canvas.width - 10, canvas.height - 10);
    ctx.fillText(now, canvas.width - 10, canvas.height - 10);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));
    const file = new File([blob], `attendance_${photos.length + 1}.jpg`, { type: 'image/jpeg' });
    setPhotos((prev) => [...prev, file]);
  };

  const handleSaveAttendance = async () => {
    if (!currentEmployeeAction || photos.length === 0) {
      alert('No photos captured.');
      return;
    }

    try {
      const payload = {
        employeeId: currentEmployeeAction.id,
        status: currentEmployeeAction.status
      };
      const data = await postRequest(process.env.REACT_APP_API_URL + '/employee/attendance', payload);

      // ZIP photos and upload
      const zip = new JSZip();
      photos.forEach((photo) => {
        zip.file(photo.name, photo);
      });
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      const formData = new FormData();
      formData.append('file', new File([zipBlob], 'attendance_photos.zip', { type: 'application/zip' }));

      await postRequestMultiPart(`${process.env.REACT_APP_API_URL}/employee/attendance/uploadPhotos/${data.id}`, formData);

      setAlertMess(`Attendance marked and photos uploaded for ${currentEmployeeAction.status}`);
      setAlertColor('success');
      setShowAlert(true);
    } catch (err) {
      console.error('Attendance or photo upload failed:', err);
      setAlertMess(err.message);
      setAlertColor('error');
      setShowAlert(true);
    } finally {
      stopCamera();
      fetchAttendanceData();
    }
  };

  const getAttendanceRecord = (employeeId) => attendanceData.find((rec) => rec.employeeId === employeeId);

  const deletePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <MainCard title="Mark Attendance">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Staff Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employeeList
                .filter((emp) => emp.status === 'ACTIVE')
                .map((employee) => {
                  const record = getAttendanceRecord(employee.id);
                  const isCheckedIn = !!record?.checkInTime;
                  const isCheckedOut = !!record?.checkOutTime;
                  const isAbsent = record?.present === false || record?.onLeave === true;

                  return (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => startCamera(employee.id, 'IN')}
                            disabled={isCheckedIn || isAbsent || isCapturing}
                          >
                            IN
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => startCamera(employee.id, 'OUT')}
                            disabled={isCheckedOut || isAbsent || isCapturing}
                          >
                            OUT
                          </Button>
                          <Select
                            size="small"
                            value={absentReason[employee.id] || ''}
                            onChange={(e) => setAbsentReason({ ...absentReason, [employee.id]: e.target.value })}
                            displayEmpty
                            disabled={!!record}
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
                            onClick={() =>
                              postRequest(process.env.REACT_APP_API_URL + '/employee/attendance', {
                                employeeId: employee.id,
                                status: 'ABSENT',
                                reason: absentReason[employee.id]
                              })
                            }
                            disabled={!absentReason[employee.id] || !!record}
                          >
                            Absent
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        {isCapturing && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Capture Attendance Photo</Typography>

            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: '60vh', sm: '70vh', md: '75vh' },
                border: '2px solid #ccc',
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: '#000',
                mt: 2
              }}
            >
              <video
                id="camera-preview"
                autoPlay
                playsInline
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                ref={(video) => {
                  if (video && stream) video.srcObject = stream;
                }}
              />
            </Box>

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={capturePhoto}>
                Capture
              </Button>
              <Button variant="outlined" onClick={stopCamera}>
                Cancel
              </Button>
              <Button variant="contained" color="secondary" onClick={handleSaveAttendance} disabled={photos.length === 0}>
                Save Attendance
              </Button>
            </Box>

            {photos.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">{photos.length} photo(s) captured.</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {photos.map((photo, idx) => (
                    <Box key={idx} sx={{ position: 'relative' }}>
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Attendance ${idx + 1}`}
                        style={{ width: 120, height: 90, objectFit: 'cover', border: '1px solid #ccc' }}
                      />
                      <IconButton size="small" onClick={() => deletePhoto(idx)} sx={{ position: 'absolute', top: 0, right: 0 }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </MainCard>

      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}
    </>
  );
};

export default MarkAttendance;
