const { getAllLogs } = require("../../services/audit_log");
const { createResponse } = require("../../utils/responseGenerator");
const { format } = require("date-fns");
const { time_difference } = require("../../utils/manualTimeDifference");

// Utils
const addMinutesDiff = (rows) => {
  const changes = rows.reduce((acc, obj, index) => {
    let makeObj = {};
    if (obj.EXIT_TIME) {
      let diff =
        time_difference(obj.EXIT_TIME) - time_difference(obj.ENTRY_TIME);
      makeObj = {
        ...obj,
        DIFF_MIN: diff == 0 ? null : diff,
      };
    } else {
      makeObj = {
        ...obj,
        DIFF_MIN: null,
      };
    }
    acc[index] = makeObj;
    return acc;
  }, []);
  return changes;
};

/**
 * Report - Logs
 */
module.exports.auditReports = async (req, res, next) => {
  const { hrid, deptid, tdate, fdate, month } = req.query;
  try {
    const { rows } = await getAllLogs();
    if (
      hrid == "" &&
      deptid == "" &&
      tdate == "" &&
      fdate == "" &&
      month == ""
    ) {
      res.json(createResponse({ logs: addMinutesDiff(rows) }));
    } else if (hrid) {
      if (fdate && tdate) {
        const response = rows.filter(
          (log) =>
            log.EMPLOYE_ID == hrid &&
            new Date(`${log.ENTRY_DAY}`) >= new Date(`${fdate}`) &&
            new Date(`${log.ENTRY_DAY}`) <= new Date(`${fdate}`)
          //log.ENTRY_DAY != null && console.log(new Date(`${log.ENTRY_DAY}`) <= new Date(`${fdate}`))
        );
        res.json(createResponse({ logs: addMinutesDiff(response) }));
      } else if (fdate && !tdate) {
        const response = rows.filter(
          (log) =>
            log.EMPLOYE_ID == hrid &&
            new Date(`${log.ENTRY_DAY}`) >= new Date(`${fdate}`) &&
            new Date(`${log.ENTRY_DAY}`) <= new Date()
          //log.ENTRY_DAY != null && console.log(new Date(`${log.ENTRY_DAY}`) <= new Date(`${fdate}`))
        );
        res.json(createResponse({ logs: addMinutesDiff(response) }));
      } else if (month) {
        const response = rows.filter(
          (log) =>
            log.EMPLOYE_ID == hrid && log.ENTRY_DAY?.split("-")[1] == month
        );
        res.json(createResponse({ logs: addMinutesDiff(response) }));
      } else {
        const response = rows.filter((log) => log.EMPLOYE_ID == hrid);
        res.json(createResponse({ logs: addMinutesDiff(response) }));
      }
    } else if (deptid) {
      if (fdate || tdate) {
        const response = rows.filter(
          (log) =>
            log.DEPARTEMENT_ID == Number(deptid) &&
            ((fdate &&
              log.ENTRY_DAY != null &&
              new Date(`${log.ENTRY_DAY}`) >= new Date(`${fdate}`)) ||
              (tdate &&
                log.ENTRY_DAY != null &&
                new Date(`${log.ENTRY_DAY}`) <= new Date(`${fdate}`)))
        );
        res.json(createResponse({ logs: addMinutesDiff(response) }));
      } else if (month) {
        const response = rows.filter(
          (log) =>
            log.DEPARTEMENT_ID == Number(deptid) &&
            log.ENTRY_DAY?.split("-")[1] == month
        );
        res.json(createResponse({ logs: addMinutesDiff(response) }));
      } else {
        const response = rows.filter(
          (log) => log.DEPARTEMENT_ID == Number(deptid)
        );
        res.json(createResponse({ logs: addMinutesDiff(response) }));
      }
    } else if (month) {
      const response = rows.filter(
        (log) => log.ENTRY_DAY?.split("-")[1] == month
      );
      res.json(createResponse({ logs: addMinutesDiff(response) }));
    } else if (fdate || tdate) {
      const response = rows.filter(
        (log) =>
          (fdate &&
            log.ENTRY_DAY != null &&
            new Date(`${log.ENTRY_DAY}`) >= new Date(`${fdate}`)) ||
          (tdate &&
            log.ENTRY_DAY != null &&
            new Date(`${log.ENTRY_DAY}`) <= new Date(`${fdate}`))
      );
      res.json(createResponse({ logs: addMinutesDiff(response) }));
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
