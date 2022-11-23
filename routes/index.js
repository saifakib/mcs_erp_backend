const router = require("express").Router();
const storeRoutes = require("./store");
const hrRoutes = require("./hr");
const auth = require("./auth");
const auditLogs = require("./audit_log");

router.use("/store", storeRoutes);
router.use("/hr", hrRoutes);
router.use("/auth", auth);
router.use("/audit_logs", auditLogs);

module.exports = router;
