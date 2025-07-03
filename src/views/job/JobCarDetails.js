import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Grid, TextField, Button, Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MainCard from 'ui-component/cards/MainCard';
import JSZip from 'jszip';
import { getRequest } from 'utils/fetchRequest';

const JobCarDetails = ({ data, updateData, photos, updatePhotos, zipFile }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState(null);
  const [loadPhotos, setLoadPhotos] = useState(false);
  useEffect(() => {
    const unzipPhotos = async () => {
      if (zipFile) {
        const jszip = new JSZip();
        const zip = await jszip.loadAsync(zipFile);
        const files = [];
        zip.forEach(async (relativePath, file) => {
          const fileBlob = await file.async('blob');
          files.push(new File([fileBlob], relativePath, { type: 'image/jpeg' }));
        });
        updatePhotos(files); // Initialize photos with unzipped files
        console.log('unzipping files in useeffect');
      }
    };

    if (zipFile) {
      unzipPhotos();
    }
  }, [zipFile, updatePhotos]);

  useEffect(() => {
    return () => {
      if (stream && stream.active) {
        stream.getTracks().forEach((track) => {
          if (track.readyState === 'live') {
            track.stop();
          }
        });
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      setStream(mediaStream);
      setIsCapturing(true);
    } catch (error) {
      console.error('Error accessing the camera:', error);
      alert('Unable to access the camera. Make sure you are using a supported browser and have given permission.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  const capturePhoto = async () => {
    if (!stream) {
      return;
    }
    const videoElement = document.querySelector('#camera-preview');
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Convert canvas to Blob and store in state
    const photoBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));

    updatePhotos((prevPhotos) => [
      ...prevPhotos,
      new File([photoBlob], `photo_${prevPhotos.length + 1}.jpg`, {
        type: 'image/jpeg'
      })
    ]);
  };

  const savePhotos = () => {
    if (photos.length === 0) {
      alert('No photos to save.');
      return;
    }

    photos.forEach((photo, index) => {
      console.log(index);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(photo);
      link.download = photo.name;
      link.click();
      URL.revokeObjectURL(link.href);
    });

    alert(`${photos.length} photo(s) saved locally.`);
  };

  const deletePhoto = (index) => {
    updatePhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  const sendViaWhatsApp = async () => {
    try {
      // Fetch the photo URL from the API
      const resp = await getRequest(process.env.REACT_APP_API_URL + '/jobCard/getPhotoUrl/' + data.id);

      // Validate the response
      if (!resp || !resp.url) {
        alert('Failed to retrieve the photo URL. Please try again later.');
        return;
      }

      // Trim and validate inputs
      const ownerPhoneNumber = data.ownerPhoneNumber?.trim();
      const vehicleRegNo = data.vehicleRegNo?.trim();

      if (!ownerPhoneNumber) {
        alert('Please fill in the Owner Phone number.');
        return;
      }
      if (!vehicleRegNo) {
        alert('Please fill in the Vehicle Registration Number.');
        return;
      }

      // Prepare the message
      const fullMessage = `*Greetings from CarSquare!* 👋

      Your car *${vehicleRegNo}* images are ready.
      
      📸 Please tap the link below to download them:
      ${resp.url}
      
      Thank you for choosing CarSquare! 🚗`;

      const url = `https://api.whatsapp.com/send?phone=91${ownerPhoneNumber}&text=${encodeURIComponent(fullMessage)}`;

      // Redirect to WhatsApp
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error sending WhatsApp message:', err.message);
      alert('An error occurred while trying to send the message. Please try again later.');
    }
  };

  const handleVehicleRegNoChange = (event) => {
    const updatedData = { ...data, vehicleRegNo: event.target.value.toUpperCase() };
    updateData(updatedData);
  };
  const handleVehicleNameChange = (event) => {
    const updatedData = { ...data, vehicleName: event.target.value };
    updateData(updatedData);
  };
  const handleKMsChange = (event) => {
    const updatedData = { ...data, kiloMeters: event.target.value };
    updateData(updatedData);
  };

  return (
    <MainCard title="Job Card Vehicle Details">
      <Grid container spacing={2}>
        {/* Vehicle Info */}
        {!isCapturing && (
          <>
            <Grid item xs={12} md={4}>
              <TextField
                label="Vehicle Reg. No."
                required
                fullWidth
                variant="outlined"
                value={data.vehicleRegNo || ''}
                onChange={handleVehicleRegNoChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Vehicle Name"
                required
                fullWidth
                variant="outlined"
                value={data.vehicleName || ''}
                onChange={handleVehicleNameChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Vehicle K.Ms" fullWidth variant="outlined" value={data.kiloMeters || ''} onChange={handleKMsChange} />
            </Grid>
          </>
        )}
        {/* Photo Section */}
        <Grid item xs={12}>
          <Typography variant="h6">Take Photos</Typography>
        </Grid>

        <Grid item xs={12}>
          {!isCapturing ? (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button fullWidth variant="contained" color="primary" onClick={startCamera}>
                  Start Camera
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setLoadPhotos(true);
                    console.log(loadPhotos);
                  }}
                >
                  Load Photos
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  // paddingTop: '56.25%', // 16:9 aspect ratio
                  height: { xs: '60vh', sm: '70vh', md: '75vh' },
                  border: '2px solid #ccc',
                  borderRadius: 2,
                  overflow: 'hidden',
                  backgroundColor: '#000'
                }}
              >
                <video
                  id="camera-preview"
                  autoPlay
                  playsInline
                  ref={(video) => {
                    if (video && stream) video.srcObject = stream;
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>

              <Box sx={{ mt: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
                <Button variant="contained" color="secondary" onClick={capturePhoto}>
                  Capture Photo
                </Button>
                <Button variant="outlined" onClick={stopCamera}>
                  Stop Camera
                </Button>
              </Box>
            </Box>
          )}
        </Grid>

        {/* Captured Photos */}
        {photos.length > 0 && (
          <Grid item xs={12}>
            <Box>
              <Typography variant="body1">{photos.length} photo(s) captured.</Typography>
              <Grid container spacing={2}>
                {photos.map((photo, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index} sx={{ textAlign: 'center' }}>
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Captured ${index + 1}`}
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '200px',
                        objectFit: 'contain',
                        border: '1px solid #ccc',
                        marginBottom: '10px'
                      }}
                    />
                    <IconButton color="error" onClick={() => deletePhoto(index)} aria-label="delete photo">
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        )}

        {/* Photo Actions */}
        <Grid item xs={12} sm={6}>
          <Button fullWidth variant="contained" color="primary" onClick={savePhotos} disabled={photos.length === 0}>
            Save Photos Locally
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button fullWidth variant="contained" color="secondary" onClick={sendViaWhatsApp} disabled={photos.length === 0}>
            Send via WhatsApp
          </Button>
        </Grid>
      </Grid>
    </MainCard>
  );
};

JobCarDetails.propTypes = {
  data: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  photos: PropTypes.array,
  updatePhotos: PropTypes.func,
  zipFile: PropTypes.object
};
export default JobCarDetails;
