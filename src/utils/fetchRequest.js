//import { useNavigate } from 'react-router-dom';

// Helper to redirect to the login page
const redirectToLogin = () => {
  localStorage.removeItem('token'); // Clear expired token
  localStorage.removeItem('roles'); // Clear roles if necessary
  localStorage.removeItem('username'); // Clear username if necessary
  window.location.href = '/pages/login/login3'; // Navigate to login page
};

const fetchRequest = async (url, method, payload = null) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage
  const headers = {
    'Content-type': 'application/json; charset=UTF-8',
    ...(token && { Authorization: `Bearer ${token}` }) // Add Bearer token if available
  };
  const body = payload ? JSON.stringify(payload) : null;

  const response = await fetch(url, { method, body, headers });

  // Check for 403 and redirect to login
  if (response.status === 403) {
    redirectToLogin();
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  return response.json();
};

const fetchRequestNotStringify = async (url, method, payload = null) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage
  const headers = {
    'Content-type': 'application/json; charset=UTF-8',
    ...(token && { Authorization: `Bearer ${token}` }) // Add Bearer token if available
  };
  const body = payload ? payload : null;

  const response = await fetch(url, { method, body, headers });

  // Check for 403 and redirect to login
  if (response.status === 403) {
    redirectToLogin();
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  return response.json();
};

const fetchBlobRequest = async (url, method, payload = null) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage
  const headers = {
    'Content-type': 'application/json; charset=UTF-8',
    ...(token && { Authorization: `Bearer ${token}` }) // Add Bearer token if available
  };
  const body = payload ? JSON.stringify(payload) : null;

  const response = await fetch(url, { method, body, headers });

  // Check for 403 and redirect to login
  if (response.status === 403) {
    redirectToLogin();
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  return response.blob();
};

// Exported functions for API requests
export const postRequest = (url, payload) => fetchRequest(url, 'POST', payload);
export const postRequestNotStringify = (url, payload) => fetchRequestNotStringify(url, 'POST', payload);
export const putRequest = (url, payload) => fetchRequest(url, 'PUT', payload);
export const putRequestNotStringify = (url, payload) => fetchRequestNotStringify(url, 'PUT', payload);
export const getRequest = (url) => fetchRequest(url, 'GET');
export const deleteRequest = (url) => fetchRequest(url, 'DELETE');
export const getBlobRequest = (url) => fetchBlobRequest(url, 'GET');
