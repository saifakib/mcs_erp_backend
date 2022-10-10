const router = require("express").Router();
const {
  entriesProductReport,
  productStockStatus,
  productLogs,
  requisitionLogs,
} = require("../../../controllers/store/reports");

// get route
router.get("/entries", entriesProductReport);
router.get("/stockStatus", productStockStatus);
router.get("/productlogs", productLogs);
router.get("/requisitions", requisitionLogs);

module.exports = router;
