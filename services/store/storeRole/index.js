const { Execute } = require("../../../utils/dynamicController");

/*-------------------------------- SELECT --------------------------------*/

const getUserFromRole = ({ emp_id }) => Execute(`
SELECT * FROM STR_ROLE WHERE EMP_ID = ${Number(emp_id)}`);



/*--------------------------------END SELECT --------------------------------*/


module.exports = { getUserFromRole }
