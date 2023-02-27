const { ExecuteHR } = require("../../utils/hrDynamicController");


/*-------------------------------- SELECT --------------------------------*/
// get user by user_id
module.exports.getUserByUserName = (user) =>
  ExecuteHR(
    `SELECT U.USER_ID, U.PASSWORD, U.EMPLOYE_ID, E.NAME_ENGLISH,E.MOBILE_PHONE, D.DEPARTEMENT, DG.DESIGNATION, U.ROLE_ID, U.ENABLE FROM USERS U 
  left outer join HRM.EMPLOYEE E
  ON E.EMPLOYE_ID = U.EMPLOYE_ID
  LEFT OUTER JOIN HRM.DEPARTMENT_LIST D
  ON D.DEPARTEMENT_ID = E.DEPARTEMENT_ID
  LEFT OUTER JOIN HRM.DESIGNATION DG ON
  DG.DESIGNATION_ID = E.DESIGNATION_ID WHERE U.USER_ID = '${user}'`
  );

// get max employe_id
module.exports.getMaxEMP = () =>
  ExecuteHR(`SELECT MAX(EMPLOYE_ID) as EMPLOYE_ID FROM EMPLOYEE`);

/*-------------------------------- END SELECT --------------------------------*/
