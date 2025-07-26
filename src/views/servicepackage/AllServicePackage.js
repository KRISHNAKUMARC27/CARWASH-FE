import React, { useMemo, useState, useEffect, lazy } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { IconButton, Tooltip, Box, Typography, Grid, Divider, Dialog, DialogActions, DialogContent, Button } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { gridSpacing } from 'store/constant';
import Loadable from 'ui-component/Loadable';
import { getRequest } from 'utils/fetchRequest';

const ServicePackageCreate = Loadable(lazy(() => import('views/servicepackage/ServicePackageCreate')));

const AllAppointment = () => {
  const [data, setData] = useState([]);
  const [servicePackage, setServicePackage] = useState({});
  const [servicePackageUpdateOpen, setServicePackageUpdateOpen] = useState(false);

  useEffect(() => {
    fetchAllServicePackageData();
    return () => {
      setData([]);
    };
  }, []);

  const handleClose = () => {
    setServicePackageUpdateOpen(false);
  };

  const fetchAllServicePackageData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/package');
      setData(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'customerName', //access nested data with dot notation
        header: 'Name',
        size: 100
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        size: 100
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        size: 100
      },
      {
        accessorKey: 'paymentMode',
        header: 'Mode',
        size: 50
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 50,
        filterVariant: 'multi-select'
      },
      {
        accessorKey: 'date',
        header: 'LastUpdateDate',
        size: 100
      },
      {
        accessorKey: 'creationDate',
        header: 'PackageOpenDate',
        size: 100
      },
      {
        accessorKey: 'jobIdToDeductedAmount',
        header: 'Job Deductions',
        size: 200,
        Cell: ({ cell }) => {
          const map = cell.getValue(); // expected to be an object: { 101: 150, 102: 300 }
          if (!map || Object.keys(map).length === 0) return '—';
          return Object.entries(map)
            .map(([jobId, amount]) => `${jobId}: ₹${amount}`)
            .join(', ');
        }
      }
    ],
    []
  );

  return (
    <Box sx={{ px: { xs: 1, sm: 2 }, py: 2 }}>
      <Box sx={{ mt: 4 }}>
        <MaterialReactTable
          columns={columns}
          data={data}
          enableFacetedValues
          editingMode="modal"
          enableEditing
          renderRowActions={({ row }) => (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip arrow placement="left" title="Update Package Info">
                <IconButton
                  onClick={() => {
                    setServicePackageUpdateOpen(false);
                    setServicePackage(row.original);
                    setServicePackageUpdateOpen(true);
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        />
      </Box>

      <Dialog open={servicePackageUpdateOpen} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogContent dividers sx={{ bgcolor: 'white', color: 'black' }}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2 }}>
                {'Updating Package: ' + servicePackage.name}
              </Typography>
              <ServicePackageCreate
                data={servicePackage}
                setAppointmentUpdateOpen={setServicePackageUpdateOpen}
                fetchAllAppointmentData={fetchAllServicePackageData}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllAppointment;
