const { ExecuteIT } = require("../../../utils/itDynamicController");

/*------------- SELECT ------------*/





/*------------- INSERT ------------*/
// INSERT requisition information
const insertRequisitionInfo = ({
  hrid,
  requiDate,
  status,
  userRemarks
}) =>
  ExecuteIT(
    `INSERT INTO userRemarks (HR_ID, REQ_DATE, REQ_STATUS, USER_REMARKS) VALUES (${Number(hrid)}, '${requiDate}', ${Number(profilehrId)}, ${Number(status)}, '${userRemarks}') RETURN REQ_ID INTO :id`,
    { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
  );

module.exports = {
  insertRequisitionInfo
}