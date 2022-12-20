const { ExecuteIT, ExecuteITMany } = require("../../../utils/itDynamicController");
const { oracledb } = require("../../../db/db");
/*------------- SELECT ------------*/

// const selectProductBalance = (str_pro_id) =>
//   ExecuteIT(`SELECT QUANTITY FROM STORE_PRODUCTS WHERE STR_PRO_ID = ${Number(str_pro_id)}`);

const selectIndProductList = (str_pro_id, status) => ExecuteIT(`SELECT * FROM IND_PRODUCT WHERE STR_PRO_ID = ${Number(str_pro_id)} AND STATUS = ${Number(status)}`);

const selectUserRequisitions = (user_id) =>
  ExecuteIT(`SELECT distinct(R.REQ_ID), R.HR_ID, R.USER_REMARKS, R.STR_REMARKS, TO_CHAR(R.REQ_DATE,'DD-MM-YYYY') AS REQ_DATE, D.DEPARTEMENT, DE.DESIGNATION,
  case
    when R.REQ_STATUS = 0 then 'Pending'
    when R.REQ_STATUS = 1 then 'Approved'
    when R.REQ_STATUS = 2 then 'Accepted'
    when R.REQ_STATUS = 3 then 'Denied'
  end Status,
  sum(PR.QUNTITY) over(partition by (PR.REQ_ID)) as REQQUNTITY, sum(PR.APR_QTY) over(partition by (PR.REQ_ID)) as APR_QTY
  FROM REQUISITION R LEFT OUTER JOIN PRO_REQUISITION PR ON R.REQ_ID = PR.REQ_ID
  LEFT OUTER JOIN  hrm.EMPLOYEE E ON E.EMPLOYE_ID = R.HR_ID
  LEFT OUTER JOIN hrm.DEPARTMENT_LIST D ON E.DEPARTEMENT_ID = D.DEPARTEMENT_ID 
  LEFT OUTER JOIN hrm.DESIGNATION DE ON DE.DESIGNATION_ID = E.DESIGNATION_ID WHERE R.HR_ID=${Number(user_id)}`);

const selectUserAcceptRequisitions = (user_id) =>
  ExecuteIT(`SELECT I.IND_PRO_ID AS IND_PRO_REQ_ID, I.STR_PRO_ID, R.HR_ID, IP.IND_PRODUCT_ID, PL.PRODUCT_NAME, IP.UNIQUE_V, B.BRAND_NAME, M.MODEL_NAME, C.CATEGORY_NAME, I.STATUS FROM IND_PRO_REQUISITION I 
  LEFT OUTER JOIN IND_PRODUCT IP ON IP.IND_PRODUCT_ID = I.IND_PRODUCT_ID 
  LEFT OUTER JOIN PRO_REQUISITION P ON P.PRO_REQ_ID  = I.PRO_REQ_ID 
  LEFT OUTER JOIN REQUISITION R ON R.REQ_ID = P.REQ_ID 
  LEFT OUTER JOIN PRODUCT_LIST PL ON PL.PRODUCT_ID = P.PRO_ID
  LEFT OUTER JOIN STORE_PRODUCTS SP ON SP.STR_PRO_ID = I.STR_PRO_ID
  LEFT OUTER JOIN BRAND B ON B.BRAND_ID = SP.BRAND_ID
  LEFT OUTER JOIN MODELS M ON M.MODEL_ID = SP.MODEL_ID
  LEFT OUTER JOIN CATEGORIES C ON C.CATEGORY_ID = PL.CATEGORY_ID
  WHERE R.REQ_STATUS = 2 AND R.HR_ID =  ${Number(user_id)}`);


// get pending requisitions
const selectStatusRequisitions = (status) => ExecuteIT(`SELECT DISTINCT(R.REQ_ID), TO_CHAR(R.REQ_DATE, 'DD-MM-YYYY') AS REQ_DATE, 
TO_CHAR(R.REQ_DATE, 'hh12:mi am') AS REQ_TIME, E.NAME_ENGLISH, D.DEPARTEMENT, DG.DESIGNATION, 
sum(PR.QUNTITY) over(partition by (PR.REQ_ID)) as REQ_QTY, sum(PR.APR_QTY) over(partition by (PR.REQ_ID)) as APR_QTY FROM REQUISITION R 
LEFT OUTER JOIN PRO_REQUISITION PR ON R.REQ_ID = PR.REQ_ID 
LEFT OUTER JOIN HRM.EMPLOYEE E ON E.EMPLOYE_ID = R.HR_ID 
LEFT OUTER JOIN HRM.DEPARTMENT_LIST D ON D.DEPARTEMENT_ID = E.DEPARTEMENT_ID 
LEFT OUTER JOIN HRM.DESIGNATION DG ON DG.DESIGNATION_ID = E.DESIGNATION_ID
WHERE R.REQ_STATUS = ${Number(status)}`)


const selectRequisitionById = (req_id) => ExecuteIT(`SELECT R.REQ_ID, TO_CHAR(R.REQ_DATE,'DD-MM-YYYY') AS REQ_DATE, TO_CHAR(R.REQ_DATE,'HH12:MI AM') AS REQ_TIME, R.USER_REMARKS, PR.PRO_REQ_ID, PR.QUNTITY, PR.APR_QTY, PL.PRODUCT_ID, PL.PRODUCT_NAME FROM REQUISITION R
LEFT OUTER JOIN PRO_REQUISITION PR ON R.REQ_ID = PR.REQ_ID
LEFT OUTER JOIN PRODUCT_LIST PL ON PR.PRO_ID = PL.PRODUCT_ID
WHERE R.REQ_ID = ${Number(req_id)} AND R.REQ_STATUS = 0`);



/*------------- INSERT ------------*/
// INSERT requisition information
const insertRequisitionInfo = ({
  hrid,
  status,
  userRemarks
}) =>
  ExecuteIT(
    `INSERT INTO REQUISITION (HR_ID, REQ_STATUS, USER_REMARKS) VALUES (${Number(hrid)}, ${Number(status)}, '${userRemarks}') RETURN REQ_ID INTO :id`,
    { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
  );

const insertManyProRequisition = (array) => {
  const newArray = array;
  const statement = `INSERT INTO PRO_REQUISITION (REQ_ID, QUNTITY, APR_QTY, PRO_ID) VALUES (:REQ_ID, :QUNTITY, :APR_QTY, :PRO_ID)`;
  return ExecuteITMany(statement, newArray);
};

const insertManyIndProRequisition = (pro_req_id, array) => {
  const newArray = array.reduce((acc, obj) => {
    acc.push({
      PRO_REQ_ID: Number(pro_req_id),
      STR_PRO_ID: obj.STR_PRO_ID,
      IND_PRODUCT_ID: obj.IND_PRODUCT_ID,
      STATUS: obj.STATUS
    });
    return acc;
  }, []);
  const statement = `INSERT INTO IND_PRO_REQUISITION (PRO_REQ_ID, STR_PRO_ID, IND_PRODUCT_ID, STATUS) VALUES (:PRO_REQ_ID, :STR_PRO_ID, :IND_PRODUCT_ID, :STATUS)`; // STATUS = STATUS || 0;
  return ExecuteITMany(statement, newArray);
};

const insertSummaries = (data) =>
  ExecuteIT(
    `INSERT INTO PRODUCT_SUMMARIES (PRO_ID, STR_PRO_ID, TOTAL_OUT, SUM_TYPE) VALUES (${Number(
      data.PRO_ID
    )}, ${Number(data.STR_PRO_ID)}, ${Number(
      data.TOTAL_OUT
    )}, '${data.SUM_TYPE}') RETURN SUMMARY_ID INTO :id`,
    { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
  );


/*----------- UPDATE ----------- */
const updateRequisition = (data) => {
  if (data.REQ_ID == 1) {
    return ExecuteIT(
      `UPDATE REQUISITION SET REQ_STATUS = ${Number(data.REQ_STATUS)} WHERE REQ_ID = ${Number(data.REQ_ID)}`
    )
  } else {
    return ExecuteIT(
      `UPDATE REQUISITION SET REQ_STATUS = ${Number(data.REQ_STATUS)}, 
        STR_REMARKS = '${data.STR_REMARKS}' WHERE REQ_ID = ${Number(data.REQ_ID)}`
    )
  }
};

const updateStrBalance = (str_pro_id, apr_qty) =>
  ExecuteIT(
    `UPDATE STORE_PRODUCTS SET QUANTITY = QUANTITY - ${Number(
      str_pro_id
    )} WHERE STR_PRO_ID = ${Number(str_pro_id)}`
  );

const updateProRequisition = (pro_req_id, apr_qty) =>
  ExecuteIT(
    `UPDATE PRO_REQUISITION SET APR_QTY = ${Number(
      apr_qty
    )} WHERE PRO_REQ_ID = ${Number(pro_req_id)}`
  );

const updateManyIndProduct = (array) => {
  const newArray = array.reduce((acc, obj) => {
    acc.push({
      IND_PRODUCT_ID: obj.IND_PRODUCT_ID,
      STATUS: 1
    });
    return acc;
  }, []);
  const statement = `UPDATE IND_PRODUCT SET (STATUS) = (:STATUS) WHERE (IND_PRODUCT_ID) = (:IND_PRODUCT_ID)`;
  return ExecuteITMany(statement, newArray)
}

module.exports = {
  // selectProductBalance,
  selectUserRequisitions,
  selectUserAcceptRequisitions,
  selectStatusRequisitions,
  selectIndProductList,
  selectRequisitionById,
  insertRequisitionInfo,
  insertManyProRequisition,
  insertManyIndProRequisition,
  insertSummaries,
  updateRequisition,
  updateStrBalance,
  updateProRequisition,
  updateManyIndProduct

}