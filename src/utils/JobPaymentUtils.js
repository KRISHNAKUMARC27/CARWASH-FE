export const prepareInitialInvoiceObject = async (payload, setInvoice, setInvoiceCreateOpen, getRequest) => {
  if (payload.invoiceObjId != null) {
    try {
      await loadInvoiceAndTryPackageApply(payload.invoiceObjId, payload.ownerPhoneNumber, setInvoice, setInvoiceCreateOpen, getRequest);
    } catch (err) {
      await getSelectedRowJobSpares(payload, setInvoice, setInvoiceCreateOpen, getRequest);
    }
  } else {
    await getSelectedRowJobSpares(payload, setInvoice, setInvoiceCreateOpen, getRequest);
  }
};

export const loadInvoiceAndTryPackageApply = async (id, ownerPhoneNumber, setInvoice, setInvoiceCreateOpen, getRequest) => {
  try {
    const invoiceData = await getRequest(`${process.env.REACT_APP_API_URL}/invoice/${id}`);
    setInvoice(invoiceData);
    setInvoiceCreateOpen(true);

    const pendingAmount = invoiceData.pendingAmount || 0;
    if (pendingAmount > 0) {
      const status = 'OPEN';
      const url = `${process.env.REACT_APP_API_URL}/package/${ownerPhoneNumber}/${status}`;
      const servicePackage = await getRequest(url);

      if (servicePackage && servicePackage.amount > 0) {
        const usableAmount = Math.min(pendingAmount, servicePackage.amount);
        const confirmUse = window.confirm(
          `You have ₹${servicePackage.amount} left in your service package. Do you want to use ₹${usableAmount} for this invoice?`
        );

        if (confirmUse) {
          const newSplit = {
            paymentAmount: usableAmount,
            paymentMode: 'PACKAGE',
            flag: 'ADD',
            paymentDate: new Date().toISOString(),
            paymentId: servicePackage.id
          };

          const remaining = pendingAmount - usableAmount;

          setInvoice((prev) => ({
            ...prev,
            pendingAmount: remaining,
            paymentSplitList: [...(prev.paymentSplitList || []), newSplit]
          }));
        }
      }
    }
  } catch (err) {
    console.log(err.message);
    throw err; // let the caller handle fallback if needed
  }
};

export const getSelectedRowJobSpares = async (payload, setInvoice, setInvoiceCreateOpen, getRequest) => {
  try {
    const data = await getRequest(`${process.env.REACT_APP_API_URL}/jobCard/jobSpares/${payload.id}`);
    const status = 'OPEN';

    const url = `${process.env.REACT_APP_API_URL}/package/${payload.ownerPhoneNumber}/${status}`;
    const servicePackage = await getRequest(url);

    let paymentSplitList = [];

    if (servicePackage && servicePackage.amount > 0) {
      const deductible = Math.min(data.grandTotalWithGST, servicePackage.amount);
      paymentSplitList.push({
        paymentAmount: deductible,
        paymentMode: 'PACKAGE',
        flag: 'ADD',
        paymentDate: new Date().toISOString(),
        paymentId: servicePackage.id
      });

      if (deductible < data.grandTotalWithGST) {
        const remaining = data.grandTotalWithGST - deductible;
        paymentSplitList.push({
          paymentAmount: remaining,
          paymentMode: 'CASH',
          flag: 'ADD'
        });
      }
    } else {
      paymentSplitList.push({
        paymentAmount: data.grandTotalWithGST || 0,
        paymentMode: 'CASH',
        flag: 'ADD'
      });
    }

    setInvoice((prevState) => ({
      ...prevState,
      jobId: payload.jobId,
      ownerName: payload.ownerName,
      ownerPhoneNumber: payload.ownerPhoneNumber,
      vehicleRegNo: payload.vehicleRegNo,
      vehicleName: payload.vehicleName,
      grandTotal: data.grandTotalWithGST,
      jobObjId: data.id,
      paymentSplitList,
      creditPaymentList: []
    }));

    setInvoiceCreateOpen(true);
  } catch (err) {
    console.log(err.message);
  }
};

export const prepareInitialEstimateObject = async (payload, setEstimate, setEstimateCreateOpen, getRequest) => {
  if (payload.estimateObjId != null) {
    try {
      await loadEstimateAndTryPackageApply(payload.estimateObjId, payload.ownerPhoneNumber, setEstimate, setEstimateCreateOpen, getRequest);
    } catch (err) {
      await getSelectedRowJobSparesEstimate(payload, setEstimate, setEstimateCreateOpen, getRequest);
    }
  } else {
    await getSelectedRowJobSparesEstimate(payload, setEstimate, setEstimateCreateOpen, getRequest);
  }
};

export const loadEstimateAndTryPackageApply = async (id, ownerPhoneNumber, setEstimate, setEstimateCreateOpen, getRequest) => {
  try {
    const estimateData = await getRequest(`${process.env.REACT_APP_API_URL}/estimate/${id}`);
    setEstimate(estimateData);
    setEstimateCreateOpen(true);

    const pendingAmount = estimateData.pendingAmount || 0;
    if (pendingAmount > 0) {
      const status = 'OPEN';
      const url = `${process.env.REACT_APP_API_URL}/package/${ownerPhoneNumber}/${status}`;
      const servicePackage = await getRequest(url);

      if (servicePackage && servicePackage.amount > 0) {
        const usableAmount = Math.min(pendingAmount, servicePackage.amount);
        const confirmUse = window.confirm(
          `You have ₹${servicePackage.amount} left in your service package. Do you want to use ₹${usableAmount} for this estimate?`
        );

        if (confirmUse) {
          const newSplit = {
            paymentAmount: usableAmount,
            paymentMode: 'PACKAGE',
            flag: 'ADD',
            paymentDate: new Date().toISOString(),
            paymentId: servicePackage.id
          };

          const remaining = pendingAmount - usableAmount;

          setEstimate((prev) => ({
            ...prev,
            pendingAmount: remaining,
            paymentSplitList: [...(prev.paymentSplitList || []), newSplit]
          }));
        }
      }
    }
  } catch (err) {
    console.log(err.message);
    throw err; // let the caller handle fallback if needed
  }
};

export const getSelectedRowJobSparesEstimate = async (payload, setEstimate, setEstimateCreateOpen, getRequest) => {
  try {
    const data = await getRequest(`${process.env.REACT_APP_API_URL}/jobCard/jobSpares/${payload.id}`);
    const status = 'OPEN';

    const url = `${process.env.REACT_APP_API_URL}/package/${payload.ownerPhoneNumber}/${status}`;
    const servicePackage = await getRequest(url);

    let paymentSplitList = [];

    if (servicePackage && servicePackage.amount > 0) {
      const deductible = Math.min(data.grandTotal, servicePackage.amount);
      paymentSplitList.push({
        paymentAmount: deductible,
        paymentMode: 'PACKAGE',
        flag: 'ADD',
        paymentDate: new Date().toISOString(),
        paymentId: servicePackage.id
      });

      if (deductible < data.grandTotal) {
        const remaining = data.grandTotal - deductible;
        paymentSplitList.push({
          paymentAmount: remaining,
          paymentMode: 'CASH',
          flag: 'ADD'
        });
      }
    } else {
      paymentSplitList.push({
        paymentAmount: data.grandTotal || 0,
        paymentMode: 'CASH',
        flag: 'ADD'
      });
    }

    setEstimate((prevState) => ({
      ...prevState,
      jobId: payload.jobId,
      ownerName: payload.ownerName,
      ownerPhoneNumber: payload.ownerPhoneNumber,
      vehicleRegNo: payload.vehicleRegNo,
      vehicleName: payload.vehicleName,
      grandTotal: data.grandTotal,
      jobObjId: data.id,
      paymentSplitList,
      creditPaymentList: []
    }));

    setEstimateCreateOpen(true);
  } catch (err) {
    console.log(err.message);
  }
};
