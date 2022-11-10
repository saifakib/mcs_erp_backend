const { getAllLogs } = require("../../services/audit_log");
const { createResponse } = require("../../utils/responseGenerator");
const { format } = require("date-fns");
const { time_difference } = require("../../utils/manualTimeDifference");


// Utils
const addMinutesDiff = (rows) => {
  const changes = rows.reduce((acc, obj, index) => {
    let makeObj = {};
    if (obj.EXIT_TIME) {
      makeObj = {
        ...obj,
        "DIFF_MIN": time_difference(obj.EXIT_TIME) - time_difference(obj.ENTRY_TIME) 
      }
    } else {
      makeObj = {
        ...obj,
        "DIFF_MIN": null 
      }
    }
    acc[index] = makeObj
    return acc;
  }, []);
  return changes;
}


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
        res.json(createResponse({ logs: addMinutesDiff(response) }));
      }
      else if (month) {
        const response = rows.filter((log) =>
          log.NAME_ENGLISH == name && log.ENTRY_DAY?.split("-")[1] == month
        )
        res.json(createResponse({ logs: addMinutesDiff(response) }));
      } else {
        const response = rows.filter((log) =>
          log.NAME_ENGLISH == name
        )
        res.json(createResponse({ logs: addMinutesDiff(response) }));
      }
    }
    else if (deptid) {
      if (fdate || tdate) {
        const response = rows.filter((log) => {
          log.DEPARTEMENT_ID == Number(deptid) && (fdate && log.ENTRY_DAY == format(new Date(fdate), "dd-MMM-yy").toUpperCase()) || tdate && (log.ENTRY_DAY == format(new Date(tdate), "dd-MMM-yy").toUpperCase())
        })
        res.json(createResponse({ logs: addMinutesDiff(response) }));
      }
      else if (month) {
        const response = rows.filter((log) =>
          log.DEPARTEMENT_ID == Number(deptid) && log.ENTRY_DAY?.split("-")[1] == month
        )
        res.json(createResponse({ logs: addMinutesDiff(response) }));
      } else {
        const response = rows.filter((log) => log.DEPARTEMENT_ID == Number(deptid))
        res.json(createResponse({ logs: addMinutesDiff(response) }));
      }
    } else if (month) {
      const response = rows.filter((log) =>
        log.ENTRY_DAY?.split("-")[1] == month
      )
      res.json(createResponse({ logs: addMinutesDiff(response) }));
    }
  } catch (err) {
    next(err);
  }
};




