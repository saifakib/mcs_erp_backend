const router = require("express").Router();
const { auditReports } = require("../../controllers/audit_log");
const { validateToken } = require("../../middlewares/JWT");

// get route
router.get("/", validateToken, auditReports);

module.exports = router;
