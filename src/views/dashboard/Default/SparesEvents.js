import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';

import { Table, TableBody, TableCell, TableHead, TableRow, Grid, IconButton, Tooltip } from '@mui/material';
import { Delete } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { getRequest, deleteRequest } from 'utils/fetchRequest';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.success.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.success.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

function SparesEvents() {
  const [sparesEventsList, setSparesEventsList] = useState([]);

  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');

  useEffect(() => {
    fetchAllSparesEventsListData();

    return () => {
      setSparesEventsList([]);
    };
  }, []);

  const fetchAllSparesEventsListData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/stats/sparesEvents');
      setSparesEventsList(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleRowDelete = async (id) => {
    try {
      const data = await deleteRequest(process.env.REACT_APP_API_URL + '/stats/sparesEvents/' + id);
      setAlertMess('Spares Event deleted successfully');
      setAlertColor('success');
      setShowAlert(true);
      setSparesEventsList(data);
    } catch (err) {
      setAlertMess(err.message);
      setAlertColor('info');
      setShowAlert(true);
    }
  };

  return (
    <div>
      <CardWrapper border={false} content={false}>
        <MainCard title="Spares Inventory Shortage">
          <Grid container direction="row" spacing={gridSpacing}>
            <Grid item xs={12}>
              {showAlert && (
                <Stack sx={{ width: '100%' }} spacing={2}>
                  <Alert variant="filled" severity={alertColor} onClose={() => setShowAlert(false)}>
                    {alertMess}
                  </Alert>
                </Stack>
              )}
              <Grid item xs={12}>
                <div style={{ overflowX: 'auto' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Shortage Events</TableCell>
                        <TableCell>Event Time</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sparesEventsList.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row?.notif}</TableCell>
                          <TableCell>{row?.time}</TableCell>
                          <TableCell>
                            <Tooltip arrow placement="right" title="Delete">
                              <IconButton
                                onClick={() => {
                                  handleRowDelete(row.id);
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>
      </CardWrapper>
    </div>
  );
}

export default SparesEvents;
