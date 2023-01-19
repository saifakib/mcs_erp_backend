const { Execute } = require("../../../utils/dynamicController");

const condition = {
  true: 'AND',
  false: ''
};


/*-------------------------------- SELECT --------------------------------*/

const selectLogActivity = () =>
  Execute(
    `SELECT * FROM STR_ACTIVITY_LOGS`
  );

const selectLogActivityFilter = (query) => Execute(`SELECT * FROM STR_ACTIVITY_LOGS ${query}`)

/*--------------------------------END SELECT --------------------------------*/



/*-------------------------------- INSERT --------------------------------*/

const insertLogActivity = ({ hrid, action_type, log_detail, module, submodule }) =>
  Execute(
    `INSERT INTO STR_ACTIVITY_LOGS (HRID, ACTION_TYPE, LOG_DETAIL, MODULE, SUBMODULE) VALUES (${Number(hrid)}, '${action_type}', '${log_detail}', '${module}', '${submodule}')`
  );

/*--------------------------------END INSERT --------------------------------*/


module.exports = { selectLogActivity, selectLogActivityFilter, insertLogActivity }
