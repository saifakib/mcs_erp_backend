const { Execute } = require("../../../utils/dynamicController");


/*-------------------------------- SELECT --------------------------------*/

const selectLogActivityFilter = (query) => Execute(`SELECT * FROM STR_ACTIVITY_LOGS ${query}`)

/*--------------------------------END SELECT --------------------------------*/



/*-------------------------------- INSERT --------------------------------*/

const insertLogActivity = ({ hrid, action_type, log_detail, module, submodule }) =>
  Execute(
    `INSERT INTO STR_ACTIVITY_LOGS (HRID, ACTION_TYPE, LOG_DETAIL, MODULE, SUBMODULE) VALUES (${Number(hrid)}, '${action_type}', '${log_detail}', '${module}', '${submodule}')`
  );

/*--------------------------------END INSERT --------------------------------*/


module.exports = { selectLogActivityFilter, insertLogActivity }
