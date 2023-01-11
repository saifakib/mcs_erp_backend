const router = require("express").Router();
const storeRoutes = require("./store");
const hrRoutes = require("./hr");
const itRoutes = require("./it");
const auth = require("./auth");
const auditLogs = require("./audit_log");

router.use("/store", storeRoutes);
router.use("/hr", hrRoutes);
router.use("/it", itRoutes);
router.use("/auth", auth);
router.use("/audit_logs", auditLogs);


module.exports = router;
