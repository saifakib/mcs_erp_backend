const { ExecuteIT } = require("../../../utils/itDynamicController");
const { oracledb } = require("../../../db/db");

/*------------- INSERT ------------*/
// INSERT maintanance request
const insertMaintananceReq = (data) =>
    ExecuteIT(
        `INSERT INTO MAINTENANCE (HR_ID, IND_PRO_ID, IND_PRO_REQ_ID, STATUS, USER_REMARKS) VALUES (${Number(data.hrid)}, ${Number(data.indProId)}, ${Number(data.indProReqId)}, ${Number(data.status)}, '${data.userRemarks}')`,
        { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
    );


/*-------------- UPDATE ---------------*/
// maintanance statue
const updateMaintanance = (status, maintanance_id) => ExecuteIT(`UPDATE MAINTENANCE SET STATUS = ${Number(status)} WHERE MAINTENANCE_ID = ${Number(maintanance_id)} `);

module.exports = {
    insertMaintananceReq, updateMaintanance
}