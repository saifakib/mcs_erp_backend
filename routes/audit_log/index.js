const router = require("express").Router();
const { auditReports } = require("../../controllers/audit_log");
// const { validateToken } = require("../../utils/JWT");

// get route
router.get("/", auditReports);

module.exports = router;
