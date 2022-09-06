const { oracledb } = require("../../../db/db");
const { Execute, ExecuteMany } = require("../../../utils/dynamicController");

/*------------- Get ------------*/
module.exports.getLastReqId = () =>
  Execute(`SELECT MAX(REQID) AS LAST_ID FROM STR_REQUISITIONS`);

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
  const statement = `INSERT INTO STR_PROREQUISITIONS (HRIDNO, REQUIID, PROID, PROREQUQTY, PREMARKS, APROQTY, PRODATE, PROMONTH) VALUES (:HRIDNO, :REQUIID, :PROID, :PROREQUQTY, :PREMARKS, :APROQTY, :PRODATE, :PROMONTH)`;
  return ExecuteMany(statement, array);
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
