const { oracledb } = require("../../../db/db");
const { Execute } = require("../../../utils/dynamicController");

/*-------------------------------- SELECT --------------------------------*/

const getSupplierWithProductEntriesInfo = (
  search = "%%",
  page = 0,
  limit = 1000
) => {
  let offset = limit * page;
  return Execute(
    `SELECT DISTINCT(S.SUP_ID), S.SUPPLIER,  SUM(LT.QUANTITIES*PROAMOUNT) OVER(PARTITION BY LT.PRODUCTFROM) AS Total_Amount, SUM(QUANTITIES) OVER (PARTITION BY  LT.PRODUCTFROM) AS Total_quantity FROM STR_PRODUCTENTRILISTS LT LEFT OUTER JOIN STR_SUPPLIERS S ON LT.PRODUCTFROM = S.SUP_ID WHERE LOWER(S.SUPPLIER) LIKE LOWER('${search}') OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`
  );
};


const getRecentMonthSupply = (
  month, searchr = "%%", pager = 0, limitr = 1000) => {
  let offsetr = limitr * pager;
  return Execute(
    `SELECT PE.MRRNNO, PE.PROINID, S.SUP_ID, S.SUPPLIER, PE.ENTRIDATE FROM STR_PRODUCTENTRIES PE LEFT OUTER JOIN STR_SUPPLIERS S ON PE.SUPPLIER = S.SUP_ID WHERE ENTRIMONTH = '${month}' AND PE.MRRNNO LIKE ('${searchr}') OR S.SUPPLIER LIKE LOWER('${searchr}') ORDER BY ENTRIDATE OFFSET ${offsetr} ROWS FETCH NEXT ${limitr} ROWS ONLY`
  );
}


const getMrrProListBySupplierId = (SUP_ID) =>
  Execute(
    `SELECT DISTINCT (PRODATE), productfrom AS SUP_ID, MRRNUMBER FROM STR_PRODUCTENTRILISTS WHERE PRODUCTFROM = ${SUP_ID} ORDER BY PRODATE DESC`
  );

// Previous getMrrProListBySupplierId
// const getMrrProListBySupplierId = (SUP_ID) => Execute(`SELECT DISTINCT (PRODATE), productfrom AS SUP_ID, SUM(QUANTITIES*PROAMOUNT) OVER(PARTITION BY PRODATE) AS TOTAL_AMOUNT, SUM(QUANTITIES) OVER(PARTITION BY PRODATE) AS TOTAL_QUANTITIES, MRRNUMBER FROM STR_PRODUCTENTRILISTS WHERE PRODUCTFROM = ${SUP_ID} ORDER BY PRODATE DESC`)

const getProductEntiresFirst = (SUP_ID, date) =>
  Execute(
    `SELECT * FROM STR_PRODUCTENTRIES WHERE SUPPLIER = ${SUP_ID} AND ENTRIDATE = '${date}' FETCH NEXT 1 ROWS ONLY`
  );

const getProductEntriLists = (SUP_ID, date) =>
  Execute(
    `SELECT * FROM STR_PRODUCTENTRILISTS LT LEFT OUTER JOIN STR_STOREPRODUCTS S ON LT.PRODUCTIDNO = S.PROID WHERE PRODUCTFROM = ${SUP_ID} AND PRODATE = '${date}'`
  );

//---
const getProductEntiresFirsts = (SUP_ID, MRRNO, date) =>
  Execute(
    `SELECT * FROM STR_PRODUCTENTRIES WHERE SUPPLIER = ${SUP_ID} AND MRRNNO= ${MRRNO} AND ENTRIDATE = '${date}' FETCH NEXT 1 ROWS ONLY`
  );

const getProductEntriListss = (SUP_ID, MRRNO, date) =>
  Execute(
    `SELECT * FROM STR_PRODUCTENTRILISTS LT LEFT OUTER JOIN STR_STOREPRODUCTS S ON LT.PRODUCTIDNO = S.PROID WHERE PRODUCTFROM = ${SUP_ID} AND MRRNUMBER=${MRRNO} AND PRODATE = '${date}'`
  );

const getProductEntriListsFirst = (LIST_ID) =>
  Execute(
    `SELECT PROLISTID, PROID, PROQTY, QUANTITIES, PROAMOUNT FROM STR_PRODUCTENTRILISTS LT LEFT OUTER JOIN STR_STOREPRODUCTS S ON LT.PRODUCTIDNO = S.PROID WHERE PROLISTID = ${LIST_ID} FETCH NEXT 1 ROWS ONLY`
  );

const getSingleProEntriesByMrrno = (mrrno) =>
  Execute(`SELECT * FROM STR_PRODUCTENTRIES WHERE MRRNNO = ${mrrno}`);

const getCurrentStock = ({ proid }) =>
  Execute(
    `SELECT proid, proqty FROM STR_STOREPRODUCTS WHERE PROID = ${Number(proid)}`
  );

const getProListById = ({ prolistid }) =>
  Execute(
    `SELECT PROLISTID, QUANTITIES, PROAMOUNT FROM STR_PRODUCTENTRILISTS WHERE PROLISTID = ${Number(
      prolistid
    )}`
  );

/*--------------------------------END SELECT --------------------------------*/

/*----------------------------------INSERT ----------------------------------*/

const insertMrrLogs = (
  proid,
  action,
  oldquantity,
  oldamount,
  changequantity,
  changeamount,
  logdatetime,
  username
) =>
  Execute(
    `INSERT INTO STR_MRRLOGS (PRODUCT_ID, ACTION, OLDQTY, OLDPRICE, CHANGEQTY, CHANGEPRICE, LOGDATETIME, LOGEDBY) VALUES (${Number(
      proid
    )}, '${action}', ${Number(oldquantity)}, ${Number(oldamount)}, ${Number(
      changequantity
    )}, ${Number(changeamount)}, ${logdatetime}, '${username}')`
  );

const insertMrrLogsWithRemarks = (
  proid,
  action,
  remarks,
  oldquantity,
  oldamount,
  changequantity,
  changeamount,
  logdatetime,
  username
) =>
  Execute(
    `INSERT INTO STR_MRRLOGS (PRODUCT_ID, ACTION, REMARKS, OLDQTY, OLDPRICE, CHANGEQTY, CHANGEPRICE, LOGDATETIME, LOGEDBY) VALUES (${Number(
      proid
    )}, '${action}', ${remarks}, ${Number(oldquantity)}, ${Number(
      oldamount
    )}, ${Number(changequantity)}, ${Number(
      changeamount
    )}, ${logdatetime}, '${username}')`
  );

/*---------------------------------END INSERT -------------------------------*/

/*---------------------------------- UPDATE -----------------------------------*/

const updateProductEntriListById = (prolistid, changequantity, changeamount) =>
  Execute(
    `UPDATE STR_PRODUCTENTRILISTS SET QUANTITIES = ${Number(
      changequantity
    )}, PROAMOUNT = ${Number(changeamount)} WHERE PROLISTID = ${Number(
      prolistid
    )}`
  );

const updateStoreProductById = (proid, changproqty) =>
  Execute(
    `UPDATE STR_STOREPRODUCTS SET proqty = ${Number(
      changproqty
    )} WHERE proid = ${Number(proid)}`
  );

const updateSingleProEntriesByMrrno = (
  mrrno,
  supplier,
  suppdate,
  workorder,
  workodate,
  cashmemono,
  cashmemodate
) => {
  return Execute(
    `UPDATE STR_PRODUCTENTRIES SET SUPPLIER = '${Number(
      supplier
    )}', SUPPDATE = '${suppdate}', WORKORDER = '${workorder}', WORKODATE = '${workodate}', CASHMEMONO = '${cashmemono}', CASHMEMODATE = '${cashmemodate}' WHERE MRRNNO = ${Number(
      mrrno
    )}`
  );
};

const updateProductEntriListsSupplier = (mrrno, supplier) =>
  Execute(
    `UPDATE STR_PRODUCTENTRILISTS SET PRODUCTFROM = ${Number(
      supplier
    )} WHERE MRRNUMBER = ${Number(mrrno)}`
  );

/*---------------------------------- END UPDATE -----------------------------------*/

/*---------------------------------- DELETE -----------------------------------*/

const deleteProductEntriListById = (prolistid) =>
  Execute(
    `DELETE FROM STR_PRODUCTENTRILISTS WHERE PROLISTID = ${Number(prolistid)}`
  );

/*---------------------------------- END DELETE -----------------------------------*/

module.exports = {
  getSupplierWithProductEntriesInfo,
  getRecentMonthSupply,
  getMrrProListBySupplierId,
  getProductEntiresFirst,
  getProductEntriLists,
  getProductEntriListsFirst,
  updateProductEntriListById,
  updateStoreProductById,
  insertMrrLogs,
  insertMrrLogsWithRemarks,
  deleteProductEntriListById,
  getSingleProEntriesByMrrno,
  updateSingleProEntriesByMrrno,
  updateProductEntriListsSupplier,
  getProductEntiresFirsts,
  getProductEntriListss,
};
