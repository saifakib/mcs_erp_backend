const { Execute } = require("../../../utils/dynamicController");

/*-------------------------------- SELECT --------------------------------*/

const getEmployeeByDeptId = (deptid) => Execute(`SELECT E.NAME_BANGLA, E.NAME_ENGLISH, E.MOBILE_PHONE, DG.DESIGNATION FROM hrm.employee E LEFT OUTER JOIN hrm.designation DG ON E.DESIGNATION_ID = DG.DESIGNATION_ID WHERE DEPARTEMENT_ID = ${deptid}`);



/*--------------------------------END SELECT --------------------------------*/


module.exports = {
    getEmployeeByDeptId
}
