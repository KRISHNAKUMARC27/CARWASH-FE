import { useState, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Chip,
  ClickAwayListener,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Button,
  Autocomplete
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import User1 from 'assets/images/users/icons8-user-100.png';
import { gridSpacing } from 'store/constant';

// assets
import { IconLogout, IconSettings, IconReplace, IconUserCheck, IconUserPlus } from '@tabler/icons';
import { postRequest, getRequest } from 'utils/fetchRequest';
import MarkAttendance from 'views/attendance/MarkAttendance';
import AlertDialog from 'views/utilities/AlertDialog';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [changePassOpen, setChangePassOpen] = useState(false);
  const [markAttendanceOpen, setMarkAttendanceOpen] = useState(false);
  const [userCreateOpen, setUserCreateOpen] = useState(false);

  const username = localStorage.getItem('username');
  const [password, setPassword] = useState('');
  const [rolesList, setRolesList] = useState([]);
  const [userCreate, setUserCreate] = useState({});

  const roles = JSON.parse(localStorage.getItem('roles')) || [];
  const isAuthorizedForUserCreation = roles.some((role) => ['ADMIN'].includes(role));
  const isAuthorizedForAttendance = roles.some((role) => ['ADMIN', 'MANAGER'].includes(role));

  const [showAlert, setShowAlert] = useState(false);
  const [alertMess, setAlertMess] = useState('');
  const [alertColor, setAlertColor] = useState('');
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);
  const handleLogout = async () => {
    console.log('Logout');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    navigate('/pages/login/login3', { replace: true });
    return;
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handlePassChangeClose = () => {
    setChangePassOpen(false);
  };

  const handleMarkAttendanceClose = () => {
    setMarkAttendanceOpen(false);
  };

  const handleUserCreateClose = () => {
    setUserCreateOpen(false);
    setUserCreate({});
  };

  const isUserComplete = () => {
    return userCreate.username?.trim() && userCreate.password?.trim() && Array.isArray(userCreate.roles) && userCreate.roles.length > 0;
  };

  const fetchAllRoles = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/user/role');
      setRolesList(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleUserCreateInputChange = (field, value) => {
    const updatedData = { ...userCreate, [field]: value };
    setUserCreate(updatedData);
  };

  const handleCreateNewUser = async () => {
    try {
      await postRequest(process.env.REACT_APP_API_URL + '/user/signup', userCreate);
      handleUserCreateClose();
      setAlertMess(userCreate.username + ' added successfully ');
      setAlertColor('success');
      setShowAlert(true);
    } catch (err) {
      console.error(err.message);
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
    }
  };

  const handlePassChange = async () => {
    let payload = {
      username: username,
      password: password
    };

    try {
      await postRequest(process.env.REACT_APP_API_URL + '/user/changePassword', payload);
      setChangePassOpen(false);
      setPassword('');
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            '& svg': {
              stroke: theme.palette.primary.light
            }
          },
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={
          <Avatar
            src={User1}
            sx={{
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer'
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Box sx={{ p: 2 }}>
                    <Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="h4">Good Day,</Typography>
                        <Typography component="span" variant="h2" sx={{ fontWeight: 600 }}>
                          {username}
                        </Typography>
                      </Stack>
                      <Typography variant="subtitle2">{roles.join(',')}</Typography>
                    </Stack>
                  </Box>
                  <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                    <Box sx={{ p: 2 }}>
                      <Divider />
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: '10px',
                          [theme.breakpoints.down('md')]: {
                            minWidth: '100%'
                          },
                          '& .MuiListItemButton-root': {
                            mt: 0.5
                          }
                        }}
                      >
                        {isAuthorizedForAttendance && (
                          <ListItemButton
                            sx={{ borderRadius: `${customization.borderRadius}px` }}
                            selected={true}
                            onClick={() => setMarkAttendanceOpen(true)}
                          >
                            <ListItemIcon>
                              <IconUserCheck stroke={1.5} size="1.3rem" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body2">Mark Attendance</Typography>} />
                          </ListItemButton>
                        )}
                        {isAuthorizedForUserCreation && (
                          <ListItemButton
                            sx={{ borderRadius: `${customization.borderRadius}px` }}
                            selected={true}
                            onClick={() => {
                              fetchAllRoles();
                              setUserCreateOpen(true);
                            }}
                          >
                            <ListItemIcon>
                              <IconUserPlus stroke={1.5} size="1.3rem" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body2">Create User</Typography>} />
                          </ListItemButton>
                        )}
                        <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          selected={true}
                          onClick={() => setChangePassOpen(true)}
                        >
                          <ListItemIcon>
                            <IconReplace stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Change Password</Typography>} />
                        </ListItemButton>

                        <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          selected={true}
                          onClick={() => handleLogout()}
                        >
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                  </PerfectScrollbar>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
      <Dialog open={changePassOpen} onClose={handlePassChangeClose} aria-labelledby="data-row-dialog-title" fullWidth maxWidth="lg">
        <DialogContent dividers style={{ backgroundColor: 'white', color: 'black' }}>
          {' '}
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h2">{'Change password for User: ' + username}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="New Password"
                    required
                    fullWidth
                    variant="outlined"
                    // type="password"
                    value={password || ''}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="error" onClick={handlePassChange}>
                    Change Password
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
      {markAttendanceOpen && (
        <Dialog
          open={markAttendanceOpen}
          onClose={handleMarkAttendanceClose}
          aria-labelledby="data-row-dialog-title"
          fullWidth
          maxWidth="sm"
        >
          <DialogContent dividers style={{ backgroundColor: 'white', color: 'black' }}>
            {' '}
            <MarkAttendance />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleMarkAttendanceClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {userCreateOpen && (
        <Dialog open={userCreateOpen} onClose={handleUserCreateClose} aria-labelledby="data-row-dialog-title" fullWidth maxWidth="sm">
          <DialogContent dividers style={{ backgroundColor: 'white', color: 'black' }}>
            {' '}
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h2">Add new user</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Username"
                      required
                      fullWidth
                      variant="outlined"
                      // type="password"
                      value={userCreate.username || ''}
                      onChange={(e) => handleUserCreateInputChange('username', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Password"
                      required
                      fullWidth
                      variant="outlined"
                      // type="password"
                      value={userCreate.password || ''}
                      onChange={(e) => handleUserCreateInputChange('password', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      required
                      options={rolesList}
                      getOptionLabel={(option) => option.name}
                      onChange={(event, value) => handleUserCreateInputChange('roles', value)}
                      renderInput={(params) => (
                        <TextField {...params} variant="outlined" label="Select Roles" placeholder="Roles" fullWidth />
                      )}
                      value={userCreate.roles || []}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                  </Grid>
                  {isUserComplete() && (
                    <Grid item xs={12}>
                      <Button variant="contained" color="error" onClick={handleCreateNewUser}>
                        Add User
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleUserCreateClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}
    </>
  );
};

export default ProfileSection;
