const { format } = require("date-fns");
const { ExecuteHR } = require("../../utils/hrDynamicController");


/*-------------------------------- SELECT --------------------------------*/
// track login activity
module.exports.loginActivity = (userId, type, device, ip, entryDate, entryTime, elapsedMin, token) => {
  const n_date = format(new Date(entryDate), "dd-MM-yyyy");
  return ExecuteHR(
    `INSERT INTO AUDIT_LOG (USER_NAME, TYPE_NAME, LOG_SESSION, DEVICE, IP, ENTRY_DAY, ENTRY_TIME, ELAPSED_MIN) VALUES ('${userId}', '${type}', '${token}', '${device}', '${ip}', to_date('${n_date}', 'dd-mm-yy'), '${entryTime}', ${elapsedMin})`
  );
};

// get all logs
module.exports.getAllLogs = () =>
  ExecuteHR(`SELECT U.EMPLOYE_ID, AL.TYPE_NAME, AL.DEVICE, AL.IP, TO_CHAR(AL.ENTRY_DAY, 'YYYY-MM-DD') AS ENTRY_DAY , AL.ENTRY_TIME, AL.EXIT_TIME, AL.ELAPSED_MIN, E.NAME_ENGLISH, D.DEPARTEMENT, D.DEPARTEMENT_ID, DG.DESIGNATION FROM HRM.AUDIT_LOG AL LEFT OUTER JOIN HRM.USERS U
  ON AL.USER_NAME = U.USER_ID
  LEFT OUTER JOIN HRM.EMPLOYEE E
  ON E.EMPLOYE_ID = U.EMPLOYE_ID
  LEFT OUTER JOIN HRM.DEPARTMENT_LIST D
  ON D.DEPARTEMENT_ID = E.DEPARTEMENT_ID
  LEFT OUTER JOIN HRM.DESIGNATION DG ON
  DG.DESIGNATION_ID = E.DESIGNATION_ID  ORDER BY
  ENTRY_DAY DESC`);

/*-------------------------------- END SELECT --------------------------------*/




/*------------------------------------  INSERT --------------------------------------*/
// track logout activity
module.exports.logOutActivity = (
  userId,
  type,
  device,
  ip,
  entryDate,
  entryTime,
  elapsedMin
) => {
  const n_date = format(new Date(entryDate), "dd-MM-yyyy");
  return ExecuteHR(
    `INSERT INTO AUDIT_LOG (USER_NAME, TYPE_NAME, DEVICE, IP, ENTRY_DAY, ENTRY_TIME, ELAPSED_MIN) VALUES ('${userId}', '${type}', '${device}', '${ip}', to_date('${n_date}', 'dd-mm-yy'), '${entryTime}', ${Number(
      elapsedMin
    )})`
  );
};
/*------------------------------------ END INSERT --------------------------------------*/





/*------------------------------------  UPDATE --------------------------------------*/
// update audit log
module.exports.updateAuditLog = (token, exitDay, exitTime) => {
  const n_date = format(new Date(exitDay), "dd-MM-yyyy");
  return ExecuteHR(
    `UPDATE AUDIT_LOG SET EXIT_DAY=to_date('${n_date}', 'dd-mm-yy'), EXIT_TIME='${exitTime}' WHERE LOG_SESSION = '${token}'`
  );
};
/*------------------------------------  END UPDATE --------------------------------------*/





