const { oracledb } = require("../../../db/db");
const { Execute, ExecuteMany } = require("../../../utils/dynamicController");

/*------------- Get ------------*/
module.exports.getLastReqNo = () =>
  Execute(`SELECT MAX(REQID) AS LAST_ID FROM STR_REQUISITIONS`);

module.exports.lastProRequiId = () =>
  Execute(`SELECT MAX(PROREQID) AS LAST_ID FROM STR_PROREQUISITIONS`);

// get requisition by id
module.exports.getRequisitionById = (
  id,
  search = "%%",
  page = 0,
  limit = 1000
) => {
  let offset = limit * page;
  return Execute(`SELECT REQUITIME || ', ' || REQUIDATE AS DATE_TIME, REQUISITIONNO, TOTALREQUIQTY, TOTALAPPROVED, case
  when REQUISTATUS = 0 then 'Pending'
  when REQUISTATUS = 1 then 'Pending'
  when REQUISTATUS = 2 then 'Approved'
  when REQUISTATUS = 3 then 'Done' end Status FROM STR_REQUISITIONS WHERE PROFILEHRID = ${Number(
    id
  )}
  AND LOWER(REQUISITIONNO) LIKE LOWER('${search}') ORDER BY REQID OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`);
};

module.exports.getRequisitionDetailsById = (id) => {
  return Execute(`SELECT PR.REQUIID, PR.PROREQUQTY,
  PR.APROQTY,
  SP.PRONAME || ',' || SP.PRONAMETWO AS PRODUCT_NAME,
  U.UNIT,
  R.REQUITIME || ',' || R.REQUIDATE AS DATE_TIME,
  case
    when R.REQUISTATUS = 0 then 'Pending'
    when R.REQUISTATUS = 1 then 'Pending'
    when R.REQUISTATUS = 2 then 'Pending To Accept'
    when R.REQUISTATUS = 3 then 'Done'
  end STATUS
  FROM STR_PROREQUISITIONS PR
  LEFT OUTER JOIN STR_STOREPRODUCTS SP
  ON SP.PROID = PR.PROID
  LEFT OUTER JOIN STR_UNITS U
  ON U.UNIT_ID = SP.PRODUNIT
  LEFT OUTER JOIN STR_REQUISITIONS R
  ON PR.REQUIID = R.REQID
  WHERE REQUIID = ${Number(id)}`);
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
