import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Grid, TextField, Button, Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import JSZip from 'jszip';

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

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Rear camera
      });
      setStream(mediaStream);
      setIsCapturing(true);
    } catch (error) {
      console.error('Error accessing the camera:', error);
      alert('Unable to access the camera.');
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

  const sendViaWhatsApp = () => {
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
    const fullMessage = `Greetings from CarSquare. Please find attached your car ${vehicleRegNo} images`;
    const url = `https://api.whatsapp.com/send?phone=91${ownerPhoneNumber}&text=${encodeURIComponent(fullMessage)}`;

    // Redirect to WhatsApp
    window.open(url, '_blank');
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
    <>
      <MainCard title="Job Card Vehicle Details">
        <Grid container direction="row" spacing={gridSpacing}>
          <Grid item xs={4}>
            <TextField
              label="Vehicle Reg. No."
              required
              variant="outlined"
              value={data.vehicleRegNo || ''}
              onChange={handleVehicleRegNoChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField label="Vehicle Name" required variant="outlined" value={data.vehicleName || ''} onChange={handleVehicleNameChange} />
          </Grid>
          <Grid item xs={4}>
            <TextField label="Vehicle K.Ms" variant="outlined" value={data.kiloMeters || ''} onChange={handleKMsChange} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Take Photos</Typography>
          </Grid>

          <Grid item xs={12}>
            {!isCapturing ? (
              <Grid container direction="row" spacing={gridSpacing}>
                <Grid item xs={6}>
                  <Button variant="contained" color="primary" onClick={startCamera}>
                    Start Camera
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setLoadPhotos(true);
                      console.log(loadPhotos);
                    }}
                  >
                    Load photos
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <>
                <video
                  id="camera-preview"
                  autoPlay
                  playsInline
                  style={{
                    width: '100%',
                    height: 'auto',
                    border: '1px solid #ccc'
                  }}
                  ref={(video) => {
                    if (video && stream) video.srcObject = stream;
                  }}
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                />
                <Button variant="contained" color="secondary" onClick={capturePhoto} style={{ margin: '10px' }}>
                  Capture Photo
                </Button>
                <Button variant="outlined" onClick={stopCamera}>
                  Stop Camera
                </Button>
              </>
            )}
          </Grid>

          <Grid item xs={12}>
            {photos.length > 0 && (
              <Box>
                <Typography variant="body1">{photos.length} photo(s) captured.</Typography>
                <Grid container spacing={2}>
                  {photos.map((photo, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4} style={{ textAlign: 'center' }}>
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
            )}
          </Grid>

          <Grid item xs={6}>
            <Button variant="contained" color="primary" onClick={savePhotos} disabled={photos.length === 0}>
              Save Photos Locally
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" color="primary" onClick={sendViaWhatsApp} disabled={photos.length === 0}>
              Send via WhatsApp
            </Button>
          </Grid>
        </Grid>
      </MainCard>
    </>
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
