import PropTypes from 'prop-types';

const Alert = ({ message, onClose }) => (
  <div style={{ border: '1px solid red', padding: '10px' }}>
    {message}
    <button onClick={onClose}>Close</button>
  </div>
);
Alert.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};
export default Alert;
