import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postRequest } from 'utils/fetchRequest';
import { Grid, TextField, Button } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

import { gridSpacing } from 'store/constant';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const payload = { username: username, password: password };
      const response = await postRequest(process.env.REACT_APP_API_URL + '/auth/login', payload);
      // console.log(JSON.stringify(response));
      const { token, username: responseUsername, roles } = response; // Updated to reflect new response structure

      // console.log(token);
      // console.log(responseUsername);
      // console.log(JSON.stringify(roles));
      // Store token, username, and roles in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('username', responseUsername);
      localStorage.setItem('roles', JSON.stringify(roles)); // Store roles as JSON string

      // Redirect based on roles
      if (roles.includes('JOBCARD')) {
        navigate('/card/table', { replace: true });
      } else if (roles.includes('SPARES')) {
        navigate('/spares/table', { replace: true });
      } else {
        navigate('/card/table', { replace: true }); // Default route
      }
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div>
      <MainCard>
        <Grid container direction="row" spacing={gridSpacing}>
          <Grid item xs={12}>
            <TextField
              label="Username"
              required
              fullWidth
              variant="outlined"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              required
              fullWidth
              variant="outlined"
              type="password"
              value={password || ''}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="error" onClick={handleLogin}>
              Login
            </Button>
          </Grid>
        </Grid>
        {/* <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /> */}
        {/* <button onClick={handleLogin}>Login</button> */}
      </MainCard>
    </div>
  );
};

export default LoginPage;
