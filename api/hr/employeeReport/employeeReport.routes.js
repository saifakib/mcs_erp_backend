const router = require("express").Router();
const { designationReports, designationReportCounts } = require("./employeeReport.controllers");
router.get("/getDesignationReport", designationReports);
router.get("/getDesignationReportCount", designationReportCounts);
module.exports = router;