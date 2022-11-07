const router = require("express").Router();
const { getAllLogs } = require("../../controllers/audit_log");
// const { validateToken } = require("../../utils/JWT");

// get route
router.get("/", getAllLogs);

module.exports = router;
