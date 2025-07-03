import React, { useState, useEffect } from 'react';

import { Table, TableBody, TableCell, TableHead, TableRow, Grid, IconButton, Tooltip, TablePagination } from '@mui/material';
import { Delete } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import AlertDialog from 'views/utilities/AlertDialog';
import { getRequest, deleteRequest } from 'utils/fetchRequest';
import CardWrapper from 'views/utilities/CardWrapper';

function SparesEvents() {
  const [sparesEventsList, setSparesEventsList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <CardWrapper border={false} content={false}>
        <MainCard title="Spares Inventory Shortage">
          <Grid container direction="row" spacing={gridSpacing}>
            <Grid item xs={12}>
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
                      {sparesEventsList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row?.notif}</TableCell>
                          <TableCell>{row?.time}</TableCell>
                          <TableCell>
                            <Tooltip arrow placement="right" title="Delete">
                              <IconButton onClick={() => handleRowDelete(row.id)}>
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={sparesEventsList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </div>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>
      </CardWrapper>
      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}
    </>
  );
}

export default SparesEvents;
