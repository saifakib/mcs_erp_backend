const { format } = require("date-fns");
const { ExecuteHR } = require("../../utils/hrDynamicController");


// track login activity
module.exports.loginActivity = (
  userId,
  type,
  device,
  ip,
  entryDate,
  entryTime,
  elapsedMin,
  token
) => {
  const n_date = format(new Date(entryDate), "dd-MM-yyyy");
  return ExecuteHR(
    `INSERT INTO AUDIT_LOG (USER_NAME, TYPE_NAME, LOG_SESSION, DEVICE, IP, ENTRY_DAY, ENTRY_TIME, ELAPSED_MIN) VALUES ('${userId}', '${type}', '${token}', '${device}', '${ip}', to_date('${n_date}', 'dd-mm-yy'), '${entryTime}', ${elapsedMin})`
  );
};

// update audit log
module.exports.updateAuditLog = (
  token,
  exitDay,
  exitTime
) => {
  const n_date = format(new Date(exitDay), "dd-MM-yyyy");
  return ExecuteHR(
    `UPDATE AUDIT_LOG SET EXIT_DAY=to_date('${n_date}', 'dd-mm-yy'), EXIT_TIME='${exitTime}' WHERE LOG_SESSION = '${token}'`
  );
};


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


// get all logs
module.exports.getAllLogs = () =>
  ExecuteHR(`select u.employe_id, al.type_name, al.device, al.ip, to_char(al.entry_day) as entry_day, al.entry_time, al.exit_time, al.elapsed_min, e.name_english, d.departement, d.departement_id, dg.designation from hrm.audit_log al left outer join hrm.users u
on al.user_name = u.user_id
left outer join hrm.employee e
on e.employe_id = u.employe_id
left outer join hrm.department_list d
on d.departement_id = e.departement_id
left outer join hrm.designation dg on
dg.designation_id = e.designation_id`);
