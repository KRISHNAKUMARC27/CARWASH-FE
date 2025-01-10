import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const roles = JSON.parse(localStorage.getItem('roles')); // Parse roles from localStorage
  const navigate = useNavigate();

  // If no token, redirect to login
  if (!token) {
    navigate('/pages/login/login3', { replace: true });
    return null;
  }

  // If allowedRoles are defined, check user roles
  if (allowedRoles && (!roles || !roles.some((role) => allowedRoles.includes(role)))) {
    // Redirect based on user roles
    if (roles?.includes('JOBCARD')) {
      navigate('/card/table', { replace: true });
    } else if (roles?.includes('SPARES')) {
      navigate('/spares/table', { replace: true });
    } else {
      navigate('/card/table', { replace: true }); // Default fallback
    }
    return null;
  }

  // If token is valid and roles match, render the children
  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.any,
  allowedRoles: PropTypes.array
};
export default PrivateRoute;
