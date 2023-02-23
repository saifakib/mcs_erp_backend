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
      WHERE trunc(pel.ENTRY_DATE) BETWEEN TO_DATE('${fdate}','YYYY-MM-DD') AND TO_DATE('${tdate}','YYYY-MM-DD') ORDER BY pel.PRO_EN_L_ID`
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
    WHERE trunc(pel.ENTRY_DATE) BETWEEN TO_DATE('${fdate}','YYYY-MM-DD') and TO_DATE('${tdate}','YYYY-MM-DD') and pl.PRODUCT_ID = ${Number(productidno)} order by  pel.PRO_EN_L_ID`
  );

const selectRequisitionByDate = (fdate, tdate) =>
  ExecuteIT(`SELECT PL.PRODUCT_NAME, E.NAME_ENGLISH, E.DEPARTEMENT, E.DESIGNATION,
  TO_CHAR(REQ_DATE,'MON DD,YYYY') AS DATES, P.QUNTITY AS REQ_QTY, P.APR_QTY FROM REQUISITION R 
  LEFT OUTER JOIN PRO_REQUISITION P ON R.REQ_ID = P.REQ_ID
  LEFT OUTER JOIN VIEW_EMP_DETAILS E ON E.EMPLOYE_ID = R.HR_ID
  LEFT OUTER JOIN PRODUCT_LIST PL ON PL.PRODUCT_ID = P.PRO_ID
  WHERE trunc(R.REQ_DATE) BETWEEN TO_DATE('${fdate}','YYYY-MM-DD') AND TO_DATE('${tdate}','YYYY-MM-DD')`);


const selectRequisitionByProdDate = (product_id, fdate, tdate) =>
  ExecuteIT(` SELECT PL.PRODUCT_NAME, E.NAME_ENGLISH , E.DEPARTEMENT, E.DESIGNATION,
  TO_CHAR(REQ_DATE,'MON DD,YYYY') AS DATES, P.QUNTITY AS REQ_QTY, P.APR_QTY FROM REQUISITION R 
  LEFT OUTER JOIN PRO_REQUISITION P ON R.REQ_ID = P.REQ_ID
  LEFT OUTER JOIN VIEW_EMP_DETAILS E ON E.EMPLOYE_ID = R.HR_ID
  LEFT OUTER JOIN PRODUCT_LIST PL  ON PL.PRODUCT_ID = P.PRO_ID
  WHERE trunc(R.REQ_DATE) BETWEEN TO_DATE('${fdate}','YYYY-MM-DD') AND TO_DATE('${tdate}','YYYY-MM-DD')
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
  WHERE trunc(R.REQ_DATE) BETWEEN TO_DATE('${fdate}','YYYY-MM-DD')  AND TO_DATE('${tdate}','YYYY-MM-DD')
  AND R.HR_ID = ${Number(hrid)}`);

const selectProductListRequisitions = () => ExecuteIT(`SELECT DISTINCT PL.PRODUCT_ID,  PL.* FROM IND_PRO_REQUISITION INP
LEFT OUTER JOIN STORE_PRODUCTS SP ON SP.STR_PRO_ID = INP.STR_PRO_ID
LEFT OUTER JOIN PRODUCT_LIST PL ON PL.PRODUCT_ID = SP.PRO_ID`);

const selectProductRequisitionsByProId = (pro_id) => ExecuteIT(`SELECT DISTINCT INP.IND_PRODUCT_ID,  IP.* FROM IND_PRO_REQUISITION INP
LEFT OUTER JOIN IND_PRODUCT IP ON IP.IND_PRODUCT_ID = INP.IND_PRODUCT_ID
LEFT OUTER JOIN STORE_PRODUCTS SP ON SP.STR_PRO_ID = INP.STR_PRO_ID WHERE SP.PRO_ID = ${Number(pro_id)}`);

const selectIndividualProdRequisitions = (ind_prod_id) => ExecuteIT(`SELECT IPR.PRO_REQ_ID, PR.REQ_ID, TO_CHAR(R.REQ_DATE,'DD-MM-YYYY') AS REQ_DATE, VE.*  FROM   IND_PRO_REQUISITION IPR 
  LEFT OUTER JOIN PRO_REQUISITION PR ON PR.PRO_REQ_ID = IPR.PRO_REQ_ID
  LEFT OUTER JOIN REQUISITION R ON R.REQ_ID = PR.REQ_ID
  LEFT OUTER JOIN VIEW_EMP_DETAILS VE ON VE.EMPLOYE_ID = R.HR_ID
  LEFT OUTER JOIN STORE_PRODUCTS SP ON SP.STR_PRO_ID = R.HR_ID
  WHERE IPR.IND_PRODUCT_ID = ${Number(ind_prod_id)} ORDER BY IPR.PRO_REQ_ID DESC`);

const selectMaintananceByDate = (fdate, tdate) => ExecuteIT(`SELECT M.MAINTENANCE_ID, M.HR_ID, TO_CHAR(M.REQ_DATE,'DD-MM-YYYY') AS REQ_DATE, E.NAME_ENGLISH, E.DEPARTEMENT, E.DESIGNATION, C.CATEGORY_NAME,
  PL.PRODUCT_NAME, B.BRAND_NAME, MD.MODEL_NAME, U.UNIT_ID, U.UNIT_NAME, IP.UNIQUE_V, M.COST,
  CASE
      WHEN M.STATUS = 0 THEN 'Pending'
      WHEN M.STATUS = 1 THEN 'Approved'
      WHEN M.STATUS = 2 THEN 'Accepted'
      WHEN M.STATUS = 3 THEN 'Servicing'
      WHEN M.STATUS = 4 THEN 'Servicing Back'
      WHEN M.STATUS = 5 THEN 'Dead'
      WHEN M.STATUS = 6 THEN 'Notify User'
      WHEN M.STATUS = 7 THEN 'User Accepted'
  END STATUSS
  FROM MAINTENANCE M 
  LEFT OUTER JOIN VIEW_EMP_DETAILS E ON M.HR_ID = E.EMPLOYE_ID
  LEFT OUTER JOIN IND_PRODUCT I ON M.IND_PRO_ID = I.IND_PRODUCT_ID
  LEFT OUTER JOIN STORE_PRODUCTS S ON S.STR_PRO_ID = I.STR_PRO_ID
  LEFT  OUTER JOIN PRODUCT_LIST PL ON PL.PRODUCT_ID = S.PRO_ID
  LEFT OUTER JOIN CATEGORIES C ON C.CATEGORY_ID = PL.CATEGORY_ID
  LEFT OUTER JOIN MODELS MD ON MD.MODEL_ID = S.MODEL_ID
  LEFT OUTER JOIN IND_PRODUCT IP ON IP.IND_PRODUCT_ID = M.IND_PRO_ID
  LEFT OUTER JOIN BRAND B ON B.BRAND_ID = S.BRAND_ID
  LEFT OUTER JOIN UNIT U ON U.UNIT_ID = S.UNIT_ID
  WHERE trunc(M.REQ_DATE) BETWEEN TO_DATE('${fdate}','YYYY-MM-DD') AND TO_DATE('${tdate}','YYYY-MM-DD')`);


const selectMaintananceByProDate = (product_id, fdate, tdate, have, ind_prod_id) => {
  if (have) {
    return ExecuteIT(`SELECT M.MAINTENANCE_ID, M.HR_ID, TO_CHAR(M.REQ_DATE,'DD-MM-YYYY')  AS REQ_DATE, E.NAME_ENGLISH, E.DEPARTEMENT, E.DESIGNATION, C.CATEGORY_NAME,
    PL.PRODUCT_NAME, B.BRAND_NAME, MD.MODEL_NAME, U.UNIT_ID, U.UNIT_NAME, IP.UNIQUE_V, M.COST,
    CASE
        WHEN M.STATUS = 0 THEN 'Pending'
        WHEN M.STATUS = 1 THEN 'Approved'
        WHEN M.STATUS = 2 THEN 'Accepted'
        WHEN M.STATUS = 3 THEN 'Servicing'
        WHEN M.STATUS = 4 THEN 'Servicing Back'
        WHEN M.STATUS = 5 THEN 'Dead'
        WHEN M.STATUS = 6 THEN 'Notify User'
        WHEN M.STATUS = 7 THEN 'User Accepted'
    END STATUSS
    FROM MAINTENANCE M 
    LEFT OUTER JOIN VIEW_EMP_DETAILS E ON M.HR_ID = E.EMPLOYE_ID
    LEFT OUTER JOIN IND_PRODUCT I ON M.IND_PRO_ID = I.IND_PRODUCT_ID
    LEFT OUTER JOIN STORE_PRODUCTS S ON S.STR_PRO_ID = I.STR_PRO_ID
    LEFT  OUTER JOIN PRODUCT_LIST PL ON PL.PRODUCT_ID = S.PRO_ID
    LEFT OUTER JOIN CATEGORIES C ON C.CATEGORY_ID = PL.CATEGORY_ID
    LEFT OUTER JOIN MODELS MD ON MD.MODEL_ID = S.MODEL_ID
    LEFT OUTER JOIN IND_PRODUCT IP ON IP.IND_PRODUCT_ID = M.IND_PRO_ID
    LEFT OUTER JOIN BRAND B ON B.BRAND_ID = S.BRAND_ID
    LEFT OUTER JOIN UNIT U ON U.UNIT_ID = S.UNIT_ID
    WHERE trunc(M.REQ_DATE) BETWEEN TO_DATE('${fdate}','YYYY-MM-DD') AND TO_DATE('${tdate}','YYYY-MM-DD') AND PL.PRODUCT_ID=${product_id} AND I.IND_PRODUCT_ID = ${Number(ind_prod_id)}`);
  } else {
    return ExecuteIT(`SELECT M.MAINTENANCE_ID, M.HR_ID, TO_CHAR(M.REQ_DATE,'DD-MM-YYYY')  AS REQ_DATE, E.NAME_ENGLISH, E.DEPARTEMENT, E.DESIGNATION, C.CATEGORY_NAME,
    PL.PRODUCT_NAME, B.BRAND_NAME, MD.MODEL_NAME, U.UNIT_ID, U.UNIT_NAME, IP.UNIQUE_V, M.COST,
    CASE
        WHEN M.STATUS = 0 THEN 'Pending'
        WHEN M.STATUS = 1 THEN 'Approved'
        WHEN M.STATUS = 2 THEN 'Accepted'
        WHEN M.STATUS = 3 THEN 'Servicing'
        WHEN M.STATUS = 4 THEN 'Servicing Back'
        WHEN M.STATUS = 5 THEN 'Dead'
        WHEN M.STATUS = 6 THEN 'Notify User'
        WHEN M.STATUS = 7 THEN 'User Accepted'
    END STATUSS
    FROM MAINTENANCE M 
    LEFT OUTER JOIN VIEW_EMP_DETAILS E ON M.HR_ID = E.EMPLOYE_ID
    LEFT OUTER JOIN IND_PRODUCT I ON M.IND_PRO_ID = I.IND_PRODUCT_ID
    LEFT OUTER JOIN STORE_PRODUCTS S ON S.STR_PRO_ID = I.STR_PRO_ID
    LEFT  OUTER JOIN PRODUCT_LIST PL ON PL.PRODUCT_ID = S.PRO_ID
    LEFT OUTER JOIN CATEGORIES C ON C.CATEGORY_ID = PL.CATEGORY_ID
    LEFT OUTER JOIN MODELS MD ON MD.MODEL_ID = S.MODEL_ID
    LEFT OUTER JOIN IND_PRODUCT IP ON IP.IND_PRODUCT_ID = M.IND_PRO_ID
    LEFT OUTER JOIN BRAND B ON B.BRAND_ID = S.BRAND_ID
    LEFT OUTER JOIN UNIT U ON U.UNIT_ID = S.UNIT_ID
    WHERE trunc(M.REQ_DATE) BETWEEN TO_DATE('${fdate}','YYYY-MM-DD') AND TO_DATE('${tdate}','YYYY-MM-DD') AND PL.PRODUCT_ID=${product_id}`);
  }
}

const selectMaintananceByProId = (product_id, have, ind_prod_id) => {
  if (have) {
    return ExecuteIT(`SELECT M.MAINTENANCE_ID, M.HR_ID, TO_CHAR(M.REQ_DATE,'DD-MM-YYYY')  AS REQ_DATE, E.NAME_ENGLISH, E.DEPARTEMENT, E.DESIGNATION, C.CATEGORY_NAME,
    PL.PRODUCT_NAME, B.BRAND_NAME, MD.MODEL_NAME, U.UNIT_ID, U.UNIT_NAME, IP.UNIQUE_V, M.COST,
    CASE
        WHEN M.STATUS = 0 THEN 'Pending'
        WHEN M.STATUS = 1 THEN 'Approved'
        WHEN M.STATUS = 2 THEN 'Accepted'
        WHEN M.STATUS = 3 THEN 'Servicing'
        WHEN M.STATUS = 4 THEN 'Servicing Back'
        WHEN M.STATUS = 5 THEN 'Dead'
        WHEN M.STATUS = 6 THEN 'Notify User'
        WHEN M.STATUS = 7 THEN 'User Accepted'
    END STATUSS
    FROM MAINTENANCE M 
    LEFT OUTER JOIN VIEW_EMP_DETAILS E ON M.HR_ID = E.EMPLOYE_ID
    LEFT OUTER JOIN IND_PRODUCT I ON M.IND_PRO_ID = I.IND_PRODUCT_ID
    LEFT OUTER JOIN STORE_PRODUCTS S ON S.STR_PRO_ID = I.STR_PRO_ID
    LEFT  OUTER JOIN PRODUCT_LIST PL ON PL.PRODUCT_ID = S.PRO_ID
    LEFT OUTER JOIN CATEGORIES C ON C.CATEGORY_ID = PL.CATEGORY_ID
    LEFT OUTER JOIN MODELS MD ON MD.MODEL_ID = S.MODEL_ID
    LEFT OUTER JOIN IND_PRODUCT IP ON IP.IND_PRODUCT_ID = M.IND_PRO_ID
    LEFT OUTER JOIN BRAND B ON B.BRAND_ID = S.BRAND_ID
    LEFT OUTER JOIN UNIT U ON U.UNIT_ID = S.UNIT_ID
    WHERE PL.PRODUCT_ID=${product_id} AND I.IND_PRODUCT_ID = ${Number(ind_prod_id)}`);
  } else {
    return ExecuteIT(`SELECT M.MAINTENANCE_ID, M.HR_ID, TO_CHAR(M.REQ_DATE,'DD-MM-YYYY')  AS REQ_DATE, E.NAME_ENGLISH, E.DEPARTEMENT, E.DESIGNATION, C.CATEGORY_NAME,
    PL.PRODUCT_NAME, B.BRAND_NAME, MD.MODEL_NAME, U.UNIT_ID, U.UNIT_NAME, IP.UNIQUE_V, M.COST,
    CASE
        WHEN M.STATUS = 0 THEN 'Pending'
        WHEN M.STATUS = 1 THEN 'Approved'
        WHEN M.STATUS = 2 THEN 'Accepted'
        WHEN M.STATUS = 3 THEN 'Servicing'
        WHEN M.STATUS = 4 THEN 'Servicing Back'
        WHEN M.STATUS = 5 THEN 'Dead'
        WHEN M.STATUS = 6 THEN 'Notify User'
        WHEN M.STATUS = 7 THEN 'User Accepted'
    END STATUSS
    FROM MAINTENANCE M 
    LEFT OUTER JOIN VIEW_EMP_DETAILS E ON M.HR_ID = E.EMPLOYE_ID
    LEFT OUTER JOIN IND_PRODUCT I ON M.IND_PRO_ID = I.IND_PRODUCT_ID
    LEFT OUTER JOIN STORE_PRODUCTS S ON S.STR_PRO_ID = I.STR_PRO_ID
    LEFT  OUTER JOIN PRODUCT_LIST PL ON PL.PRODUCT_ID = S.PRO_ID
    LEFT OUTER JOIN CATEGORIES C ON C.CATEGORY_ID = PL.CATEGORY_ID
    LEFT OUTER JOIN MODELS MD ON MD.MODEL_ID = S.MODEL_ID
    LEFT OUTER JOIN IND_PRODUCT IP ON IP.IND_PRODUCT_ID = M.IND_PRO_ID
    LEFT OUTER JOIN BRAND B ON B.BRAND_ID = S.BRAND_ID
    LEFT OUTER JOIN UNIT U ON U.UNIT_ID = S.UNIT_ID
    WHERE PL.PRODUCT_ID=${product_id}`);
  }
}

const selectMaintananceByHrDate = (hrid, fdate, tdate) => ExecuteIT(`SELECT M.MAINTENANCE_ID, M.HR_ID,  TO_CHAR(M.REQ_DATE,'DD-MM-YYYY')  AS REQ_DATE, E.NAME_ENGLISH, E.DEPARTEMENT, E.DESIGNATION, C.CATEGORY_NAME,
  PL.PRODUCT_NAME, B.BRAND_NAME, MD.MODEL_NAME, U.UNIT_ID, U.UNIT_NAME, IP.UNIQUE_V, M.COST,
  CASE
      WHEN M.STATUS = 0 THEN 'Pending'
      WHEN M.STATUS = 1 THEN 'Approved'
      WHEN M.STATUS = 2 THEN 'Accepted'
      WHEN M.STATUS = 3 THEN 'Servicing'
      WHEN M.STATUS = 4 THEN 'Servicing Back'
      WHEN M.STATUS = 5 THEN 'Dead'
      WHEN M.STATUS = 6 THEN 'Notify User'
      WHEN M.STATUS = 7 THEN 'User Accepted'
  END STATUSS
  FROM MAINTENANCE M 
  LEFT OUTER JOIN VIEW_EMP_DETAILS E ON M.HR_ID = E.EMPLOYE_ID
  LEFT OUTER JOIN IND_PRODUCT I ON M.IND_PRO_ID = I.IND_PRODUCT_ID
  LEFT OUTER JOIN STORE_PRODUCTS S ON S.STR_PRO_ID = I.STR_PRO_ID
  LEFT  OUTER JOIN PRODUCT_LIST PL ON PL.PRODUCT_ID = S.PRO_ID
  LEFT OUTER JOIN CATEGORIES C ON C.CATEGORY_ID = PL.CATEGORY_ID
  LEFT OUTER JOIN MODELS MD ON MD.MODEL_ID = S.MODEL_ID
  LEFT OUTER JOIN IND_PRODUCT IP ON IP.IND_PRODUCT_ID = M.IND_PRO_ID
  LEFT OUTER JOIN BRAND B ON B.BRAND_ID = S.BRAND_ID
  LEFT OUTER JOIN UNIT U ON U.UNIT_ID = S.UNIT_ID
  WHERE trunc(M.REQ_DATE) BETWEEN TO_DATE('${fdate}','YYYY-MM-DD') AND TO_DATE('${tdate}','YYYY-MM-DD') AND M.HR_ID=${hrid}`);

const selectMaintananceByHrId = (hrid) => ExecuteIT(`SELECT M.MAINTENANCE_ID, M.HR_ID,  TO_CHAR(M.REQ_DATE,'DD-MM-YYYY')  AS REQ_DATE, E.NAME_ENGLISH, E.DEPARTEMENT, E.DESIGNATION, C.CATEGORY_NAME,
  PL.PRODUCT_NAME, B.BRAND_NAME, MD.MODEL_NAME, U.UNIT_ID, U.UNIT_NAME, IP.UNIQUE_V, M.COST,
  CASE
      WHEN M.STATUS = 0 THEN 'Pending'
      WHEN M.STATUS = 1 THEN 'Approved'
      WHEN M.STATUS = 2 THEN 'Accepted'
      WHEN M.STATUS = 3 THEN 'Servicing'
      WHEN M.STATUS = 4 THEN 'Servicing Back'
      WHEN M.STATUS = 5 THEN 'Dead'
      WHEN M.STATUS = 6 THEN 'Notify User'
      WHEN M.STATUS = 7 THEN 'User Accepted'
  END STATUSS
  FROM MAINTENANCE M 
  LEFT OUTER JOIN VIEW_EMP_DETAILS E ON M.HR_ID = E.EMPLOYE_ID
  LEFT OUTER JOIN IND_PRODUCT I ON M.IND_PRO_ID = I.IND_PRODUCT_ID
  LEFT OUTER JOIN STORE_PRODUCTS S ON S.STR_PRO_ID = I.STR_PRO_ID
  LEFT  OUTER JOIN PRODUCT_LIST PL ON PL.PRODUCT_ID = S.PRO_ID
  LEFT OUTER JOIN CATEGORIES C ON C.CATEGORY_ID = PL.CATEGORY_ID
  LEFT OUTER JOIN MODELS MD ON MD.MODEL_ID = S.MODEL_ID
  LEFT OUTER JOIN IND_PRODUCT IP ON IP.IND_PRODUCT_ID = M.IND_PRO_ID
  LEFT OUTER JOIN BRAND B ON B.BRAND_ID = S.BRAND_ID
  LEFT OUTER JOIN UNIT U ON U.UNIT_ID = S.UNIT_ID
  WHERE M.HR_ID=${hrid}`);



const selectSpecificationsByIndProdId = (ind_prod_id) => ExecuteIT(`SELECT M.MODEL_NAME, S.NAME, S.S_VALUE FROM SPECIFICATION S 
  LEFT OUTER JOIN MODELS M ON S.MODEL_ID = M.MODEL_ID
  LEFT OUTER JOIN STORE_PRODUCTS SP ON SP.MODEL_ID = M.MODEL_ID
  LEFT OUTER JOIN IND_PRODUCT IP ON IP.STR_PRO_ID = SP.STR_PRO_ID
  WHERE IP.IND_PRODUCT_ID =${ind_prod_id}`);


const selectChangesSpecificationsByIndProdId = (ind_prod_id) => ExecuteIT(`SELECT M.MAINTENANCE_ID, TO_CHAR(M.REQ_DATE,'DD-MM-YYYY') AS REQ_DATE, M.COST, CS.NAME, CS.S_VALUE FROM CUS_SPECIFICATION CS
  LEFT OUTER JOIN MAINTENANCE M ON M.MAINTENANCE_ID = CS.MAINTENANCE_ID WHERE IND_PROD_ID =${ind_prod_id}`);




/*--------------------- End Entries Report ----------------- */


/*--------------------------------END SELECT --------------------------------*/

module.exports = {
  selectAllEntriesReports,
  selectsingleEntriesReports,
  selectRequisitionByDate,
  selectRequisitionByProdDate,
  selectRequisitionByProId,
  selectRequisitionByHrid,
  selectRequisitionByDateHrid,
  selectIndividualProdRequisitions,
  selectMaintananceByDate,
  selectMaintananceByProDate,
  selectMaintananceByProId,
  selectMaintananceByHrDate,
  selectMaintananceByHrId,
  selectSpecificationsByIndProdId,
  selectProductListRequisitions,
  selectProductRequisitionsByProId,
  selectChangesSpecificationsByIndProdId

};
