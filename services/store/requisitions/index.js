const { oracledb } = require("../../../db/db");
const { Execute, ExecuteMany } = require("../../../utils/dynamicController");

/*------------- get ------------*/
module.exports.getLastReqId = () =>
  Execute(`SELECT MAX(REQID) AS LAST_ID FROM STR_REQUISITIONS`);

/*------------- post ------------*/
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
module.exports.postReqProduct = async (array) => {
  const statement = `INSERT INTO STR_PROREQUISITIONS (HRIDNO, REQUIID, PROID, PROREQUQTY, PREMARKS, APROQTY, PRODATE, PROMONTH) VALUES (:HRIDNO, :REQUIID, :PROID, :PROREQUQTY, :PREMARKS, :APROQTY, :PRODATE, :PROMONTH)`;
  return ExecuteMany(statement, array);
};
