const { ExecuteIT, ExecuteITMany } = require("../../../utils/itDynamicController");

/*------------- SELECT ------------*/

// const selectProductBalance = (str_pro_id) =>
//   ExecuteIT(`SELECT QUANTITY FROM STORE_PRODUCTS WHERE STR_PRO_ID = ${Number(str_pro_id)}`);

const selectIndProductList = (str_pro_id, status) => ExecuteIT(`SELECT * FROM IND_PRODUCT WHERE STR_PRO_ID = ${Number(str_pro_id)} AND STATUS = ${Number(status)}`);



/*------------- INSERT ------------*/
// INSERT requisition information
const insertRequisitionInfo = ({
  hrid,
  requiDate,
  status,
  userRemarks
}) =>
  ExecuteIT(
    `INSERT INTO REQUISITION (HR_ID, REQ_DATE, REQ_STATUS, USER_REMARKS) VALUES (${Number(hrid)}, '${requiDate}', ${Number(profilehrId)}, ${Number(status)}, '${userRemarks}') RETURN REQ_ID INTO :id`,
    { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
  );

const insertManyProRequisition = (array) => {
  const newArray = array;
  const statement = `INSERT INTO PRO_REQUISITION (REQ_ID, QUNTITY, APR_QTY, PRO_ID) VALUES (:REQ_ID, :QUNTITY, :APR_QTY, :PRO_ID)`;
  return ExecuteITMany(statement, newArray);
};

const insertManyIndProRequisition = (pro_req_id, array) => {
  const newArray = array;
  const statement = `INSERT INTO IND_PRO_REQUISITION (PRO_REQ_ID, STR_PRO_ID, IND_PRODUCT_ID, STATUS) VALUES (:${Number(pro_req_id)}, :STR_PRO_ID, :IND_PRODUCT_ID, :0)`; // STATUS = STATUS || 0;
  return ExecuteITMany(statement, newArray);
};


/*----------- UPDATE ----------- */
const updateRequisition = (data) => ExecuteIT(
  `UPDATE REQUISITION SET REQ_STATUS = ${Number(data.REQ_STATUS)}, 
    STR_REMARKS = '${data.STR_REMARKS}' WHERE REQ_ID = ${Number(data.REQ_ID)}`
);

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
  const newArray = array;
  const statement = `UPDATE IND_PRODUCT (STATUS) VALUES (:1) WHERE IND_PRODUCT_ID = :IND_PRODUCT_ID`
  return ExecuteITMany(statement, newArray)
}

module.exports = {
  // selectProductBalance,
  selectIndProductList,
  insertRequisitionInfo,
  insertManyProRequisition,
  insertManyIndProRequisition,
  updateRequisition,
  updateStrBalance,
  updateProRequisition,
  updateManyIndProduct

}