const { Execute } = require("../../../utils/dynamicController");

/*-------------------------------- SELECT --------------------------------*/

const insertLogActivity = ({ hrid, action_type, log_detail }) =>
  Execute(
    `INSERT INTO STR_ACTIVITY_LOGS (HRID, ACTION_TYPE, LOG_DETAIL) VALUES (${Number(hrid)}, '${action_type}', '${log_detail}')`
  );

/*--------------------------------END SELECT --------------------------------*/


module.exports = { insertLogActivity }
