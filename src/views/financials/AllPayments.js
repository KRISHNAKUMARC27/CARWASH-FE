/* eslint-disable react/prop-types */
import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { getRequest } from 'utils/fetchRequest';

const AllPayments = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchAllPaymensData();
    return () => {
      setData([]);
    };
  }, []);

  const fetchAllPaymensData = async () => {
    try {
      const data = await getRequest(process.env.REACT_APP_API_URL + '/payments');
      setData(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'paymentAmount',
        header: 'Amount',
        size: 100
      },
      {
        accessorKey: 'paymentDate',
        header: 'Date',
        size: 100
      },
      {
        accessorKey: 'paymentMode',
        header: 'Mode',
        size: 100
      },
      {
        accessorKey: 'category',
        header: 'Category',
        size: 100,
        filterVariant: 'multi-select'
      },
      {
        accessorKey: 'categoryFieldId',
        header: 'Id',
        size: 100
      },
      {
        accessorKey: 'isDeleted',
        header: 'Is Payment Deleted?',
        size: 100,
        filterVariant: 'select',
        filterSelectOptions: ['Yes', 'No'],
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return value === true || value === 'true' ? 'Yes' : 'No';
        }
      },
      {
        accessorKey: 'isCreditPayment',
        header: 'Is Credit Settlement?',
        size: 100,
        filterVariant: 'select',
        filterSelectOptions: ['Yes', 'No'],
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return value === true || value === 'true' ? 'Yes' : 'No';
        }
      },
      {
        accessorKey: 'modifiedPayments',
        header: 'Modified Payments',
        size: 100,
        Cell: ({ cell }) => {
          const value = cell.getValue(); // an array of objects
          if (!value || value.length === 0) return 'None';

          return (
            <ul style={{ margin: 0, paddingLeft: '1rem' }}>
              {value.map((item, idx) => (
                <li key={idx}>{`Old: ${item.oldAmount}, New: ${item.newAmount}, At: ${new Date(item.modifiedAt).toLocaleString()}`}</li>
              ))}
            </ul>
          );
        }
      }
    ],
    []
  );

  return (
    <>
      <MaterialReactTable columns={columns} data={data} enableFacetedValues />
    </>
  );
};

export default AllPayments;
