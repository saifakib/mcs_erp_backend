const { Execute } = require("../../../utils/dynamicController");

/*-------------------------------------------- SELECT --------------------------------------------------*/

/*--------------------- Entries Report ----------------- */
const getAllEntriesReports = (fdate, tdate) =>
  Execute(
    `SELECT ST.PRONAME, ST.PRONAMETWO, LT.PROLISTID, LT.PRODATE, LT.MRRNUMBER, S.SUPPLIER, CT.CATEGORYEN, LT.QUANTITIES, LT.PROAMOUNT, LT.PROAMOUNT * LT.QUANTITIES as TOTALAMOUNT, U.UNIT FROM STR_PRODUCTENTRILISTS LT  LEFT OUTER JOIN STR_SUPPLIERS S ON LT.PRODUCTFROM = S.SUP_ID LEFT OUTER JOIN STR_STOREPRODUCTS ST ON ST.PROID = LT.PRODUCTIDNO LEFT OUTER JOIN STR_CATEGORIES CT ON CT.CAT_ID = ST.PROCATE LEFT OUTER JOIN STR_UNITS U ON ST.PRODUNIT = U.UNIT_ID WHERE LT.PRODATE >= '${fdate}' AND LT.PRODATE <= '${tdate}'`
  );

const getSingleEntriesReports = (productidno, fdate, tdate) =>
  Execute(
    `SELECT ST.PRONAME, ST.PRONAMETWO, LT.PROLISTID, LT.PRODATE, LT.MRRNUMBER, S.SUPPLIER, CT.CATEGORYEN, LT.QUANTITIES, LT.PROAMOUNT, LT.PROAMOUNT * LT.QUANTITIES as TOTALAMOUNT, U.UNIT FROM STR_PRODUCTENTRILISTS LT  LEFT OUTER JOIN STR_SUPPLIERS S ON LT.PRODUCTFROM = S.SUP_ID LEFT OUTER JOIN STR_STOREPRODUCTS ST ON ST.PROID = LT.PRODUCTIDNO LEFT OUTER JOIN STR_CATEGORIES CT ON CT.CAT_ID = ST.PROCATE LEFT OUTER JOIN STR_UNITS U ON ST.PRODUNIT = U.UNIT_ID WHERE LT.PRODATE >= '${fdate}' AND LT.PRODATE <= '${tdate}' AND PRODUCTIDNO = ${Number(
      productidno
    )}`
  );

const getSingleEntriesReportsWHDate = (productidno) =>
  Execute(
    `SELECT ST.PRONAME, ST.PRONAMETWO, LT.PROLISTID, LT.PRODATE, LT.MRRNUMBER, S.SUPPLIER, CT.CATEGORYEN, LT.QUANTITIES, LT.PROAMOUNT, LT.PROAMOUNT * LT.QUANTITIES as TOTALAMOUNT, U.UNIT FROM STR_PRODUCTENTRILISTS LT  LEFT OUTER JOIN STR_SUPPLIERS S ON LT.PRODUCTFROM = S.SUP_ID LEFT OUTER JOIN STR_STOREPRODUCTS ST ON ST.PROID = LT.PRODUCTIDNO LEFT OUTER JOIN STR_CATEGORIES CT ON CT.CAT_ID = ST.PROCATE LEFT OUTER JOIN STR_UNITS U ON ST.PRODUNIT = U.UNIT_ID WHERE PRODUCTIDNO = ${Number(
      productidno
    )}`
  );
/*--------------------- End Entries Report ----------------- */

/*--------------------- Stock Stauts Report ----------------- */
const stockStatus = () =>
  Execute(
    `SELECT SP.PROID, SP.PRONAME, SP.PRONAMETWO, SP.PROQTY, C.CATEGORYEN, S.UNIT FROM STR_STOREPRODUCTS SP LEFT OUTER JOIN STR_CATEGORIES C ON SP.PROCATE = C.CAT_ID LEFT OUTER JOIN STR_UNITS S ON SP.PRODUNIT = S.UNIT_ID ORDER BY PROID ASC`
  );

const stockStatusByCatId = (CATID) =>
  Execute(
    `SELECT SP.PROID, SP.PRONAME, SP.PRONAMETWO, SP.PROQTY, C.CATEGORYEN, S.UNIT FROM STR_STOREPRODUCTS SP LEFT OUTER JOIN STR_CATEGORIES C ON SP.PROCATE = C.CAT_ID LEFT OUTER JOIN STR_UNITS S ON SP.PRODUNIT = S.UNIT_ID WHERE SP.PROCATE = ${CATID} ORDER BY PROID ASC`
  );
/*--------------------- End Stock Stauts Report ----------------- */

/*--------------------- Product Logs Report ----------------- */
const getProductSummariesByProductid = (PROID) =>
  Execute(
    `SELECT PS.SUMMDATE, SP.PRONAME AS PRODUCTNAME, PS.INTIALQTY, PS.NEWADDQTY, PS.TOTALBALANCE, PS.TOTALOUT, PS.PRESENTBALANCE, P.NAME_ENGLISH AS NAME, PG.DESIGNATION, PD.DEPARTEMENT AS DEPARTMENT, C.CATEGORYBN, C.CATEGORYEN FROM STR_PRODUCTSUMMARIES PS LEFT OUTER JOIN hrm.EMPLOYEE P ON PS.REQUISITIONFOR = P.EMPLOYE_ID LEFT OUTER JOIN STR_CATEGORIES C ON PS.PROCAT = C.CAT_ID LEFT OUTER JOIN hrm.DESIGNATION PG ON P.DESIGNATION_ID = PG.DESIGNATION_ID LEFT OUTER JOIN hrm.DEPARTMENT_LIST PD ON P.DEPARTEMENT_ID = PD.DEPARTEMENT_ID LEFT OUTER JOIN STR_STOREPRODUCTS SP ON PS.PRODUCTID = SP.PROID WHERE PS.PRODUCTID = ${PROID} ORDER BY PROSUMID ASC`
  );

const getProductSummariesBySummMonth = (SUMMMONTH) =>
  Execute(
    `SELECT PS.SUMMDATE, SP.PRONAME AS PRODUCTNAME, PS.INTIALQTY, PS.NEWADDQTY, PS.TOTALBALANCE, PS.TOTALOUT, PS.PRESENTBALANCE, P.NAME_ENGLISH AS NAME, PG.DESIGNATION, PD.DEPARTEMENT AS DEPARTMENT, C.CATEGORYBN, C.CATEGORYEN FROM STR_PRODUCTSUMMARIES PS LEFT OUTER JOIN hrm.EMPLOYEE P ON PS.REQUISITIONFOR = P.EMPLOYE_ID LEFT OUTER JOIN hrm.DESIGNATION PG ON P.DESIGNATION_ID = PG.DESIGNATION_ID LEFT OUTER JOIN hrm.DEPARTMENT_LIST PD ON P.DEPARTEMENT_ID = PD.DEPARTEMENT_ID LEFT OUTER JOIN STR_CATEGORIES C ON PS.PROCAT = C.CAT_ID LEFT OUTER JOIN STR_STOREPRODUCTS SP ON PS.PRODUCTID = SP.PROID LEFT OUTER JOIN STR_STOREPRODUCTS SP ON PS.PRODUCTID = SP.PROID WHERE PS.SUMMMONTH = ${SUMMMONTH} ORDER BY C.CATEGORYEN ASC, PRODUCTNAME ASC, PROSUMID ASC`
  );

const getProductSummariesBySummMonthAndCatId = (SUMMMONTH, CATID) =>
  Execute(
    `SELECT PS.SUMMDATE, SP.PRONAME AS PRODUCTNAME, PS.INTIALQTY, PS.NEWADDQTY, PS.TOTALBALANCE, PS.TOTALOUT, PS.PRESENTBALANCE, P.NAME_ENGLISH AS NAME, PG.DESIGNATION, PD.DEPARTEMENT AS DEPARTMENT, C.CATEGORYBN, C.CATEGORYEN FROM STR_PRODUCTSUMMARIES PS LEFT OUTER JOIN hrm.EMPLOYEE P ON PS.REQUISITIONFOR = P.EMPLOYE_ID LEFT OUTER JOIN hrm.DESIGNATION PG ON P.DESIGNATION_ID = PG.DESIGNATION_ID LEFT OUTER JOIN hrm.DEPARTMENT_LIST PD ON P.DEPARTEMENT_ID = PD.DEPARTEMENT_ID LEFT OUTER JOIN STR_CATEGORIES C ON PS.PROCAT = C.CAT_ID LEFT OUTER JOIN STR_STOREPRODUCTS SP ON PS.PRODUCTID = SP.PROID  WHERE PS.SUMMMONTH = ${SUMMMONTH} AND PS.PROCAT = ${Number(
      CATID
    )} ORDER BY PRODUCTNAME ASC, PROSUMID ASC`
  );

const getProductSummariesByCatId = (CATID) =>
  Execute(
    `SELECT PS.SUMMDATE, SP.PRONAME AS PRODUCTNAME, PS.INTIALQTY, PS.NEWADDQTY, PS.TOTALBALANCE, PS.TOTALOUT, PS.PRESENTBALANCE, P.NAME_ENGLISH AS NAME, PG.DESIGNATION, PD.DEPARTEMENT AS DEPARTMENT, C.CATEGORYBN, C.CATEGORYEN FROM STR_PRODUCTSUMMARIES PS LEFT OUTER JOIN hrm.EMPLOYEE P ON PS.REQUISITIONFOR = P.EMPLOYE_ID LEFT OUTER JOIN hrm.DESIGNATION PG ON P.DESIGNATION_ID = PG.DESIGNATION_ID LEFT OUTER JOIN hrm.DEPARTMENT_LIST PD ON P.DEPARTEMENT_ID = PD.DEPARTEMENT_ID LEFT OUTER JOIN STR_CATEGORIES C ON PS.PROCAT = C.CAT_ID LEFT OUTER JOIN STR_STOREPRODUCTS SP ON PS.PRODUCTID = SP.PROID WHERE PS.PROCAT = ${Number(
      CATID
    )} ORDER BY PRODUCTNAME ASC, PROSUMID ASC`
  );
/*--------------------- End Product Logs Report ----------------- */

/*--------------------- Requisition Logs Report ----------------- */
const getRequisitionsByDate = (fdate, tdate) =>
  Execute(`SELECT PR.PRODATE, SP.PRONAME, SP.PRONAMETWO, PR.PROREQUQTY, PR.APROQTY, 
  PR.PREMARKS, E.NAME_BANGLA, E.NAME_ENGLISH, DL.DEPARTEMENT, DG.DESIGNATION FROM STR_PROREQUISITIONS PR
  LEFT OUTER JOIN HRM.EMPLOYEE E 
  ON PR.HRIDNO = E.EMPLOYE_ID 
  LEFT OUTER JOIN STR_STOREPRODUCTS SP 
  ON PR.PROID = SP.PROID 
  LEFT OUTER JOIN HRM.DEPARTMENT_LIST DL 
  ON E.DEPARTEMENT_ID = DL.DEPARTEMENT_ID 
  LEFT OUTER JOIN HRM.DESIGNATION DG 
  ON E.DESIGNATION_ID = DG.DESIGNATION_ID 
  WHERE PR.PRODATE >= '${fdate}' AND PR.PRODATE <= '${tdate}' AND PR.APROQTY != 0`);

const getRequisitionsByProduct = (proid) =>
  Execute(`SELECT PR.PRODATE, SP.PRONAME, SP.PRONAMETWO, PR.PROREQUQTY, PR.APROQTY, 
  PR.PREMARKS, E.NAME_BANGLA, E.NAME_ENGLISH, DL.DEPARTEMENT, DG.DESIGNATION FROM STR_PROREQUISITIONS PR
  LEFT OUTER JOIN HRM.EMPLOYEE E 
  ON PR.HRIDNO = E.EMPLOYE_ID 
  LEFT OUTER JOIN STR_STOREPRODUCTS SP 
  ON PR.PROID = SP.PROID 
  LEFT OUTER JOIN HRM.DEPARTMENT_LIST DL 
  ON E.DEPARTEMENT_ID = DL.DEPARTEMENT_ID 
  LEFT OUTER JOIN HRM.DESIGNATION DG 
  ON E.DESIGNATION_ID = DG.DESIGNATION_ID 
  WHERE PR.PROID = ${Number(proid)} AND PR.APROQTY != 0 ORDER BY PR.PROREQID DESC`);

const getRequisitionsByProductAndDate = (proid, fdate, tdate) =>
  Execute(`SELECT PR.PRODATE, SP.PRONAME, SP.PRONAMETWO, PR.PROREQUQTY, PR.APROQTY, 
  PR.PREMARKS, E.NAME_BANGLA, E.NAME_ENGLISH, DL.DEPARTEMENT, DG.DESIGNATION FROM STR_PROREQUISITIONS PR
  LEFT OUTER JOIN HRM.EMPLOYEE E  ON PR.HRIDNO = E.EMPLOYE_ID 
  LEFT OUTER JOIN STR_STOREPRODUCTS SP  ON PR.PROID = SP.PROID 
  LEFT OUTER JOIN HRM.DEPARTMENT_LIST DL  ON E.DEPARTEMENT_ID = DL.DEPARTEMENT_ID 
  LEFT OUTER JOIN HRM.DESIGNATION DG  ON E.DESIGNATION_ID = DG.DESIGNATION_ID 
  WHERE PR.PROID = ${Number(
    proid
  )} AND PR.PRODATE >= '${fdate}' AND PR.PRODATE <= '${tdate}' AND PR.APROQTY != 0`);

const getRequisitionsByPerson = (hrid) =>
  Execute(`SELECT PR.PRODATE, SP.PRONAME, SP.PRONAMETWO, PR.PROREQUQTY, PR.APROQTY, 
  PR.PREMARKS, E.NAME_BANGLA, E.NAME_ENGLISH, DL.DEPARTEMENT, DG.DESIGNATION FROM STR_PROREQUISITIONS PR
  LEFT OUTER JOIN HRM.EMPLOYEE E 
  ON PR.HRIDNO = E.EMPLOYE_ID 
  LEFT OUTER JOIN STR_STOREPRODUCTS SP 
  ON PR.PROID = SP.PROID 
  LEFT OUTER JOIN HRM.DEPARTMENT_LIST DL 
  ON E.DEPARTEMENT_ID = DL.DEPARTEMENT_ID 
  LEFT OUTER JOIN HRM.DESIGNATION DG 
  ON E.DESIGNATION_ID = DG.DESIGNATION_ID 
  WHERE PR.HRIDNO = ${Number(hrid)} AND PR.APROQTY != 0`);

const getRequisitionsByPersonAndDate = (hrid, fdate, tdate) =>
  Execute(`SELECT PR.PRODATE, SP.PRONAME, SP.PRONAMETWO, PR.PROREQUQTY, PR.APROQTY, 
  PR.PREMARKS, E.NAME_BANGLA, E.NAME_ENGLISH, DL.DEPARTEMENT, DG.DESIGNATION FROM STR_PROREQUISITIONS PR
  LEFT OUTER JOIN HRM.EMPLOYEE E 
  ON PR.HRIDNO = E.EMPLOYE_ID 
  LEFT OUTER JOIN STR_STOREPRODUCTS SP 
  ON PR.PROID = SP.PROID 
  LEFT OUTER JOIN HRM.DEPARTMENT_LIST DL 
  ON E.DEPARTEMENT_ID = DL.DEPARTEMENT_ID 
  LEFT OUTER JOIN HRM.DESIGNATION DG 
  ON E.DESIGNATION_ID = DG.DESIGNATION_ID 
  WHERE PR.HRIDNO = ${Number(
    hrid
  )} AND PR.PRODATE >= '${fdate}' AND PR.PRODATE <= '${tdate}' AND PR.APROQTY != 0`);

// User Requisition Report Start
//-------------------------------//
const getUserReqReportByDate = (hrid, fdate, tdate) =>
  Execute(`SELECT distinct(RE.REQID), RE.REQUITIME, RE.REQUIDATE, RE.REQUISTATUS,
  SUM(PR.PROREQUQTY) OVER(PARTITION BY RE.REQID) AS TOTAL_PROREQUQTY,
  SUM(PR.APROQTY) OVER(PARTITION BY RE.REQID) AS TOTAl_APROQTY,
  E.NAME_BANGLA, E.NAME_ENGLISH, DL.DEPARTEMENT, DG.DESIGNATION FROM STR_REQUISITIONS RE
  LEFT OUTER JOIN STR_PROREQUISITIONS PR
  ON RE.REQID = PR.REQUIID
  LEFT OUTER JOIN HRM.EMPLOYEE E
  ON RE.PROFILEHRID = E.EMPLOYE_ID
  LEFT OUTER JOIN HRM.DEPARTMENT_LIST DL
  ON E.DEPARTEMENT_ID = DL.DEPARTEMENT_ID
  LEFT OUTER JOIN HRM.DESIGNATION DG
  ON E.DESIGNATION_ID = DG.DESIGNATION_ID
  WHERE RE.PROFILEHRID = ${Number(
    hrid
  )} AND RE.REQUIDATE >= '${fdate}' AND RE.REQUIDATE <= '${tdate}' AND RE.REQUISTATUS = ${Number(
    3
  )}`);

const getUserReqReportByMonth = (hrid, month) => Execute(`SELECT distinct(RE.REQID), RE.REQUITIME, RE.REQUIDATE, RE.REQUISTATUS,
  SUM(PR.PROREQUQTY) OVER(PARTITION BY RE.REQID) AS TOTAL_PROREQUQTY,
  SUM(PR.APROQTY) OVER(PARTITION BY RE.REQID) AS TOTAl_APROQTY,
  E.NAME_BANGLA, E.NAME_ENGLISH, DL.DEPARTEMENT, DG.DESIGNATION FROM STR_REQUISITIONS RE
  LEFT OUTER JOIN STR_PROREQUISITIONS PR
  ON RE.REQID = PR.REQUIID
  LEFT OUTER JOIN HRM.EMPLOYEE E
  ON RE.PROFILEHRID = E.EMPLOYE_ID
  LEFT OUTER JOIN HRM.DEPARTMENT_LIST DL
  ON E.DEPARTEMENT_ID = DL.DEPARTEMENT_ID
  LEFT OUTER JOIN HRM.DESIGNATION DG
  ON E.DESIGNATION_ID = DG.DESIGNATION_ID
  WHERE RE.PROFILEHRID = ${Number(
  hrid
)} AND REQUIMONTH = '${month}' AND RE.REQUISTATUS = ${Number(3)}`);

const getUserReqReportByYear = (hrid, year) =>
  Execute(`SELECT distinct(RE.REQID), RE.REQUITIME, RE.REQUIDATE,
SUM(PR.PROREQUQTY) OVER(PARTITION BY RE.REQID) AS TOTAL_PROREQUQTY,
SUM(PR.APROQTY) OVER(PARTITION BY RE.REQID) AS TOTAl_APROQTY,
E.NAME_BANGLA, E.NAME_ENGLISH, DL.DEPARTEMENT, DG.DESIGNATION FROM STR_REQUISITIONS RE
LEFT OUTER JOIN STR_PROREQUISITIONS PR
ON RE.REQID = PR.REQUIID
LEFT OUTER JOIN HRM.EMPLOYEE E
ON RE.PROFILEHRID = E.EMPLOYE_ID
LEFT OUTER JOIN HRM.DEPARTMENT_LIST DL
ON E.DEPARTEMENT_ID = DL.DEPARTEMENT_ID
LEFT OUTER JOIN HRM.DESIGNATION DG
ON E.DESIGNATION_ID = DG.DESIGNATION_ID
WHERE RE.PROFILEHRID = ${Number(hrid)} AND REQUIMONTH LIKE('%${year}%')`);

//view
const getUserSingleReqView = (hrid, requestid) =>
  Execute(`SELECT RE.REQUISITIONNO, PR.REQUIID, SP.PRONAME, SP.PRONAMETWO, RE.REQUITIME, RE.REQUIDATE, PR.PROREQUQTY, PR.APROQTY, PR.PREMARKS,
E.NAME_BANGLA, E.NAME_ENGLISH, DL.DEPARTEMENT, DG.DESIGNATION, E.MOBILE_PHONE FROM STR_REQUISITIONS RE
LEFT OUTER JOIN STR_PROREQUISITIONS PR
ON RE.REQID = PR.REQUIID
LEFT OUTER JOIN STR_STOREPRODUCTS SP
ON PR.PROID = SP.PROID
LEFT OUTER JOIN HRM.EMPLOYEE E 
ON RE.PROFILEHRID = E.EMPLOYE_ID
LEFT OUTER JOIN HRM.DEPARTMENT_LIST DL 
ON E.DEPARTEMENT_ID = DL.DEPARTEMENT_ID 
LEFT OUTER JOIN HRM.DESIGNATION DG 
ON E.DESIGNATION_ID = DG.DESIGNATION_ID 
WHERE RE.PROFILEHRID = ${Number(hrid)} AND PR.REQUIID = ${Number(requestid)}`);


/*--------------------- End Requisition Logs Report ----------------- */

/*-------------------------------------------------END SELECT ---------------------------------------------------*/

module.exports = {
  getAllEntriesReports,
  getSingleEntriesReports,
  getSingleEntriesReportsWHDate,
  stockStatus,
  stockStatusByCatId,
  getProductSummariesByProductid,
  getProductSummariesBySummMonth,
  getProductSummariesByCatId,
  getProductSummariesBySummMonthAndCatId,
  getRequisitionsByDate,
  getRequisitionsByProduct,
  getRequisitionsByProductAndDate,
  getRequisitionsByPerson,
  getRequisitionsByPersonAndDate,
  getUserReqReportByDate,
  getUserReqReportByMonth,
  getUserReqReportByYear,
  getUserSingleReqView,
};
