import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Tooltip, IconButton, Box } from '@mui/material';
import { Edit, FactCheck } from '@mui/icons-material';
import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import { getRequest } from 'utils/fetchRequest';
import AlertDialog from 'views/utilities/AlertDialog';
import { loadEstimateAndTryPackageApply } from 'utils/JobPaymentUtils';
const BillPayment = Loadable(lazy(() => import('views/estimate/BillPayment')));
const MultiSettle = Loadable(lazy(() => import('views/estimate/MultiSettle')));

const CreditEstimate = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMess, setAlertMess] = useState('');
  const [alertColor, setAlertColor] = useState('info');

  const [data, setData] = useState([]);
  const [estimate, setEstimate] = useState();
  const [estimateCreateOpen, setEstimateCreateOpen] = useState(false);

  const [rowSelection, setRowSelection] = useState({});
  const selectedRows = useMemo(() => Object.keys(rowSelection).map((key) => data[key]), [rowSelection, data]);

  const [settleBillDialogOpen, setSettleBillDialogOpen] = useState(false);
  const [paymentModes, setPaymentModes] = useState([]);

  useEffect(() => {
    fetchCreditOpenEstimateData();
    getPaymentModes();

    return () => {
      setData([]);
      setPaymentModes([]);
    };
  }, []);

  const fetchCreditOpenEstimateData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/estimate/findByCreditFlag');
      setData(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getPaymentModes = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/config/paymentmodes');
      setPaymentModes(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleClose = () => {
    setEstimateCreateOpen(false);
    setEstimate({});
    setSettleBillDialogOpen(false);
    fetchCreditOpenEstimateData();
  };

  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'estimateId', //access nested data with dot notation
        header: 'Id',
        size: 50
        //filterVariant: 'multi-select'
      },
      {
        accessorKey: 'jobId', //normal accessorKey
        header: 'JobCard No.',
        size: 50
      },
      {
        accessorKey: 'grandTotal',
        header: 'Bill Amt',
        size: 50
      },
      {
        accessorKey: 'pendingAmount',
        header: 'Pending',
        size: 50
      },
      {
        accessorKey: 'ownerName', //access nested data with dot notation
        header: 'Owner',
        size: 50
      },
      {
        accessorKey: 'vehicleName',
        header: 'Vehicle',
        size: 50
      },
      {
        accessorKey: 'vehicleRegNo',
        header: 'Reg. No.',
        size: 50
      },
      {
        accessorKey: 'ownerPhoneNumber', //normal accessorKey
        header: 'Phone',
        size: 100
      },
      {
        accessorKey: 'billCloseDate',
        header: 'Bill Close Date',
        size: 100
      },
      {
        accessorKey: 'creditFlag',
        header: 'Credit ?',
        size: 100,
        filterVariant: 'multi-select',
        Cell: ({ cell }) => (cell.getValue() ? 'Yes' : 'No')
      },
      {
        accessorKey: 'creditSettledFlag',
        header: 'Credit Settled ?',
        size: 100,
        filterVariant: 'multi-select',
        Cell: ({ cell }) => (cell.getValue() ? 'Yes' : 'No')
      }
    ],
    []
  );

  return (
    <>
      {showAlert && <AlertDialog showAlert={showAlert} setShowAlert={setShowAlert} alertColor={alertColor} alertMess={alertMess} />}
      <MaterialReactTable
        columns={columns}
        data={data}
        enableFacetedValues
        //editingMode="modal"
        enableEditing
        enableRowSelection
        onRowSelectionChange={setRowSelection}
        state={{ rowSelection }}
        renderRowActions={({ row }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="right" title="Estimate">
              <IconButton
                onClick={() => {
                  loadEstimateAndTryPackageApply(
                    row.original.id,
                    row.original.ownerPhoneNumber,
                    setEstimate,
                    setEstimateCreateOpen,
                    getRequest
                  );
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() =>
          Object.keys(rowSelection).length > 0 && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Tooltip title="Settle Bill">
                <IconButton
                  onClick={() => {
                    const hasZeroPendingAmount = selectedRows.some((row) => row.pendingAmount === 0);

                    if (hasZeroPendingAmount) {
                      alert('One or more rows have a pending amount of 0.');
                      return;
                    }
                    setSettleBillDialogOpen(true);
                  }}
                >
                  <FactCheck />
                </IconButton>
              </Tooltip>
            </Box>
          )
        }
      />
      {estimateCreateOpen && (
        <BillPayment
          estimate={estimate}
          setEstimate={setEstimate}
          paymentModes={paymentModes}
          estimateCreateOpen={estimateCreateOpen}
          handleClose={handleClose}
          setAlertMess={setAlertMess}
          setShowAlert={setShowAlert}
          setAlertColor={setAlertColor}
        />
      )}
      {settleBillDialogOpen && (
        <MultiSettle
          paymentModes={paymentModes}
          settleBillDialogOpen={settleBillDialogOpen}
          selectedRows={selectedRows}
          handleClose={handleClose}
          setAlertMess={setAlertMess}
          setShowAlert={setShowAlert}
        />
      )}
    </>
  );
};

export default CreditEstimate;
