const { oracledb } = require("../../../db/db");
const { Execute, ExecuteMany } = require("../../../utils/dynamicController");

/*------------- Get ------------*/
module.exports.getLastReqNo = () =>
  Execute(`SELECT MAX(REQUISITIONNO) AS LAST_ID FROM STR_REQUISITIONS`);

module.exports.lastProRequiId = () =>
  Execute(`SELECT MAX(PROREQID) AS LAST_ID FROM STR_PROREQUISITIONS`);

module.exports.getProductBalance = (id) =>
  Execute(`SELECT PROQTY FROM STR_STOREPRODUCTS WHERE PROID = ${Number(id)}`);

module.exports.getReqInfo = (id) =>
  Execute(`SELECT REQUITIME || ', ' || REQUIDATE AS DATE_TIME, 
  case
  when REQUISTATUS = 0 then 'Pending'
  when REQUISTATUS = 1 then 'Pending'
  when REQUISTATUS = 2 then 'Pending To Accept'
  when REQUISTATUS = 3 then 'Done' end Status FROM STR_REQUISITIONS WHERE REQID = ${Number(
    id
  )}`);

// get requisition by id
module.exports.getRequisitionById = (
  id,
  search = "%%",
  page = 0,
  limit = 1000
) => {
  let offset = limit * page;
  return Execute(`SELECT R.REQID, R.REQUITIME || ', ' || R.REQUIDATE AS DATE_TIME, R.REQUISITIONNO, case
  when REQUISTATUS = 0 then 'Pending'
  when REQUISTATUS = 1 then 'Pending'
  when REQUISTATUS = 2 then 'Approved'
  when REQUISTATUS = 3 then 'Done' end Status, PR.PROREQUQTY, PR.APROQTY 
  FROM STR_REQUISITIONS R LEFT OUTER JOIN STR_PROREQUISITIONS PR ON PR.HRIDNO = R.PROFILEHRID WHERE PROFILEHRID = ${Number(
    id
  )} AND LOWER(REQUISITIONNO) LIKE LOWER('${search}') ORDER BY REQID OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`);
};

module.exports.getRequisitionDetailsById = (id) => {
  return Execute(`SELECT PR.REQUIID, PR.PROREQUQTY,
  PR.APROQTY,
  SP.PRONAME || ',' || SP.PRONAMETWO AS PRODUCT_NAME,
  PR.PREMARKS,
  U.UNIT
  FROM STR_PROREQUISITIONS PR
  LEFT OUTER JOIN STR_STOREPRODUCTS SP
  ON SP.PROID = PR.PROID
  LEFT OUTER JOIN STR_UNITS U
  ON U.UNIT_ID = SP.PRODUNIT
  WHERE REQUIID = ${Number(id)} ORDER BY PR.PROREQID`);
};

/*------------- Post ------------*/
// post requisition information
module.exports.postRequisitionInfo = ({
  profilehrId,
  requiTime,
  requiMonth,
  requiDate,
  lastReqNo,
  status,
}) =>
  Execute(
    `INSERT INTO STR_REQUISITIONS (REQUISITIONNO, REQUITIME, REQUIDATE, REQUIMONTH, REQUISTATUS, PROFILEHRID) VALUES ('${lastReqNo}', '${requiTime}', '${requiDate}', '${requiMonth}', ${Number(
      status
    )}, ${Number(profilehrId)}) RETURN REQID INTO :id`,
    { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
  );

//manual post requisition
module.exports.manualPostRequisitionInfo = (
  lastReqN,
  hrid,
  requitime,
  requidate,
  requimonth,
  approvedby
) =>
  Execute(
    `INSERT INTO STR_REQUISITIONS (REQUISITIONNO, PROFILEHRID, REQUITIME, REQUIDATE, REQUIMONTH, REQUISTATUS, APPROVED, APPROVEDBY, APROVEDTIME, APPROVEDDATE, STOREACCEPT, PROACCEPT, PROACCEPTTIME, PROACCEPTDATE) VALUES ('${lastReqN}', ${Number(
      hrid
    )}, '${requitime}', '${requidate}', '${requimonth}', ${Number(3)}, ${Number(
      1
    )}, '${approvedby}', '${requitime}', '${requidate}', ${Number(1)}, ${Number(
      1
    )}, '${requitime}', '${requidate}') RETURN REQID INTO :id`,
    { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
  );

// post requisition details
module.exports.postReqProduct = (array) => {
  const newArray = array;
  const statement = `INSERT INTO STR_PROREQUISITIONS (PROREQID, HRIDNO, REQUIID, PROID, PROREQUQTY, PREMARKS, APROQTY, PRODATE, PROMONTH) VALUES (:PROREQID, :HRIDNO, :REQUIID, :PROID, :PROREQUQTY, :PREMARKS, :APROQTY, :PRODATE, :PROMONTH)`;
  return ExecuteMany(statement, newArray);
};

/*------------- Put ------------*/
// update requisition by admin
module.exports.updateRequisitionInfo = (updatedInfo) => {
  const {
    REQUISTATUS,
    APPROVED,
    APPROVEDBY,
    APROVEDTIME,
    APPROVEDDATE,
    REQID,
  } = updatedInfo;

  return Execute(
    `UPDATE STR_REQUISITIONS SET REQUISTATUS = ${Number(
      REQUISTATUS
    )}, APPROVED = ${Number(
      APPROVED
    )}, APPROVEDBY = '${APPROVEDBY}', APROVEDTIME = '${APROVEDTIME}', APPROVEDDATE = '${APPROVEDDATE}' WHERE REQID = ${REQID}`
  );
};

module.exports.updateReqProducts = (products) => {
  const newArray = products.map((item) => {
    const obj = {
      APPROVEQTY: item.APPROVEQTY,
      ADMINAPPRO: item.APPROVEQTY,
      APPROVEREMARKS: item.REMARKS,
      PROREQID: item.PROREQID,
    };
    return obj;
  });

  const statement = `UPDATE STR_PROREQUISITIONS SET APROQTY = :APPROVEQTY, ADMINAPPRO = :ADMINAPPRO, APPROVEREMARKS = :APPROVEREMARKS WHERE PROREQID = :PROREQID`;

  return ExecuteMany(statement, newArray);
};

// update requisition for store_officer
module.exports.updateBalance = ({ PROID, PROQTY }) =>
  Execute(
    `UPDATE STR_STOREPRODUCTS SET PROQTY = ${Number(
      PROQTY
    )} WHERE PROID = ${Number(PROID)}`
  );

module.exports.updateStoreProducts = ({
  APPROQTY,
  REQUPRODSTATUS,
  STOREREMARKS,
  PROREQID,
}) => {
  return Execute(
    `UPDATE STR_PROREQUISITIONS SET APROQTY = ${Number(
      APPROQTY
    )}, REQUPRODSTATUS = ${Number(
      REQUPRODSTATUS
    )}, STOREREMARKS = '${STOREREMARKS}' WHERE PROREQID = ${Number(PROREQID)}`
  );
};

module.exports.insertSummeries = (data) => {
  const {
    PRODUCTID,
    PRODUCTNAME,
    PRODNAMETWO,
    PROCAT,
    INTIALQTY,
    TOTALBALANCE,
    TOTALOUT,
    PRESENTBALANCE,
    SUMMDATE,
    SUMMMONTH,
    REQUISITIONFOR,
    SUMMERTYPE,
  } = data;

  console.log(data);

  return Execute(
    `INSERT INTO STR_PRODUCTSUMMARIES (PRODUCTID, PRODUCTNAME, PRODNAMETWO, INTIALQTY, TOTALBALANCE, TOTALOUT, PRESENTBALANCE, SUMMDATE, SUMMMONTH, REQUISITIONFOR, SUMMERTYPE, PROCAT) VALUES (${Number(
      PRODUCTID
    )}, '${PRODUCTNAME}', '${PRODNAMETWO}', ${Number(INTIALQTY)}, ${Number(
      TOTALBALANCE
    )}, ${Number(TOTALOUT)}, ${Number(
      PRESENTBALANCE
    )}, '${SUMMDATE}', '${SUMMMONTH}', ${Number(
      REQUISITIONFOR
    )}, '${SUMMERTYPE}', ${Number(PROCAT)})`
  );
};
