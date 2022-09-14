const { Execute } = require("../../../utils/dynamicController");

/*-------------------------------- SELECT --------------------------------*/

const getEmployeeByDeptId = (deptid) => Execute(`SELECT E.EMPLOYE_ID, E.NAME_BANGLA, E.NAME_ENGLISH, E.MOBILE_PHONE, DG.DESIGNATION, DL.DEPARTEMENT FROM hrm.employee E LEFT OUTER JOIN hrm.designation DG ON E.DESIGNATION_ID = DG.DESIGNATION_ID LEFT OUTER JOIN hrm.department_list DL ON E.DEPARTEMENT_ID = DL.DEPARTEMENT_ID WHERE E.DEPARTEMENT_ID = ${deptid}`);
 

/*--------------------------------END SELECT --------------------------------*/


module.exports = {
    getEmployeeByDeptId
}
