const { getAllLogs } = require("../../services/audit_log");
const { createResponse } = require("../../utils/responseGenerator");
const { format } = require("date-fns");

module.exports.getAllLogs = async (req, res, next) => {
  try {
    const { rows } = await getAllLogs();
    res.json(createResponse(rows));
  } catch (error) {
    next(error.message);
  }
};

/**
 * Report - Logs
 */
module.exports.auditReports = async (req, res, next) => {
  const { name, deptid, tdate, fdate, month } = req.query;
  try {
    const { rows } = await getAllLogs();
    if (name == '' && deptid == '' && tdate == '' && fdate == '' && month == '') {
      res.json(createResponse({ logs: rows }));
    }
    else if (name) {
      if (fdate || tdate) {
        const response = rows.filter((log) =>
          log.NAME_ENGLISH == name && (fdate && log.ENTRY_DAY == format(new Date(fdate), "dd-MMM-yy").toUpperCase()) || tdate && (log.ENTRY_DAY == format(new Date(tdate), "dd-MMM-yy").toUpperCase())
        )
        res.json(createResponse({ logs: response }));
      }
      else if (month) {
        const response = rows.filter((log) => 
          log.NAME_ENGLISH == name && log.ENTRY_DAY?.split("-")[1] == month
        )
        res.json(createResponse({ logs: response }));
      } else {
        const response = rows.filter((log) => 
          log.NAME_ENGLISH == name
        )
        res.json(createResponse({ logs: response }));
      }
    }
    else if (deptid) {
      if (fdate || tdate) {
        const response = rows.filter((log) => {
          log.DEPARTEMENT_ID == Number(deptid) && (fdate && log.ENTRY_DAY == format(new Date(fdate), "dd-MMM-yy").toUpperCase()) || tdate && (log.ENTRY_DAY == format(new Date(tdate), "dd-MMM-yy").toUpperCase())
        })
        res.json(createResponse({ logs: response }));
      }
      else if (month) {
        const response = rows.filter((log) => 
          log.DEPARTEMENT_ID == Number(deptid) && log.ENTRY_DAY?.split("-")[1] == month
        )
        res.json(createResponse({ logs: response }));
      } else {
        const response = rows.filter((log) => log.DEPARTEMENT_ID == Number(deptid))
        res.json(createResponse({ logs: response }));
      }
    }
  } catch (err) {
    console.log(err)
    next(err);
  }
};




