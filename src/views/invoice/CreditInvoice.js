import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Tooltip, IconButton, Box } from '@mui/material';
import { Edit, FactCheck } from '@mui/icons-material';
import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import { getRequest } from 'utils/fetchRequest';
import AlertDialog from 'views/utilities/AlertDialog';
const BillPayment = Loadable(lazy(() => import('views/invoice/BillPayment')));
const MultiSettle = Loadable(lazy(() => import('views/invoice/MultiSettle')));

const CreditInvoice = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMess, setAlertMess] = useState('');
  const [alertColor, setAlertColor] = useState('info');
  const [data, setData] = useState([]);
  const [invoice, setInvoice] = useState();
  const [invoiceCreateOpen, setInvoiceCreateOpen] = useState(false);

  const [rowSelection, setRowSelection] = useState({});
  const selectedRows = useMemo(() => Object.keys(rowSelection).map((key) => data[key]), [rowSelection, data]);

  const [settleBillDialogOpen, setSettleBillDialogOpen] = useState(false);
  const [paymentModes, setPaymentModes] = useState([]);
  useEffect(() => {
    fetchCreditOpenInvoiceData();
    getPaymentModes();

    return () => {
      setData([]);
      setPaymentModes([]);
    };
  }, []);

  const fetchCreditOpenInvoiceData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/invoice/findByCreditFlag');
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
    setInvoiceCreateOpen(false);
    setInvoice({});
    setSettleBillDialogOpen(false);
    fetchCreditOpenInvoiceData();
  };

  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'invoiceId', //access nested data with dot notation
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
            <Tooltip arrow placement="right" title="Invoice">
              <IconButton
                onClick={() => {
                  setInvoice(row.original);
                  setInvoiceCreateOpen(true);
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
      {invoiceCreateOpen && (
        <BillPayment
          invoice={invoice}
          setInvoice={setInvoice}
          paymentModes={paymentModes}
          invoiceCreateOpen={invoiceCreateOpen}
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

export default CreditInvoice;
