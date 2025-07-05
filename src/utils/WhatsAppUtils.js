import { getRequest } from 'utils/fetchRequest';

export const sendJobPhotosViaWhatsApp = async (data) => {
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
