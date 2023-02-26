const { Execute } = require("../../../utils/dynamicController");


/*-------------------------------- SELECT --------------------------------*/

const selectLogActivityFilter = (query) => Execute(`SELECT hrid, UPPER(ACTION_TYPE) AS ACTION_TYPE, LOG_DETAIL, UPPER(MODULE) AS MODULE, UPPER(SUBMODULE) AS SUBMODULE, TO_CHAR(LOG_TIME,'MON DD,YYYY') AS DATES, TO_CHAR(LOG_TIME,'HH:MI SS AM') AS TIMES FROM STR_ACTIVITY_LOGS ${query}`)

/*--------------------------------END SELECT --------------------------------*/



/*-------------------------------- INSERT --------------------------------*/

const insertLogActivity = ({ hrid, action_type, log_detail, module, submodule }) =>
  Execute(
    `INSERT INTO STR_ACTIVITY_LOGS (HRID, ACTION_TYPE, LOG_DETAIL, MODULE, SUBMODULE) VALUES (${Number(hrid)}, '${action_type}', '${log_detail}', '${module}', '${submodule}')`
  );

/*--------------------------------END INSERT --------------------------------*/


module.exports = { selectLogActivityFilter, insertLogActivity }
