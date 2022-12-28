const { ExecuteIT } = require("../../../utils/itDynamicController");

/*-------------------------------- SELECT --------------------------------*/

/*--------------------- Entries Report ----------------- */
const selectAllEntriesReports = (fdate, tdate) =>
  ExecuteIT(
    `SELECT pel.PRO_EN_L_ID, pel.pro_id, TO_CHAR(pel.ENTRY_DATE,'DD-MON-YYYY') AS Dates,  b.brand_name,m.model_name,
      s.SUP_NAME,  c.CATEGORY_NAME, pl.PRODUCT_NAME, pel.QUANTITES, pel.amount, pel.QUANTITES*pel.amount as Total_amount
      FROM PRODUCT_ENTRY_LIST PEL LEFT OUTER JOIN STORE_PRODUCTS sp on sp.str_pro_id = pel.str_pro_id
      left outer join PRODUCT_LIST pl on pl.product_id = sp.pro_id
      left outer join  CATEGORIES c on c.category_id = pl.category_id
      left outer join SUPPLIERS s on s.SUPPLIER_ID = pel.sup_id
      left outer join brand b on b.brand_id = sp.brand_id
      left outer join models m on m.model_id = sp.model_id
      WHERE pel.ENTRY_DATE >= TO_DATE('${fdate}','YYYY-MM-DD') + 6   and
      pel.ENTRY_DATE <= TO_DATE('${tdate}','YYYY-MM-DD') + 6 order by pel.PRO_EN_L_ID`
  );

const selectsingleEntriesReports = (productidno, fdate, tdate) =>
  ExecuteIT(
    `SELECT pel.PRO_EN_L_ID, pel.pro_id, TO_CHAR(pel.ENTRY_DATE,'DD-MON-YYYY') AS Dates,  b.brand_name,m.model_name,
    s.SUP_NAME,  c.CATEGORY_NAME, pl.PRODUCT_NAME, pel.QUANTITES, pel.amount, pel.QUANTITES*pel.amount as Total_amount
    FROM PRODUCT_ENTRY_LIST PEL LEFT OUTER JOIN STORE_PRODUCTS sp on sp.str_pro_id = pel.str_pro_id
    left outer join PRODUCT_LIST pl on pl.product_id = sp.pro_id
    left outer join  CATEGORIES c on c.category_id = pl.category_id
    left outer join SUPPLIERS s on s.SUPPLIER_ID = pel.sup_id
    left outer join brand b on b.brand_id = sp.brand_id
      left outer join models m on m.model_id = sp.model_id
    WHERE pel.ENTRY_DATE >= TO_DATE('${fdate}','YYYY-MM-DD') + 6 and
    pel.ENTRY_DATE <= TO_DATE('${tdate}','YYYY-MM-DD') + 6 and pl.PRODUCT_ID = ${Number(productidno)} order by  pel.PRO_EN_L_ID`
  );

const selectRequisitionByDate = (fdate, tdate) =>
  ExecuteIT(`SELECT PL.PRODUCT_NAME, E.NAME_ENGLISH, E.DEPARTEMENT, E.DESIGNATION,
  TO_CHAR(REQ_DATE,'MON DD,YYYY') AS DATES, P.QUNTITY AS REQ_QTY, P.APR_QTY FROM REQUISITION R 
  LEFT OUTER JOIN PRO_REQUISITION P ON R.REQ_ID = P.REQ_ID
  LEFT OUTER JOIN VIEW_EMP_DETAILS E ON E.EMPLOYE_ID = R.HR_ID
  LEFT OUTER JOIN PRODUCT_LIST PL ON PL.PRODUCT_ID = P.PRO_ID
  WHERE R.REQ_DATE >= TO_DATE('${fdate}','YYYY-MM-DD') + 6  AND R.REQ_DATE <= TO_DATE('${tdate}','YYYY-MM-DD') + 6`);


const selectRequisitionByProdDate = (product_id, fdate, tdate) =>
  ExecuteIT(` SELECT PL.PRODUCT_NAME, E.NAME_ENGLISH , E.DEPARTEMENT, E.DESIGNATION,
  TO_CHAR(REQ_DATE,'MON DD,YYYY') AS DATES, P.QUNTITY AS REQ_QTY, P.APR_QTY FROM REQUISITION R 
  LEFT OUTER JOIN PRO_REQUISITION P ON R.REQ_ID = P.REQ_ID
  LEFT OUTER JOIN VIEW_EMP_DETAILS E ON E.EMPLOYE_ID = R.HR_ID
  LEFT OUTER JOIN PRODUCT_LIST PL  ON PL.PRODUCT_ID = P.PRO_ID
  WHERE R.REQ_DATE >= TO_DATE('${fdate}','YYYY-MM-DD') + 6  AND R.REQ_DATE <= TO_DATE('${tdate}','YYYY-MM-DD') + 6
  AND PL.PRODUCT_ID = ${Number(product_id)}`);

const selectRequisitionByProId = (product_id) =>
  ExecuteIT(`SELECT PL.PRODUCT_NAME, E.NAME_ENGLISH ,E.DEPARTEMENT, E.DESIGNATION, TO_CHAR(REQ_DATE,'MON DD,YYYY') AS DATES,
  P.QUNTITY AS REQ_QTY, P.APR_QTY FROM REQUISITION R 
  LEFT OUTER JOIN PRO_REQUISITION P ON R.REQ_ID = P.REQ_ID
  LEFT OUTER JOIN VIEW_EMP_DETAILS E ON E.EMPLOYE_ID = R.HR_ID
  LEFT OUTER JOIN PRODUCT_LIST PL ON PL.PRODUCT_ID = P.PRO_ID
  WHERE PL.PRODUCT_ID = ${Number(product_id)}`);

const selectRequisitionByHrid = (hrid) =>
  ExecuteIT(`SELECT PL.PRODUCT_NAME, E.NAME_ENGLISH, E.DEPARTEMENT, E.DESIGNATION,
  TO_CHAR(REQ_DATE,'MON DD,YYYY') AS DATES, P.QUNTITY AS REQ_QTY, P.APR_QTY FROM REQUISITION R 
  LEFT OUTER JOIN PRO_REQUISITION P ON R.REQ_ID = P.REQ_ID
  LEFT OUTER JOIN VIEW_EMP_DETAILS E ON E.EMPLOYE_ID = R.HR_ID
  LEFT OUTER JOIN PRODUCT_LIST PL ON PL.PRODUCT_ID = P.PRO_ID WHERE R.HR_ID = ${Number(hrid)}`);

const selectRequisitionByDateHrid = (hrid, fdate, tdate) =>
  ExecuteIT(`SELECT PL.PRODUCT_NAME, E.NAME_ENGLISH, E.DEPARTEMENT, E.DESIGNATION,
  TO_CHAR(REQ_DATE,'MON DD,YYYY') AS DATES, P.QUNTITY AS REQ_QTY, P.APR_QTY FROM REQUISITION R 
  LEFT OUTER JOIN PRO_REQUISITION P ON R.REQ_ID = P.REQ_ID
  LEFT OUTER JOIN VIEW_EMP_DETAILS E ON E.EMPLOYE_ID = R.HR_ID
  LEFT OUTER JOIN PRODUCT_LIST PL ON PL.PRODUCT_ID = P.PRO_ID 
  WHERE R.REQ_DATE >= TO_DATE('${fdate}','YYYY-MM-DD') + 6  AND R.REQ_DATE <= TO_DATE('${tdate}','YYYY-MM-DD') + 6
  AND R.HR_ID = ${Number(hrid)}`)

/*--------------------- End Entries Report ----------------- */


/*--------------------------------END SELECT --------------------------------*/

module.exports = {
  selectAllEntriesReports,
  selectsingleEntriesReports,
  selectRequisitionByDate,
  selectRequisitionByProdDate,
  selectRequisitionByProId,
  selectRequisitionByHrid,
  selectRequisitionByDateHrid
};
